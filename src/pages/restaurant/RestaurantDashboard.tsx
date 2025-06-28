
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import RestaurantDashboardHeader from '../../components/restaurant/RestaurantDashboardHeader';
import RestaurantDashboardMain from '../../components/restaurant/RestaurantDashboardMain';
import { MenuItem } from '../../types/MenuItem';
import { useToast } from '@/hooks/use-toast';

const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing restaurant session on component mount
  useEffect(() => {
    const sessionData = localStorage.getItem('restaurantSession');
    const restaurantId = localStorage.getItem('restaurantId');
    
    if (sessionData && restaurantId) {
      try {
        const restaurantData = JSON.parse(sessionData);
        if (!restaurantData.id) {
          restaurantData.id = parseInt(restaurantId);
        }
        setRestaurant(restaurantData);
      } catch (error) {
        console.error('Error parsing restaurant session:', error);
        localStorage.removeItem('restaurantSession');
        localStorage.removeItem('restaurantId');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const restaurantData = restaurant?.restaurant || restaurant;
  const restaurantId = localStorage.getItem('restaurantId') || restaurantData?.id;

  const { data: menuItems, isLoading, refetch } = useQuery({
    queryKey: ['restaurantMenuItems', restaurantId],
    queryFn: async () => {
      const response = await fetch(`https://menu-backend-56ur.onrender.com/api/menuitems/findAllByRestaurant/${restaurantId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      return response.json();
    },
    enabled: !!restaurantId,
  });

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    refetch();
    toast({
      title: "Success!",
      description: editingItem ? "Menu item updated successfully." : "Menu item added successfully.",
    });
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
    setRestaurant({ restaurant: updatedRestaurant });
    
    const updatedSession = {
      ...restaurant,
      restaurant: updatedRestaurant,
      id: updatedRestaurant.id || restaurantId
    };
    localStorage.setItem('restaurantSession', JSON.stringify(updatedSession));
    localStorage.setItem('restaurantId', (updatedRestaurant.id || restaurantId).toString());
  };

  const handleLogout = () => {
    localStorage.removeItem('restaurantSession');
    localStorage.removeItem('restaurantId');
    navigate('/');
  };

  if (!restaurant) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantDashboardHeader
        restaurant={restaurantData}
        onAddItem={() => {
          setEditingItem(null);
          setShowForm(true);
          setShowProfile(false);
        }}
        onShowProfile={() => {
          setShowProfile(!showProfile);
          setShowForm(false);
          setEditingItem(null);
        }}
        onLogout={handleLogout}
      />

      <RestaurantDashboardMain
        restaurant={restaurantData}
        showForm={showForm}
        showProfile={showProfile}
        editingItem={editingItem}
        menuItems={menuItems || []}
        isLoading={isLoading}
        restaurantId={parseInt(restaurantId)}
        onFormSuccess={handleFormSuccess}
        onFormCancel={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default RestaurantDashboard;
