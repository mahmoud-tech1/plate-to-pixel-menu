
import { useMemo } from 'react';
import AdminMenuFilters from './AdminMenuFilters';
import MenuItemForm from './MenuItemForm';
import AdminMenuList from './AdminMenuList';
import { MenuItem } from '../types/MenuItem';
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
}: AdminDashboardMainProps) => {
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

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {!showForm && (
        <AdminMenuFilters
          onFilterChange={onFilterChange}
          onRandomItem={handleRandomItem}
        />
      )}

      {showForm ? (
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
        <AdminMenuList
          items={filteredItems}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </main>
  );
};

export default AdminDashboardMain;
