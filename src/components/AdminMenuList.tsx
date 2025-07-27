
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MenuItem } from '../types/MenuItem';
import { Edit, Trash2, ImageIcon } from 'lucide-react';

interface AdminMenuListProps {
  items: MenuItem[];
  isLoading: boolean;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
}

const AdminMenuList = ({ items, isLoading, onEdit, onDelete }: AdminMenuListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading menu items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No menu items found</p>
        <p className="text-gray-400">Add your first menu item to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Menu Items ({items.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-32 bg-gray-100">
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.item_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {item.item_name}
                </h3>
                <span className="text-lg font-bold text-emerald-600 ml-2">
                  {typeof item.price === 'number' ? item.price.toLocaleString('en-US') : parseFloat(item.price).toLocaleString('en-US')} SP
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                Category: {item.category}
              </p>
              
              {item.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {item.description}
                </p>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this item?')) {
                      onDelete(item.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminMenuList;
