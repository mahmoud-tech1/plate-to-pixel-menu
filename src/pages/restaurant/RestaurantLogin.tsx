
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const RestaurantLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing restaurant session on component mount
  useEffect(() => {
    const restaurantSession = document.cookie
      .split('; ')
      .find(row => row.startsWith('restaurant_session='));
    
    if (restaurantSession) {
      navigate('/res-dashboard');
    }
  }, [navigate]);

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

      const data = await response.json();
      console.log('Login response:', data);
      
      // Extract restaurant data from the response
      const restaurant = data.restaurant;
      
      if (!restaurant || !restaurant.id) {
        setError('Invalid response from server. Please try again.');
        return;
      }
      
      // Set cookie for 24 hours
      const expires = new Date();
      expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
      document.cookie = `restaurant_session=${JSON.stringify(restaurant)}; expires=${expires.toUTCString()}; path=/`;
      
      // Store restaurant data in localStorage for compatibility
      localStorage.setItem('restaurantSession', JSON.stringify(restaurant));
      localStorage.setItem('restaurantId', restaurant.id.toString());
      
      console.log('Stored restaurant session:', restaurant);
      console.log('Stored restaurant ID:', restaurant.id);
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to restaurant dashboard.",
      });
      
      navigate('/res-dashboard');
    } catch (error) {
      console.error('Restaurant login error:', error);
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="absolute top-4 left-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center mx-auto">
              <ChefHat className="w-6 h-6 text-emerald-600 mr-2" />
              <CardTitle className="text-xl">Restaurant Login</CardTitle>
            </div>
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
