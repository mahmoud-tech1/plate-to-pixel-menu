
import { useState } from 'react';
import CustomerMenu from '../components/CustomerMenu';
import AdminDashboard from '../components/AdminDashboard';
import { Button } from '@/components/ui/button';
import { ChefHat, Shield } from 'lucide-react';

const Index = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {isAdminMode ? (
        <AdminDashboard onExitAdmin={() => setIsAdminMode(false)} />
      ) : (
        <>
          <CustomerMenu />
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={() => setIsAdminMode(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white shadow-lg"
              size="sm"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
