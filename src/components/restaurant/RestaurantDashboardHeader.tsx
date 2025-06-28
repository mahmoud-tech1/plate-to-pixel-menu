
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Store, User } from 'lucide-react';

interface RestaurantDashboardHeaderProps {
  restaurant: any;
  onAddItem: () => void;
  onShowProfile: () => void;
  onLogout: () => void;
}

const RestaurantDashboardHeader = ({ restaurant, onAddItem, onShowProfile, onLogout }: RestaurantDashboardHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            {restaurant?.logo ? (
              <img src={restaurant.logo} alt={restaurant.name} className="w-10 h-10 rounded-full object-cover mr-3" />
            ) : (
              <Store className="w-8 h-8 text-emerald-600 mr-3" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{restaurant?.name}</h1>
              <p className="text-sm text-gray-500">Restaurant Dashboard</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={onShowProfile}
            variant="outline"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
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

export default RestaurantDashboardHeader;
