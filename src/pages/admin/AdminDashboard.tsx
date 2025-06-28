
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AdminDashboardHeader from '../../components/admin/AdminDashboardHeader';
import AdminDashboardMain from '../../components/admin/AdminDashboardMain';
import { MenuItem } from '../../types/MenuItem';
import { useToast } from '@/hooks/use-toast';

interface FilterState {
  restaurant?: string;
  priceMin?: number;
  priceMax?: number;
}

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [randomItemId, setRandomItemId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing admin session on component mount
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('admin_logged_in');
    if (adminLoggedIn === 'true') {
      setIsAuthenticated(true);
    } else {
      navigate('/ad-login');
    }
  }, [navigate]);

  const { data: menuItems, isLoading, refetch } = useQuery({
    queryKey: ['adminMenuItems'],
    queryFn: async () => {
      const response = await fetch('https://menu-backend-56ur.onrender.com/api/menuitems');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    setIsAuthenticated(false);
    setShowForm(false);
    setEditingItem(null);
    navigate('/');
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    refetch();
    toast({
      title: "Success!",
      description: editingItem ? "Menu item updated successfully." : "Menu item added successfully.",
    });
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://menu-backend-56ur.onrender.com/api/menuitems/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      
      refetch();
      toast({
        title: "Deleted!",
        description: "Menu item deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setRandomItemId(null);
  };

  const handleRandomItem = () => {
    if (menuItems && menuItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * menuItems.length);
      setRandomItemId(menuItems[randomIndex].id);
      setFilters({});
    }
  };

  const handleViewRestaurants = () => {
    navigate('/restaurants');
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardHeader
        onAddItem={handleAddItem}
        onLogout={handleLogout}
        onViewRestaurants={handleViewRestaurants}
      />
      
      <AdminDashboardMain
        showForm={showForm}
        editingItem={editingItem}
        filters={filters}
        randomItemId={randomItemId}
        menuItems={menuItems}
        isLoading={isLoading}
        onFilterChange={handleFilterChange}
        onRandomItem={handleRandomItem}
        onFormSuccess={handleFormSuccess}
        onFormCancel={handleFormCancel}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminDashboard;
