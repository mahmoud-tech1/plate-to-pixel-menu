
import { useRestaurantProfile } from '../hooks/useRestaurantProfile';
import RestaurantProfileView from './RestaurantProfileView';
import RestaurantProfileEdit from './RestaurantProfileEdit';

interface Restaurant {
  id: number;
  name: string;
  username: string;
  description: string;
  phone_number: string;
  logo: string;
  status: string;
}

interface RestaurantProfileProps {
  restaurant: Restaurant;
  onUpdate: (updatedRestaurant: Restaurant) => void;
}

const RestaurantProfile = ({ restaurant, onUpdate }: RestaurantProfileProps) => {
  const {
    isEditing,
    setIsEditing,
    isLoading,
    currentRestaurant,
    updateRestaurant,
  } = useRestaurantProfile(restaurant, onUpdate);

  if (isEditing) {
    return (
      <RestaurantProfileEdit
        restaurant={currentRestaurant}
        isLoading={isLoading}
        onSubmit={updateRestaurant}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <RestaurantProfileView
      restaurant={currentRestaurant}
      onEdit={() => setIsEditing(true)}
    />
  );
};

export default RestaurantProfile;
