
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MenuItem } from '../../types/MenuItem';
import { Edit, Trash2, Save, X, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminMenuTableProps {
  items: MenuItem[];
  isLoading: boolean;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onRefetch: () => void;
}

const AdminMenuTable = ({ items, isLoading, onEdit, onDelete, onRefetch }: AdminMenuTableProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<MenuItem>>({});
  const { toast } = useToast();

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await fetch('https://menu-backend-56ur.onrender.com/api/restaurants/');
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      return response.json();
    },
  });

  const handleEditStart = (item: MenuItem) => {
    setEditingId(item.id);
    setEditData(item);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditSave = async () => {
    if (!editingId || !editData) return;

    try {
      const response = await fetch(`https://menu-backend-56ur.onrender.com/api/menuitems/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editData,
          price: parseFloat(editData.price?.toString() || '0'),
          updated_by: 'admin',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      toast({
        title: "Success!",
        description: "Menu item updated successfully.",
      });

      setEditingId(null);
      setEditData({});
      onRefetch();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update menu item.",
        variant: "destructive",
      });
    }
  };

  const getRestaurantName = (restaurantId?: number) => {
    const restaurant = restaurants?.find((r: any) => r.id === restaurantId);
    return restaurant?.name || 'Unknown';
  };

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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Menu Items ({items.length})</h2>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      value={editData.item_name || ''}
                      onChange={(e) => setEditData({ ...editData, item_name: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    item.item_name
                  )}
                </TableCell>

                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.price?.toString() || ''}
                      onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                      className="w-20"
                    />
                  ) : (
                    `$${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}`
                  )}
                </TableCell>

                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      value={editData.category || ''}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    item.category
                  )}
                </TableCell>

                <TableCell>
                  {editingId === item.id ? (
                    <Select
                      value={editData.restaurantId?.toString() || ''}
                      onValueChange={(value) => setEditData({ ...editData, restaurantId: parseInt(value) })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurants?.map((restaurant: any) => (
                          <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                            {restaurant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    getRestaurantName(item.restaurantId)
                  )}
                </TableCell>

                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      value={editData.photo || ''}
                      onChange={(e) => setEditData({ ...editData, photo: e.target.value })}
                      placeholder="Photo URL"
                      className="w-full"
                    />
                  ) : item.photo ? (
                    <div className="flex items-center space-x-2">
                      <img
                        src={item.photo}
                        alt={item.item_name}
                        className="w-8 h-8 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <ImageIcon className="w-4 h-4 text-gray-400 hidden" />
                      <span className="text-xs text-gray-500 truncate max-w-20">
                        {item.photo.split('/').pop()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">No photo</span>
                  )}
                </TableCell>

                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      placeholder="Description"
                      className="w-full"
                    />
                  ) : (
                    <span className="truncate max-w-32 block" title={item.description}>
                      {item.description || 'No description'}
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  {editingId === item.id ? (
                    <div className="flex space-x-1">
                      <Button size="sm" onClick={handleEditSave} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleEditCancel}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleEditStart(item)}>
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
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminMenuTable;
