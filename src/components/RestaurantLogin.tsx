
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, X } from 'lucide-react';

interface RestaurantLoginProps {
  onLogin: (restaurant: any) => void;
  onCancel: () => void;
}

const RestaurantLogin = ({ onLogin, onCancel }: RestaurantLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('https://menu-back.up.railway.app/api/restaurants/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          PASSWORD: password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Invalid username or password');
        } else {
          setError('Login failed. Please try again.');
        }
        return;
      }

      const restaurant = await response.json();
      
      // Store restaurant data in localStorage for session management
      // Ensure we extract and store the restaurant ID properly
      const restaurantData = {
        id: restaurant.id || restaurant.restaurant?.id,
        ...restaurant
      };
      
      // Store both the full restaurant data and the ID separately for easy access
      localStorage.setItem('restaurantSession', JSON.stringify(restaurantData));
      localStorage.setItem('restaurantId', restaurantData.id.toString());
      
      console.log('Stored restaurant session:', restaurantData);
      console.log('Stored restaurant ID:', restaurantData.id);
      
      onLogin(restaurant);
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
           <div className="flex items-center justify-between">
              <div className="flex items-center mx-auto">
                <div className="bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg p-2 mr-2">
                  <img src="/assets/logo.png" alt="MA-Menu" className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl text-gray-800">MA-Menu Restaurant</CardTitle>
              </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="absolute top-4 right-4"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantLogin;
