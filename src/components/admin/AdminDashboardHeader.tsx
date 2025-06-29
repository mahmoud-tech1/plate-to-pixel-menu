
import { Button } from '@/components/ui/button';
import { LogOut, Plus, ChefHat, Shield, Building } from 'lucide-react';

interface AdminDashboardHeaderProps {
  onAddItem: () => void;
  onAddRestaurant: () => void;
  onLogout: () => void;
  onViewRestaurants: () => void;
}

const AdminDashboardHeader = ({ onAddItem, onAddRestaurant, onLogout, onViewRestaurants }: AdminDashboardHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Shield className="w-8 h-8 text-emerald-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Manage all menu items and restaurants</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={onAddRestaurant}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Building className="w-4 h-4 mr-2" />
            Add New Restaurant
          </Button>
          <Button
            onClick={onViewRestaurants}
            variant="outline"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            <ChefHat className="w-4 h-4 mr-2" />
            View Restaurants
          </Button>
          <Button
            onClick={onAddItem}
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
  );
};

export default AdminDashboardHeader;
