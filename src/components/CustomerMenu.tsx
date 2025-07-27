
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingScreen from './LoadingScreen';
import MenuCategory from './MenuCategory';
import MobileCategoryNav from './MobileCategoryNav';
import { MenuItem } from '../types/MenuItem';
import { ChefHat, Sparkles } from 'lucide-react';

const CustomerMenu = () => {
  const [activeCategory, setActiveCategory] = useState<string>('');

  const { data: menuItems, isLoading, error } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const response = await fetch('https://menu-back.up.railway.app/api/menuitems');
      
      if (!response.ok) {
        const error = new Error('Failed to fetch menu items');
        (error as any).status = response.status;
        throw error;
      }
      
      return response.json();
    },
  });

  // Group items by category - moved this logic up
  const groupedItems = menuItems?.reduce((groups: Record<string, MenuItem[]>, item: MenuItem) => {
    const category = item.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {}) || {};

  const categories = Object.keys(groupedItems).sort();

  // Update active category on scroll - moved this hook before any returns
  useEffect(() => {
    if (categories.length === 0) return;

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    const errorStatus = (error as any).status;
    let errorTitle = "Oops! Something went wrong";
    let errorMessage = "Please try again later";

    if (errorStatus === 403) {
      errorTitle = "Access Denied";
      errorMessage = "This restaurant is currently inactive. If you are the owner, please contact support.";
    } else if (errorStatus === 404) {
      errorTitle = "Not Found";
      errorMessage = "Restaurant not found. Please check the link or contact support.";
    } else {
      errorTitle = "Unexpected Error";
      errorMessage = "An unexpected error occurred. Please try again later.";
    }

    return (
      <div className="min-h-screen fast-food-bg">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2 playful-font">{errorTitle}</h2>
            <p className="text-gray-600 playful-font">{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen fast-food-bg">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-8">
           <div className="flex items-center justify-center">
              <a href="/" className="block">
                <div className="bg-gradient-to-r from-orange-200 to-orange-300 rounded-full p-3 mr-4 float-animation">
                  <img src="/assets/logo.png" alt="MA-Menu" className="w-10 h-10" />
                </div>
              </a>
            <div className="text-center">
               <h1 className="text-4xl md:text-5xl font-bold text-white playful-font tracking-tight">
                 MA-Menu
               </h1>
              <div className="flex items-center justify-center mt-2">
                <Sparkles className="w-5 h-5 text-yellow-300 mr-2" />
                <p className="text-white/90 text-lg playful-font">Delicious food, made with love</p>
                <Sparkles className="w-5 h-5 text-yellow-300 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Category Navigation */}
      <MobileCategoryNav 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={scrollToCategory}
      />

      {/* Desktop Category Navigation */}
      <div className="hidden md:block bg-white/90 backdrop-blur-md border-b border-orange-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-center space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`category-button px-6 py-3 rounded-full font-medium text-sm ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg active'
                    : 'bg-white/80 text-gray-700 hover:bg-orange-50 border border-orange-200'
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-200">
              <p className="text-gray-500 text-lg playful-font">No delicious items available right now</p>
              <p className="text-gray-400 text-sm mt-2 playful-font">Check back soon!</p>
            </div>
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
