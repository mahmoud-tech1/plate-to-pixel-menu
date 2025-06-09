
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
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch restaurants for admin mode
  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/restaurants/');
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
      const response = await fetch(`http://localhost:8080/api/menuitems/findAllByRestaurant/${formData.restaurantId}`);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const items = await response.json();
      // Extract unique categories
      const categories = [...new Set(items.map((item: MenuItem) => item.category).filter(Boolean))];
      return categories;
    },
    enabled: !!formData.restaurantId,
  });

  const defaultCategories = [
    'Appetizers',
    'Main Courses',
    'Desserts',
    'Beverages',
    'Salads',
    'Soups',
    'Sandwiches',
    'Pizza',
    'Pasta',
    'Other'
  ];

  // Combine existing and default categories
  const allCategories = existingCategories 
    ? [...new Set([...existingCategories, ...defaultCategories])]
    : defaultCategories;

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

    setIsSubmitting(true);

    try {
      const url = item
        ? `http://localhost:8080/api/menuitems/${item.id}`
        : 'http://localhost:8080/api/menuitems';
      
      const method = item ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          restaurantId: parseInt(formData.restaurantId.toString()),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save menu item');
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save menu item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory('');
      setIsCreatingCategory(false);
    }
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
              {restaurants?.map((restaurant: any) => (
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
            value={formData.category}
            onValueChange={(value) => {
              if (value === 'create-new') {
                setIsCreatingCategory(true);
              } else {
                setFormData({ ...formData, category: value });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
              <SelectItem value="create-new">+ Create New Category</SelectItem>
            </SelectContent>
          </Select>
          
          {isCreatingCategory && (
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewCategory();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddNewCategory}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Add
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsCreatingCategory(false);
                  setNewCategory('');
                }}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
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
