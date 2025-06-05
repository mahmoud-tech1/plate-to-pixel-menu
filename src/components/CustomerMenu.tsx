
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingScreen from './LoadingScreen';
import MenuCategory from './MenuCategory';
import MobileCategoryNav from './MobileCategoryNav';
import { MenuItem } from '../types/MenuItem';
import { ChefHat } from 'lucide-react';

const CustomerMenu = () => {
  const [activeCategory, setActiveCategory] = useState<string>('');

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
      <div className="min-h-screen flex items-center justify-center texture-bg">
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

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    const element = document.getElementById(`category-${category}`);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Update active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      const categoryElements = categories.map(category => 
        document.getElementById(`category-${category}`)
      ).filter(Boolean);

      const current = categoryElements.find(element => {
        const rect = element!.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });

      if (current) {
        const categoryName = current.id.replace('category-', '');
        setActiveCategory(categoryName);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  return (
    <div className="min-h-screen texture-bg">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-emerald-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
          </div>
          <p className="text-center text-gray-600 mt-2">Discover our delicious selection</p>
        </div>
      </header>

      {/* Mobile Category Navigation */}
      <MobileCategoryNav 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={scrollToCategory}
      />

      {/* Desktop Category Navigation - Hidden on mobile */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-center space-x-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No menu items available</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category} id={`category-${category}`}>
                <MenuCategory
                  category={category}
                  items={groupedItems[category]}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerMenu;
