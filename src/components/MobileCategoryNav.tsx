
import { useState, useEffect } from 'react';

interface MobileCategoryNavProps {
  categories: string[];
  activeCategory?: string;
  onCategoryClick: (category: string) => void;
}

const MobileCategoryNav = ({ categories, activeCategory, onCategoryClick }: MobileCategoryNavProps) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`md:hidden transition-all duration-300 z-40 ${
        isSticky 
          ? 'fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl border-b border-orange-200' 
          : 'relative bg-white/90 backdrop-blur-sm border-b border-orange-100'
      }`}
    >
      <div className="px-4 py-4">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 min-w-max pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryClick(category)}
                className={`category-button px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg active'
                    : 'bg-white/90 text-gray-700 border border-orange-200 hover:bg-orange-50 hover:border-orange-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCategoryNav;
