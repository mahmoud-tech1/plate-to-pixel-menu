
import { useState, useEffect } from 'react';
import CustomerMenu from '../components/CustomerMenu';
import AdminDashboard from '../components/AdminDashboard';
import RestaurantLogin from '../components/RestaurantLogin';
import RestaurantDashboard from '../components/RestaurantDashboard';
import { Button } from '@/components/ui/button';
import { ChefHat, Shield, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isRestaurantMode, setIsRestaurantMode] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const navigate = useNavigate();

  // Check for existing restaurant session on component mount
  useEffect(() => {
    const sessionData = localStorage.getItem('restaurantSession');
    if (sessionData) {
      try {
        const restaurantData = JSON.parse(sessionData);
        setRestaurant(restaurantData);
        setIsRestaurantMode(true);
      } catch (error) {
        console.error('Error parsing restaurant session:', error);
        localStorage.removeItem('restaurantSession');
      }
    }
  }, []);

  const handleRestaurantLogin = (restaurantData: any) => {
    setRestaurant(restaurantData);
    setIsRestaurantMode(true);
  };

  const handleRestaurantLogout = () => {
    setRestaurant(null);
    setIsRestaurantMode(false);
    localStorage.removeItem('restaurantSession');
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
          onClick={() => navigate('/restaurants')}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          size="sm"
        >
          <ChefHat className="w-4 h-4 mr-2" />
          Restaurants
        </Button>
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
