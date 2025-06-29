
import { useMemo, useState } from 'react';
import AdminMenuFilters from './AdminMenuFilters';
import MenuItemForm from '../MenuItemForm';
import AdminMenuTable from './AdminMenuTable';
import AddRestaurantForm from './AddRestaurantForm';
import { MenuItem } from '../../types/MenuItem';
import { useToast } from '@/hooks/use-toast';

interface FilterState {
  restaurant?: string;
  priceMin?: number;
  priceMax?: number;
}

interface AdminDashboardMainProps {
  showForm: boolean;
  editingItem: MenuItem | null;
  filters: FilterState;
  randomItemId: number | null;
  menuItems: MenuItem[] | undefined;
  isLoading: boolean;
  onFilterChange: (newFilters: FilterState) => void;
  onRandomItem: () => void;
  onFormSuccess: () => void;
  onFormCancel: () => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => Promise<void>;
  onRefetch: () => void;
}

const AdminDashboardMain = ({
  showForm,
  editingItem,
  filters,
  randomItemId,
  menuItems,
  isLoading,
  onFilterChange,
  onRandomItem,
  onFormSuccess,
  onFormCancel,
  onEdit,
  onDelete,
  onRefetch,
}: AdminDashboardMainProps) => {
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const { toast } = useToast();

  // Filter menu items based on current filters
  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    
    let filtered = [...menuItems];
    
    if (filters.restaurant) {
      filtered = filtered.filter(item => item.restaurantId?.toString() === filters.restaurant);
    }
    
    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(item => item.price >= filters.priceMin!);
    }
    
    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(item => item.price <= filters.priceMax!);
    }
    
    // If we have a random item selected, move it to the top
    if (randomItemId) {
      const randomItem = filtered.find(item => item.id === randomItemId);
      if (randomItem) {
        filtered = [randomItem, ...filtered.filter(item => item.id !== randomItemId)];
      }
    }
    
    return filtered;
  }, [menuItems, filters, randomItemId]);

  const handleRandomItem = () => {
    if (menuItems && menuItems.length > 0) {
      onRandomItem();
      toast({
        title: "Surprise! 🎲",
        description: "Here's a random menu item for you!",
      });
    }
  };

  const handleAddRestaurant = () => {
    setShowRestaurantForm(true);
  };

  const handleRestaurantSuccess = () => {
    setShowRestaurantForm(false);
    onRefetch();
    toast({
      title: "Success!",
      description: "Restaurant created successfully.",
    });
  };

  const handleRestaurantCancel = () => {
    setShowRestaurantForm(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {!showForm && !showRestaurantForm && (
        <AdminMenuFilters
          onFilterChange={onFilterChange}
          onRandomItem={handleRandomItem}
          onAddRestaurant={handleAddRestaurant}
        />
      )}

      {showRestaurantForm ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Restaurant</h2>
          <AddRestaurantForm
            onSuccess={handleRestaurantSuccess}
            onCancel={handleRestaurantCancel}
          />
        </div>
      ) : showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <MenuItemForm
            item={editingItem}
            isAdminMode={true}
            onSuccess={onFormSuccess}
            onCancel={onFormCancel}
          />
        </div>
      ) : (
        <AdminMenuTable
          items={filteredItems}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onRefetch={onRefetch}
        />
      )}
    </main>
  );
};

export default AdminDashboardMain;
