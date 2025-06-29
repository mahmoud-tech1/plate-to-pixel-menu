
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const adminUsername = "admin";
const adminPassword = "123456";

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing admin session on component mount
  useEffect(() => {
    const adminSession = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin_session='));
    
    if (adminSession) {
      navigate('/ad-dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === adminUsername && password === adminPassword) {
      // Set cookie for 24 hours
      const expires = new Date();
      expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
      document.cookie = `admin_session=true; expires=${expires.toUTCString()}; path=/`;
      
      localStorage.setItem('admin_logged_in', 'true');
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to admin dashboard.",
      });
      navigate('/ad-dashboard');
    } else {
      setError('Invalid credentials. Use admin/123456');
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
              <Shield className="w-6 h-6 text-emerald-600 mr-2" />
              <CardTitle className="text-xl">Admin Login</CardTitle>
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
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Login
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Demo credentials: admin / 123456
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
