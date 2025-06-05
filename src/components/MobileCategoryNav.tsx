
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface MobileCategoryNavProps {
  categories: string[];
  activeCategory?: string;
  onCategoryClick: (category: string) => void;
}

const MobileCategoryNav = ({ categories, activeCategory, onCategoryClick }: MobileCategoryNavProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
          : 'relative bg-transparent'
      }`}
    >
      <div className="px-4 py-3">
        {/* Compact view when sticky */}
        {isSticky && !isExpanded && (
          <Button
            variant="outline"
            onClick={() => setIsExpanded(true)}
            className="w-full justify-between text-left"
          >
            <span className="truncate">
              {activeCategory ? `${activeCategory}` : 'Browse Categories'}
            </span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        )}

        {/* Expanded view or non-sticky view */}
        {(!isSticky || isExpanded) && (
          <div className="space-y-2">
            {isSticky && (
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(false)}
                className="w-full justify-between text-left mb-2"
                size="sm"
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            )}
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onCategoryClick(category);
                    if (isSticky) setIsExpanded(false);
                  }}
                  className="bg-white/80 backdrop-blur-sm hover:bg-emerald-50 border-emerald-200"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCategoryNav;
