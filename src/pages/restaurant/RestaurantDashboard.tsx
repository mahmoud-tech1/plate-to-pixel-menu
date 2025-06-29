
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import RestaurantDashboardHeader from '../../components/restaurant/RestaurantDashboardHeader';
import RestaurantDashboardMain from '../../components/restaurant/RestaurantDashboardMain';
import { MenuItem } from '../../types/MenuItem';
import { useToast } from '@/hooks/use-toast';

const RestaurantDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing restaurant session on component mount
  useEffect(() => {
    const restaurantSession = document.cookie
      .split('; ')
      .find(row => row.startsWith('restaurant_session='));
    
    if (restaurantSession) {
      try {
        const sessionData = JSON.parse(restaurantSession.split('=')[1]);
        setRestaurantData(sessionData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing restaurant session:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const { data: menuItems, isLoading, refetch } = useQuery({
    queryKey: ['restaurantMenuItems', restaurantData?.id],
    queryFn: async () => {
      if (!restaurantData?.id) return [];
      const response = await fetch(`https://menu-backend-56ur.onrender.com/api/menuitems/restaurant/${restaurantData.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      return response.json();
    },
    enabled: isAuthenticated && !!restaurantData?.id,
  });

  const handleLogout = () => {
    // Clear cookie
    document.cookie = 'restaurant_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('restaurantSession');
    localStorage.removeItem('restaurantId');
    setIsAuthenticated(false);
    setRestaurantData(null);
    setShowForm(false);
    setEditingItem(null);
    navigate('/login');
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
    setShowProfile(false);
  };

  const handleShowProfile = () => {
    setShowProfile(!showProfile);
    setShowForm(false);
    setEditingItem(null);
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
    setShowProfile(false);
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

  const handleProfileUpdate = (updatedRestaurant: any) => {
    setRestaurantData(updatedRestaurant);
    
    // Update the cookie with new data
    const expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = `restaurant_session=${JSON.stringify(updatedRestaurant)}; expires=${expires.toUTCString()}; path=/`;
  };

  if (!isAuthenticated || !restaurantData) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantDashboardHeader
        restaurant={restaurantData}
        onAddItem={handleAddItem}
        onShowProfile={handleShowProfile}
        onLogout={handleLogout}
      />
      
      <RestaurantDashboardMain
        restaurant={restaurantData}
        showForm={showForm}
        showProfile={showProfile}
        editingItem={editingItem}
        menuItems={menuItems}
        isLoading={isLoading}
        restaurantId={restaurantData.id}
        onFormSuccess={handleFormSuccess}
        onFormCancel={handleFormCancel}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default RestaurantDashboard;
