
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, X } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  username: string;
  description: string;
  phone_number: string;
  logo: string;
  status: string;
}

interface RestaurantProfileEditProps {
  restaurant: Restaurant;
  isLoading: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const RestaurantProfileEdit = ({ restaurant, isLoading, onSubmit, onCancel }: RestaurantProfileEditProps) => {
  const form = useForm({
    defaultValues: {
      name: '',
      username: '',
      description: '',
      phone_number: '',
      logo: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (restaurant) {
      console.log('Populating form with restaurant data:', restaurant);
      const statusValue = restaurant.status && restaurant.status.trim() !== '' ? restaurant.status : 'active';
      form.reset({
        name: restaurant.name || '',
        username: restaurant.username || '',
        description: restaurant.description || '',
        phone_number: restaurant.phone_number || '',
        logo: restaurant.logo || '',
        status: statusValue,
      });
    }
  }, [restaurant, form]);

  const handleCancel = () => {
    const statusValue = restaurant.status && restaurant.status.trim() !== '' ? restaurant.status : 'active';
    form.reset({
      name: restaurant.name || '',
      username: restaurant.username || '',
      description: restaurant.description || '',
      phone_number: restaurant.phone_number || '',
      logo: restaurant.logo || '',
      status: statusValue,
    });
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Restaurant Profile</h2>
        <Button
          onClick={handleCancel}
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
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || 'active'}
                    defaultValue="active"
                  >
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

export default RestaurantProfileEdit;
