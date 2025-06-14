
import { useState } from 'react';
import CustomerMenu from '../components/CustomerMenu';
import AdminDashboard from '../components/AdminDashboard';
import RestaurantLogin from '../components/RestaurantLogin';
import RestaurantDashboard from '../components/RestaurantDashboard';
import { Button } from '@/components/ui/button';
import { ChefHat, Shield, Store } from 'lucide-react';

const Index = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isRestaurantMode, setIsRestaurantMode] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  const handleRestaurantLogin = (restaurantData: any) => {
    setRestaurant(restaurantData);
    setIsRestaurantMode(true);
  };

  const handleRestaurantLogout = () => {
    setRestaurant(null);
    setIsRestaurantMode(false);
  };

  if (isAdminMode) {
    return <AdminDashboard onExitAdmin={() => setIsAdminMode(false)} />;
  }

  if (isRestaurantMode && restaurant) {
    return <RestaurantDashboard restaurant={restaurant} onLogout={handleRestaurantLogout} />;
  }

  if (isRestaurantMode && !restaurant) {
    return <RestaurantLogin onLogin={handleRestaurantLogin} onCancel={() => setIsRestaurantMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <CustomerMenu />
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <Button
          onClick={() => setIsRestaurantMode(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
          size="sm"
        >
          <Store className="w-4 h-4 mr-2" />
          Restaurant
        </Button>
        <Button
          onClick={() => setIsAdminMode(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white shadow-lg"
          size="sm"
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin
        </Button>
      </div>
    </div>
  );
};

export default Index;
