
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
          ? 'fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg border-b' 
          : 'relative bg-white/80 backdrop-blur-sm border-b'
      }`}
    >
      <div className="px-4 py-3">
        {/* Horizontal scrolling categories */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 min-w-max pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryClick(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white/80 text-gray-700 border border-emerald-200 hover:bg-emerald-50'
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
