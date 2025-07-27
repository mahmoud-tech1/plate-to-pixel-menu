
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';

interface AdminDashboardHeaderProps {
  onAddItem: () => void;
  onLogout: () => void;
}

const AdminDashboardHeader = ({ onAddItem, onLogout }: AdminDashboardHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
       <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
         <div className="flex items-center space-x-3">
           <img src="/ma-menu-logo.png" alt="MA-Menu" className="w-8 h-8" />
           <h1 className="text-2xl font-bold text-gray-900">MA-Menu Admin</h1>
         </div>
        <div className="flex items-center space-x-4">
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

export default AdminDashboardHeader;
