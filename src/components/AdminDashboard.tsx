
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLogin from './AdminLogin';
import MenuItemForm from './MenuItemForm';
import AdminMenuList from './AdminMenuList';
import { MenuItem } from '../types/MenuItem';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

const AdminDashboard = ({ onExitAdmin }: AdminDashboardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

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

  const handleLogin = () => {
    setIsAuthenticated(true);
    toast({
      title: "Welcome back!",
      description: "Successfully logged in to admin dashboard.",
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowForm(false);
    setEditingItem(null);
    onExitAdmin();
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

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} onCancel={onExitAdmin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
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
        ) : (
          <AdminMenuList
            items={menuItems || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
