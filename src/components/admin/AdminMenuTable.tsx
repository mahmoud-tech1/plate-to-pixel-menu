
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { MenuItem } from '@/types/MenuItem';

interface AdminMenuTableProps {
  menuItems: MenuItem[];
  isLoading: boolean;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onRefetch: () => void;
}

const AdminMenuTable: React.FC<AdminMenuTableProps> = ({
  menuItems,
  isLoading,
  onEdit,
  onDelete,
  onRefetch
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await fetch('https://menu-backend-56ur.onrender.com/api/restaurants');
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      return response.json();
    },
  });

  // Create restaurant lookup safely
  const restaurantLookup = React.useMemo(() => {
    const lookup: Record<number, string> = {};
    if (restaurants && Array.isArray(restaurants)) {
      restaurants.forEach((restaurant: any) => {
        if (restaurant && restaurant.id && restaurant.name) {
          lookup[restaurant.id] = restaurant.name;
        }
      });
    }
    return lookup;
  }, [restaurants]);

  // Filter menu items - simplified to avoid filtering out data unnecessarily
  const filteredMenuItems = React.useMemo(() => {
    if (!Array.isArray(menuItems)) return [];
    
    return menuItems.filter((item: MenuItem) => {
      if (!item) return false;
      
      // Only filter by status if it exists and is not 'all'
      const statusMatch = statusFilter === 'all' || !item.status || item.status === statusFilter;
      
      // Search by restaurant name
      const searchMatch = searchQuery === '' || 
        (item.restaurantId && restaurantLookup[item.restaurantId] && 
         restaurantLookup[item.restaurantId].toLowerCase().includes(searchQuery.toLowerCase()));
      
      return statusMatch && searchMatch;
    });
  }, [menuItems, statusFilter, searchQuery, restaurantLookup]);

  // Calculate pagination values safely
  const totalItems = filteredMenuItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = filteredMenuItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value, 10);
    if (newItemsPerPage > 0) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    }
  };

  const handleStatusChange = async (itemId: number, newStatus: string) => {
    try {
      const response = await fetch(`https://menu-backend-56ur.onrender.com/api/menuitems/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      onRefetch();
      toast({
        title: "Success!",
        description: "Item status updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Filters and Search */}
      <div className="p-4 border-b space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Search by Restaurant Name
            </label>
            <Input
              placeholder="Search by restaurant name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {Math.min(startIndex + 1, totalItems)}-{endIndex} of {totalItems} items
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading menu items...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item: MenuItem) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt={item.item_name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.item_name}</TableCell>
                <TableCell>
                  {item.restaurantId ? restaurantLookup[item.restaurantId] || `Restaurant ${item.restaurantId}` : 'Unknown'}
                </TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Select
                    value={item.status || 'active'}
                    onValueChange={(value) => handleStatusChange(item.id, value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default AdminMenuTable;
