
import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  username: string;
  description: string;
  phone_number: string;
  logo: string;
  status: string;
}

interface RestaurantProfileViewProps {
  restaurant: Restaurant;
  onEdit: () => void;
}

const RestaurantProfileView = ({ restaurant, onEdit }: RestaurantProfileViewProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">Restaurant Profile</h2>
        <Button
          onClick={onEdit}
          variant="outline"
          size="sm"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Restaurant Name</label>
          <p className="text-lg">{restaurant.name || 'Not provided'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Username</label>
          <p className="text-lg">{restaurant.username || 'Not provided'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Phone Number</label>
          <p className="text-lg">{restaurant.phone_number || 'Not provided'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Status</label>
          <p className="text-lg capitalize">{restaurant.status || 'Active'}</p>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-600">Description</label>
          <p className="text-lg">{restaurant.description || 'Not provided'}</p>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-600">Logo URL</label>
          <div className="flex items-center space-x-4">
            <p className="text-lg break-all">{restaurant.logo || 'Not provided'}</p>
            {restaurant.logo && (
              <img src={restaurant.logo} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfileView;
