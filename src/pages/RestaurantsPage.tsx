
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, Star, Phone, ArrowLeft } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  username: string;
  description: string;
  phone_number: string;
  logo: string;
  rating: string;
  status: string;
}

const RestaurantsPage = () => {
  const navigate = useNavigate();

  const { data: restaurants, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await fetch('https://menu-back.up.railway.app/api/restaurants/');
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      return response.json();
    },
  });

  const handleRestaurantClick = (username: string) => {
    navigate(`/${username}`);
  };

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
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Menu
            </Button>
            <div className="flex items-center justify-center flex-1">
                <a href="/" className="block">
                  <div className="bg-gradient-to-r from-orange-200 to-orange-300 rounded-full p-3 mr-4 float-animation">
                    <img src="/assets/logo.png" alt="MA-Menu" className="w-10 h-10" />
                  </div>
                </a>
              <div className="text-center">
                 <h1 className="text-4xl md:text-5xl font-bold text-white playful-font tracking-tight">
                   MA-Menu Restaurants
                 </h1>
                <p className="text-white/90 text-lg playful-font mt-2">Choose your favorite place to order from</p>
              </div>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Restaurants Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {restaurants?.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-200">
              <p className="text-gray-500 text-lg playful-font">No restaurants available right now</p>
              <p className="text-gray-400 text-sm mt-2 playful-font">Check back soon!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants?.filter((restaurant: Restaurant) => restaurant.status === 'active').map((restaurant: Restaurant) => (
              <Card
                key={restaurant.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-orange-200 overflow-hidden"
                onClick={() => handleRestaurantClick(restaurant.username)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-full p-3 shadow-lg">
                      {restaurant.logo ? (
                        <img 
                          src={restaurant.logo} 
                          alt={restaurant.name} 
                          className="w-12 h-12 rounded-full object-cover" 
                        />
                      ) : (
                        <ChefHat className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 playful-font">{restaurant.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span>{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          <span>{restaurant.phone_number}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm playful-font line-clamp-3">
                    {restaurant.description}
                  </p>
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestaurantClick(restaurant.username);
                    }}
                  >
                    View Menu
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantsPage;
