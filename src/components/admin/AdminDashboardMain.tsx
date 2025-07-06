
import { useMemo, useState } from 'react';
import AdminMenuFilters from './AdminMenuFilters';
import MenuItemForm from '../MenuItemForm';
import AdminMenuTable from './AdminMenuTable';
import AddRestaurantForm from './AddRestaurantForm';
import { MenuItem } from '../../types/MenuItem';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface FilterState {
  restaurant?: string;
  priceMin?: number;
  priceMax?: number;
  itemName?: string;
}

interface AdminDashboardMainProps {
  showForm: boolean;
  showRestaurantForm: boolean;
  editingItem: MenuItem | null;
  filters: FilterState;
  randomItemId: number | null;
  menuItems: MenuItem[] | undefined;
  isLoading: boolean;
  onFilterChange: (newFilters: FilterState) => void;
  onRandomItem: () => void;
  onFormSuccess: () => void;
  onFormCancel: () => void;
  onRestaurantFormSuccess: () => void;
  onRestaurantFormCancel: () => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => Promise<void>;
  onRefetch: () => void;
}

const AdminDashboardMain = ({
  showForm,
  showRestaurantForm,
  editingItem,
  filters,
  randomItemId,
  menuItems,
  isLoading,
  onFilterChange,
  onRandomItem,
  onFormSuccess,
  onFormCancel,
  onRestaurantFormSuccess,
  onRestaurantFormCancel,
  onEdit,
  onDelete,
  onRefetch,
}: AdminDashboardMainProps) => {
  const { toast } = useToast();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter menu items based on current filters
  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    
    let filtered = [...menuItems];
    
    if (filters.restaurant) {
      filtered = filtered.filter(item => item.restaurantId?.toString() === filters.restaurant);
    }
    
    if (filters.itemName) {
      filtered = filtered.filter(item => 
        item.item_name.toLowerCase().includes(filters.itemName!.toLowerCase())
      );
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
    <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {!showForm && !showRestaurantForm && (
        <>
          {/* Desktop Filters */}
          <div className="hidden md:block">
            <AdminMenuFilters
              onFilterChange={onFilterChange}
              onRandomItem={handleRandomItem}
            />
          </div>

          {/* Mobile Filters Drawer */}
          <div className="md:hidden mb-4">
            <Drawer open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Menu className="w-4 h-4 mr-2" />
                  Filters & Search
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filters & Search</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <AdminMenuFilters
                    onFilterChange={(filters) => {
                      onFilterChange(filters);
                      setMobileFiltersOpen(false);
                    }}
                    onRandomItem={() => {
                      handleRandomItem();
                      setMobileFiltersOpen(false);
                    }}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </>
      )}

      {showRestaurantForm ? (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <AddRestaurantForm
            onClose={onRestaurantFormCancel}
            onSuccess={onRestaurantFormSuccess}
          />
        </div>
      ) : showForm ? (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
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
          menuItems={filteredItems}
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
