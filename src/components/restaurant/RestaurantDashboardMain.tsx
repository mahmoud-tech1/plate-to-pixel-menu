
import MenuItemForm from '../MenuItemForm';
import AdminMenuList from '../AdminMenuList';
import RestaurantProfile from '../RestaurantProfile';
import { MenuItem } from '../../types/MenuItem';

interface RestaurantDashboardMainProps {
  restaurant: any;
  showForm: boolean;
  showProfile: boolean;
  editingItem: MenuItem | null;
  menuItems: MenuItem[];
  isLoading: boolean;
  restaurantId: number;
  onFormSuccess: () => void;
  onFormCancel: () => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onProfileUpdate: (restaurant: any) => void;
}

const RestaurantDashboardMain = ({
  restaurant,
  showForm,
  showProfile,
  editingItem,
  menuItems,
  isLoading,
  restaurantId,
  onFormSuccess,
  onFormCancel,
  onEdit,
  onDelete,
  onProfileUpdate,
}: RestaurantDashboardMainProps) => {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {showProfile && (
        <RestaurantProfile
          restaurant={restaurant}
          onUpdate={onProfileUpdate}
        />
      )}

      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <MenuItemForm
            item={editingItem}
            restaurantId={restaurantId}
            onSuccess={onFormSuccess}
            onCancel={onFormCancel}
          />
        </div>
      ) : !showProfile ? (
        <AdminMenuList
          items={menuItems}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : null}
    </main>
  );
};

export default RestaurantDashboardMain;
