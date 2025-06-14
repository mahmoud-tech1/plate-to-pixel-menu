
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface Restaurant {
  id: number;
  name: string;
  username: string;
  description: string;
  phone_number: string;
  logo: string;
  status: string;
}

export const useRestaurantProfile = (restaurant: Restaurant, onUpdate: (updatedRestaurant: Restaurant) => void) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const restaurantId = localStorage.getItem('restaurantId') || restaurant.id;

  const { data: fullRestaurantData, refetch } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      console.log('Fetching restaurant details for ID:', restaurantId);
      const response = await fetch(`https://menu-backend-56ur.onrender.com/api/restaurants/${restaurantId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant details');
      }
      const data = await response.json();
      console.log('Fetched restaurant data:', data);
      return data;
    },
    enabled: !!restaurantId,
  });

  const currentRestaurant = fullRestaurantData || restaurant;

  const updateRestaurant = async (data: any) => {
    setIsLoading(true);
    try {
      console.log('Submitting form data:', data);
      const response = await fetch(`https://menu-backend-56ur.onrender.com/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update restaurant');
      }

      const updateResponse = await response.json();
      console.log('Update response:', updateResponse);

      await refetch();
      
      const freshData = await fetch(`https://menu-backend-56ur.onrender.com/api/restaurants/${restaurantId}`);
      const updatedRestaurant = await freshData.json();
      console.log('Fresh restaurant data after update:', updatedRestaurant);
      
      onUpdate(updatedRestaurant);
      setIsEditing(false);
      
      toast({
        title: "Success!",
        description: "Restaurant profile updated successfully.",
      });
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to update restaurant profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    isLoading,
    currentRestaurant,
    updateRestaurant,
  };
};
