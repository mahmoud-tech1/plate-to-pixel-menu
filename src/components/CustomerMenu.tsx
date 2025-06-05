
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingScreen from './LoadingScreen';
import MenuCategory from './MenuCategory';
import { MenuItem } from '../types/MenuItem';
import { ChefHat } from 'lucide-react';

const CustomerMenu = () => {
  const { data: menuItems, isLoading, error } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const response = await fetch('https://menu-backend-56ur.onrender.com/api/menuitems');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Menu</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  // Group items by category
  const groupedItems = menuItems?.reduce((groups: Record<string, MenuItem[]>, item: MenuItem) => {
    const category = item.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {}) || {};

  const categories = Object.keys(groupedItems).sort();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-emerald-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
          </div>
          <p className="text-center text-gray-600 mt-2">Discover our delicious selection</p>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No menu items available</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => (
              <MenuCategory
                key={category}
                category={category}
                items={groupedItems[category]}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerMenu;
