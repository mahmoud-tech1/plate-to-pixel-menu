
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MenuItemForm from './MenuItemForm';
import AdminMenuList from './AdminMenuList';
import RestaurantProfile from './RestaurantProfile';
import { MenuItem } from '../types/MenuItem';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Store, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RestaurantDashboardProps {
  restaurant: any;
  onLogout: () => void;
}

const RestaurantDashboard = ({ restaurant, onLogout }: RestaurantDashboardProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [currentRestaurant, setCurrentRestaurant] = useState(restaurant);
  const { toast } = useToast();

  // Extract the actual restaurant data from the nested structure
  const restaurantData = currentRestaurant.restaurant || currentRestaurant;
  
  console.log('Restaurant data:', currentRestaurant);
  console.log('Restaurant ID being used:', restaurantData.id);

  const { data: menuItems, isLoading, refetch } = useQuery({
    queryKey: ['restaurantMenuItems', restaurantData.id],
    queryFn: async () => {
      console.log('Fetching menu items for restaurant ID:', restaurantData.id);
      const response = await fetch(`http://localhost:8080/api/menuitems/findAllByRestaurant/${restaurantData.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      return response.json();
    },
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
      const response = await fetch(`http://localhost:8080/api/menuitems/${id}`, {
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
    setCurrentRestaurant({ restaurant: updatedRestaurant });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              {restaurantData.logo ? (
                <img src={restaurantData.logo} alt={restaurantData.name} className="w-10 h-10 rounded-full object-cover mr-3" />
              ) : (
                <Store className="w-8 h-8 text-emerald-600 mr-3" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{restaurantData.name}</h1>
                <p className="text-sm text-gray-500">Restaurant Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowForm(false);
                setEditingItem(null);
              }}
              variant="outline"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
                setShowProfile(false);
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
            <Button onClick={onLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showProfile && (
          <RestaurantProfile
            restaurant={restaurantData}
            onUpdate={handleProfileUpdate}
          />
        )}

        {showForm ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <MenuItemForm
              item={editingItem}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
          </div>
        ) : !showProfile ? (
          <AdminMenuList
            items={menuItems || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : null}
      </main>
    </div>
  );
};

export default RestaurantDashboard;
