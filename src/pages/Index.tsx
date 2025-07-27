
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing sessions and redirect accordingly
    const adminSession = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin_session='));
    
    const restaurantSession = document.cookie
      .split('; ')
      .find(row => row.startsWith('restaurant_session='));

    if (adminSession) {
      navigate('/ad-dashboard');
      return;
    }

    if (restaurantSession) {
      navigate('/res-dashboard');
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
         <div className="text-center mb-8">
           <div className="flex items-center justify-center mb-4">
             <img src="/ma-menu-logo.png" alt="MA-Menu" className="w-12 h-12 mr-3" />
             <h1 className="text-3xl font-bold text-gray-900">MA-Menu</h1>
           </div>
           <p className="text-gray-600">Choose your login type</p>
         </div>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/ad-login')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 text-lg"
            size="lg"
          >
            <Shield className="w-5 h-5 mr-3" />
            Admin Login
          </Button>
          
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg"
            size="lg"
          >
            <Store className="w-5 h-5 mr-3" />
            Restaurant Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
