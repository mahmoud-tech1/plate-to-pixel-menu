
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, X } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

const adminUsername = "admin";
const adminPassword = "123456";

const AdminLogin = ({ onLogin, onCancel }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === adminUsername && password === adminPassword) {
      localStorage.setItem('admin_logged_in', 'true');
      onLogin();
    } else {
      setError('Invalid credentials. Use admin/123456');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
           <div className="flex items-center justify-between">
             <div className="flex items-center mx-auto">
               <img src="/ma-menu-logo.png" alt="MA-Menu" className="w-8 h-8 mr-2" />
               <CardTitle className="text-xl">MA-Menu Admin</CardTitle>
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
