
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, X } from 'lucide-react';

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
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: restaurant.name || '',
      username: restaurant.username || '',
      description: restaurant.description || '',
      phone_number: restaurant.phone_number || '',
      logo: restaurant.logo || '',
      status: restaurant.status || 'active',
    },
  });

  // Reset form when restaurant data changes or component mounts
  useEffect(() => {
    console.log('Restaurant data received:', restaurant);
    form.reset({
      name: restaurant.name || '',
      username: restaurant.username || '',
      description: restaurant.description || '',
      phone_number: restaurant.phone_number || '',
      logo: restaurant.logo || '',
      status: restaurant.status || 'active',
    });
  }, [restaurant, form]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      console.log('Submitting form data:', data);
      const response = await fetch(`https://menu-backend-56ur.onrender.com/api/restaurants/${restaurant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update restaurant');
      }

      const updatedRestaurant = await response.json();
      console.log('Updated restaurant response:', updatedRestaurant);
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

  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Restaurant Profile</h2>
          <Button
            onClick={() => setIsEditing(true)}
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
            <p className="text-lg capitalize">{restaurant.status || 'Not provided'}</p>
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
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Restaurant Profile</h2>
        <Button
          onClick={() => {
            setIsEditing(false);
            form.reset({
              name: restaurant.name || '',
              username: restaurant.username || '',
              description: restaurant.description || '',
              phone_number: restaurant.phone_number || '',
              logo: restaurant.logo || '',
              status: restaurant.status || 'active',
            });
          }}
          variant="outline"
          size="sm"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/logo.jpg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RestaurantProfile;
