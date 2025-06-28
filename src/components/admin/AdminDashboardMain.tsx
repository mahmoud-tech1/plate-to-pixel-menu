
import MenuItemForm from '../MenuItemForm';
import AdminMenuList from '../AdminMenuList';
import AdminMenuFilters from '../AdminMenuFilters';
import { MenuItem } from '../../types/MenuItem';

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
  menuItems: MenuItem[];
  isLoading: boolean;
  onFilterChange: (filters: FilterState) => void;
  onRandomItem: () => void;
  onFormSuccess: () => void;
  onFormCancel: () => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
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
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <MenuItemForm
            item={editingItem}
            onSuccess={onFormSuccess}
            onCancel={onFormCancel}
            isAdminMode={true}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <AdminMenuFilters
            onFilterChange={onFilterChange}
            onRandomItem={onRandomItem}
          />
          <AdminMenuList
            items={menuItems || []}
            isLoading={isLoading}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </main>
  );
};

export default AdminDashboardMain;
