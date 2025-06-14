
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Shuffle, DollarSign, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FilterProps {
  onFilterChange: (filters: {
    restaurant?: string;
    priceMin?: number;
    priceMax?: number;
  }) => void;
  onRandomItem: () => void;
}

const AdminMenuFilters = ({ onFilterChange, onRandomItem }: FilterProps) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const { toast } = useToast();

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/restaurants/');
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      return response.json();
    },
  });

  const handleFilterChange = () => {
    const filters: any = {};
    
    if (selectedRestaurant) {
      filters.restaurant = selectedRestaurant;
    }
    
    if (priceMin) {
      filters.priceMin = parseFloat(priceMin);
    }
    
    if (priceMax) {
      filters.priceMax = parseFloat(priceMax);
    }
    
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setSelectedRestaurant('');
    setPriceMin('');
    setPriceMax('');
    onFilterChange({});
  };

  const handleRandomItem = () => {
    onRandomItem();
    toast({
      title: "Surprise! 🎲",
      description: "Here's a random menu item for you!",
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Store className="w-4 h-4 inline mr-1" />
              Filter by Restaurant
            </label>
            <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
              <SelectTrigger>
                <SelectValue placeholder="All restaurants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All restaurants</SelectItem>
                {restaurants?.map((restaurant: any) => (
                  <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                    {restaurant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Min Price
            </label>
            <Input
              type="number"
              placeholder="0"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <Input
              type="number"
              placeholder="999"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleFilterChange} className="bg-emerald-600 hover:bg-emerald-700">
              Apply Filters
            </Button>
            <Button onClick={clearFilters} variant="outline">
              Clear
            </Button>
            <Button onClick={handleRandomItem} variant="outline" className="bg-purple-50 hover:bg-purple-100">
              <Shuffle className="w-4 h-4 mr-2" />
              Surprise Me!
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminMenuFilters;
