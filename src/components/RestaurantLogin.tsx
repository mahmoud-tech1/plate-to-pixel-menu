
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

  // Mock restaurant data for testing
  const mockRestaurant = {
    id: 1,
    name: "Demo Restaurant",
    username: "demo",
    description: "A demo restaurant for testing",
    phone_number: "+1234567890",
    logo: "https://thumbs.dreamstime.com/b/tft-letter-logo-design-white-background-creative-circle-concept-254290496.jpg",
    status: "active"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log('Login attempt with:', { username, password });
    
    // Use fixed credentials for demo
    if (username === 'demo' && password === 'demo123') {
      console.log('Login successful, using mock data:', mockRestaurant);
      
      // Store restaurant data in localStorage for session management
      localStorage.setItem('restaurantSession', JSON.stringify(mockRestaurant));
      localStorage.setItem('restaurantId', mockRestaurant.id.toString());
      
      console.log('Stored restaurant session:', mockRestaurant);
      console.log('Stored restaurant ID:', mockRestaurant.id);
      
      onLogin(mockRestaurant);
    } else {
      setError('Invalid credentials. Use demo/demo123');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center mx-auto">
              <ChefHat className="w-6 h-6 text-emerald-600 mr-2" />
              <CardTitle className="text-xl">Restaurant Login</CardTitle>
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
            <p className="text-xs text-gray-500 text-center">
              Demo credentials: demo / demo123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantLogin;
