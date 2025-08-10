
import { Button } from '@/components/ui/button';
import { Edit3, ImageIcon } from 'lucide-react';
import { renderSafeHtml } from '@/utils/htmlSanitizer';

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
      
      {/* Logo Section */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-600">Restaurant Logo</label>
        <div className="mt-2 flex items-center space-x-4">
          <div className="w-20 h-20 border-2 border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            {restaurant.logo ? (
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">No Logo</span>
              </div>
            )}
          </div>
          {restaurant.logo && (
            <div className="flex-1">
              <p className="text-sm text-gray-500 break-all">{restaurant.logo}</p>
            </div>
          )}
        </div>
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
          <div className="text-lg prose prose-sm max-w-none">
            {restaurant.description ? (
              <div dangerouslySetInnerHTML={renderSafeHtml(restaurant.description)} />
            ) : (
              <p className="text-gray-500">Not provided</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfileView;
