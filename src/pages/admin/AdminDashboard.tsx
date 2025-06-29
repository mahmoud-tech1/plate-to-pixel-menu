
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
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [randomItemId, setRandomItemId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing admin session on component mount
  useEffect(() => {
    const adminSession = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin_session='));
    
    if (adminSession) {
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
    // Clear all cookies and session data
    document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'restaurant_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('restaurantSession');
    localStorage.removeItem('restaurantId');
    
    setIsAuthenticated(false);
    setShowForm(false);
    setShowRestaurantForm(false);
    setEditingItem(null);
    navigate('/ad-login');
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleAddRestaurant = () => {
    setShowRestaurantForm(true);
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

  const handleRestaurantFormSuccess = () => {
    setShowRestaurantForm(false);
    refetch();
    toast({
      title: "Success!",
      description: "Restaurant created successfully.",
    });
  };

  const handleRestaurantFormCancel = () => {
    setShowRestaurantForm(false);
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
        onAddRestaurant={handleAddRestaurant}
        onLogout={handleLogout}
        onViewRestaurants={handleViewRestaurants}
      />
      
      <AdminDashboardMain
        showForm={showForm}
        showRestaurantForm={showRestaurantForm}
        editingItem={editingItem}
        filters={filters}
        randomItemId={randomItemId}
        menuItems={menuItems}
        isLoading={isLoading}
        onFilterChange={handleFilterChange}
        onRandomItem={handleRandomItem}
        onFormSuccess={handleFormSuccess}
        onFormCancel={handleFormCancel}
        onRestaurantFormSuccess={handleRestaurantFormSuccess}
        onRestaurantFormCancel={handleRestaurantFormCancel}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefetch={refetch}
      />
    </div>
  );
};

export default AdminDashboard;
