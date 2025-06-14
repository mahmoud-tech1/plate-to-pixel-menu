
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MenuItem } from '../types/MenuItem';
import { useToast } from '@/hooks/use-toast';

interface MenuItemFormProps {
  item?: MenuItem | null;
  onSuccess: () => void;
  onCancel: () => void;
  restaurantId?: number;
  isAdminMode?: boolean;
}

interface Restaurant {
  id: number;
  name: string;
}

const MenuItemForm = ({ item, onSuccess, onCancel, restaurantId, isAdminMode = false }: MenuItemFormProps) => {
  const [formData, setFormData] = useState({
    item_name: item?.item_name || '',
    price: item?.price?.toString() || '',
    category: item?.category || '',
    description: item?.description || '',
    photo: item?.photo || '',
    created_by: item?.created_by || 'admin',
    updated_by: 'admin',
    restaurantId: item?.restaurantId || restaurantId || '',
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch restaurants for admin mode
  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await fetch('https://menu-backend-56ur.onrender.com/api/restaurants/');
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      return response.json();
    },
    enabled: isAdminMode,
  });

  // Fetch existing categories for the restaurant
  const { data: existingCategories } = useQuery({
    queryKey: ['categories', formData.restaurantId],
    queryFn: async () => {
      if (!formData.restaurantId) return [];
      const response = await fetch(`https://menu-backend-56ur.onrender.com/api/menuitems/findAllByRestaurant/${formData.restaurantId}`);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const items = await response.json();
      // Extract unique categories from existing items
      const categories = [...new Set(items.map((item: MenuItem) => item.category).filter(Boolean))];
      return categories;
    },
    enabled: !!formData.restaurantId,
  });

  // Set restaurantId from session if not in admin mode
  useEffect(() => {
    if (!isAdminMode && !item) {
      const sessionData = localStorage.getItem('restaurantSession');
      if (sessionData) {
        const restaurant = JSON.parse(sessionData);
        const restaurantId = restaurant.restaurant?.id || restaurant.id;
        console.log('Setting restaurantId from session:', restaurantId);
        setFormData(prev => ({ ...prev, restaurantId }));
      }
    }
  }, [isAdminMode, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item_name.trim() || !formData.price || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (name, price, category).",
        variant: "destructive",
      });
      return;
    }

    if (isAdminMode && !formData.restaurantId) {
      toast({
        title: "Validation Error",
        description: "Please select a restaurant.",
        variant: "destructive",
      });
      return;
    }

    // For restaurant mode, ensure restaurantId is set from session
    let finalRestaurantId = formData.restaurantId;
    if (!isAdminMode && !finalRestaurantId) {
      const sessionData = localStorage.getItem('restaurantSession');
      if (sessionData) {
        const restaurant = JSON.parse(sessionData);
        finalRestaurantId = restaurant.restaurant?.id || restaurant.id;
        console.log('Using restaurantId from session for submission:', finalRestaurantId);
      }
    }

    if (!finalRestaurantId) {
      toast({
        title: "Error",
        description: "Restaurant ID is required. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const url = item
        ? `https://menu-backend-56ur.onrender.com/api/menuitems/${item.id}`
        : 'https://menu-backend-56ur.onrender.com/api/menuitems';
      
      const method = item ? 'PUT' : 'POST';
      
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        restaurantId: parseInt(finalRestaurantId.toString()),
      };

      console.log('Submitting menu item data:', submitData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to save menu item');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: "Error",
        description: "Failed to save menu item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'add_new') {
      setShowNewCategoryInput(true);
      setFormData({ ...formData, category: '' });
      setNewCategory('');
    } else {
      setShowNewCategoryInput(false);
      setFormData({ ...formData, category: value });
      setNewCategory('');
    }
  };

  const handleNewCategoryChange = (value: string) => {
    setNewCategory(value);
    setFormData({ ...formData, category: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name *
          </label>
          <Input
            value={formData.item_name}
            onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
            placeholder="Enter item name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price *
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      {isAdminMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Restaurant *
          </label>
          <Select
            value={formData.restaurantId.toString()}
            onValueChange={(value) => setFormData({ ...formData, restaurantId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a restaurant" />
            </SelectTrigger>
            <SelectContent>
              {restaurants?.map((restaurant: Restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <div className="space-y-2">
          <Select
            value={showNewCategoryInput ? 'add_new' : formData.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {existingCategories?.map((category: string) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
              <SelectItem value="add_new">+ Add New Category</SelectItem>
            </SelectContent>
          </Select>
          
          {showNewCategoryInput && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter new category:
              </label>
              <Input
                value={newCategory}
                onChange={(e) => handleNewCategoryChange(e.target.value)}
                placeholder="Type a new category name"
                required
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter item description"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photo URL
        </label>
        <Input
          type="url"
          value={formData.photo}
          onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isSubmitting ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
        </Button>
      </div>
    </form>
  );
};

export default MenuItemForm;
