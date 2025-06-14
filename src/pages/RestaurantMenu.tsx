import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import LoadingScreen from '../components/LoadingScreen';
import MenuCategory from '../components/MenuCategory';
import MobileCategoryNav from '../components/MobileCategoryNav';
import { MenuItem } from '../types/MenuItem';
import { ChefHat, Sparkles, MapPin, Phone, Star } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  username: string;
  description: string;
  phone_number: string;
  logo: string;
  rating: string;
}

const RestaurantMenu = () => {
  const { restaurantName } = useParams<{ restaurantName: string }>();
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Fetch restaurant data
  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await fetch('https://menu-backend-56ur.onrender.com/api/restaurants/');
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      return response.json();
    },
  });

  // Find the restaurant by username
  const restaurant = restaurants?.find((r: Restaurant) => r.username === restaurantName);

  // Fetch menu items for this restaurant
  const { data: menuItems, isLoading, error } = useQuery({
    queryKey: ['restaurantMenuItems', restaurant?.id],
    queryFn: async () => {
      if (!restaurant?.id) return [];
      const response = await fetch(`https://menu-backend-56ur.onrender.com/api/menuitems/findAllByRestaurant/${restaurant.id}`);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      return response.json();
    },
    enabled: !!restaurant?.id,
  });

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

  // Update active category on scroll
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

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center fast-food-bg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2 playful-font">Restaurant Not Found</h2>
          <p className="text-gray-600 playful-font">The restaurant you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center fast-food-bg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2 playful-font">Oops! Something went wrong</h2>
          <p className="text-gray-600 playful-font">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen fast-food-bg">
      {/* Restaurant Header */}
      <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4 float-animation mb-4 md:mb-0">
              {restaurant.logo ? (
                <img src={restaurant.logo} alt={restaurant.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <ChefHat className="w-16 h-16 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white playful-font tracking-tight mb-2">
                {restaurant.name}
              </h1>
              <p className="text-white/90 text-lg playful-font mb-2">{restaurant.description}</p>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-white/80">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-300 mr-1" />
                  <span>{restaurant.rating}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  <span>{restaurant.phone_number}</span>
                </div>
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

export default RestaurantMenu;
