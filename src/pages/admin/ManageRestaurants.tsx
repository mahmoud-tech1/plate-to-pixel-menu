import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Eye, EyeOff, Search } from 'lucide-react';
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
import CreateRestaurantModal from '@/components/admin/CreateRestaurantModal';
import EditRestaurantModal from '@/components/admin/EditRestaurantModal';

interface Restaurant {
  id: number;
  name: string;
  username: string;
  PASSWORD: string;
  logo: string;
  status: string;
  description: string;
  rating: string;
  created_by: string;
}

const ManageRestaurants = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  
  // Initialize pagination state properly to avoid TDZ issues
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const saved = localStorage.getItem('admin-restaurants-page');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });
  
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    try {
      const saved = localStorage.getItem('admin-restaurants-per-page');
      return saved ? parseInt(saved, 10) : 10;
    } catch {
      return 10;
    }
  });
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: restaurants, isLoading, refetch } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await fetch('https://menu-backend-56ur.onrender.com/api/restaurants');
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      return response.json();
    },
  });

  // Ensure filteredRestaurants is properly initialized
  const filteredRestaurants = restaurants?.filter((restaurant: Restaurant) => {
    const statusMatch = statusFilter === 'all' || restaurant.status === statusFilter;
    const searchMatch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  }) || [];

  // Calculate pagination values safely
  const totalItems = filteredRestaurants.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      try {
        localStorage.setItem('admin-restaurants-page', page.toString());
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value, 10);
    if (newItemsPerPage > 0) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
      try {
        localStorage.setItem('admin-restaurants-per-page', newItemsPerPage.toString());
        localStorage.setItem('admin-restaurants-page', '1');
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
    toast({
      title: "Success!",
      description: "Restaurant created successfully.",
    });
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingRestaurant(null);
    refetch();
    toast({
      title: "Success!",
      description: "Restaurant updated successfully.",
    });
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setShowEditModal(true);
  };

  const togglePasswordVisibility = (restaurantId: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [restaurantId]: !prev[restaurantId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Restaurants</h1>
              <p className="text-gray-600 mt-1">Create, edit, and manage all restaurants</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Restaurant
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
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
                  placeholder="Search restaurants..."
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
              Showing {Math.min(startIndex + 1, totalItems)}-{endIndex} of {totalItems} restaurants
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
              <p className="text-gray-500">Loading restaurants...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRestaurants.map((restaurant: Restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell className="font-medium">{restaurant.id}</TableCell>
                    <TableCell>
                      {restaurant.logo ? (
                        <img
                          src={restaurant.logo}
                          alt={restaurant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No Logo</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{restaurant.name}</TableCell>
                    <TableCell>{restaurant.username}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">
                          {showPasswords[restaurant.id] ? restaurant.PASSWORD : '••••••••'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(restaurant.id)}
                        >
                          {showPasswords[restaurant.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        restaurant.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {restaurant.status}
                      </span>
                    </TableCell>
                    <TableCell>{restaurant.rating || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate">{restaurant.description}</TableCell>
                    <TableCell>{restaurant.created_by}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(restaurant)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
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
      </main>

      {showCreateModal && (
        <CreateRestaurantModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showEditModal && editingRestaurant && (
        <EditRestaurantModal
          restaurant={editingRestaurant}
          onClose={() => {
            setShowEditModal(false);
            setEditingRestaurant(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default ManageRestaurants;
