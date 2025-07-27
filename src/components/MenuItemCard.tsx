
import { useState } from 'react';
import { MenuItem } from '../types/MenuItem';
import { ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    e.currentTarget.nextElementSibling?.classList.remove('hidden');
  };

  const hasLongDescription = item.description && item.description.length > 100;

  return (
    <div 
      className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden menu-item-hover border border-white/30 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => hasLongDescription && setIsExpanded(!isExpanded)}
    >
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-yellow-100 overflow-hidden">
        {item.photo ? (
          <>
            <img
              src={item.photo}
              alt={item.item_name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              onError={handleImageError}
            />
            <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
              <div className="text-center text-orange-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm font-medium">No image available</p>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
            <div className="text-center text-orange-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 float-animation" />
              <p className="text-sm font-medium playful-font">No image available</p>
            </div>
          </div>
        )}
        
        {/* Price tag with warm colors to match background */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full shadow-lg transform rotate-3">
          <span className="text-lg font-bold playful-font">
            {typeof item.price === 'number' ? item.price.toLocaleString('en-US') : parseFloat(item.price).toLocaleString('en-US')} SP
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 playful-font leading-tight">
            {item.item_name}
          </h3>
        </div>
        
        {item.description && (
          <div className="text-gray-600">
            <p className={`text-sm leading-relaxed ${!isExpanded && hasLongDescription ? 'line-clamp-3' : ''}`}>
              {item.description}
            </p>
            
            {hasLongDescription && (
              <div className={`description-expand ${isExpanded ? 'expanded' : ''}`}>
                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {hasLongDescription && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="mt-2 flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors playful-font"
              >
                {isExpanded ? (
                  <>
                    <span>Show less</span>
                    <ChevronUp className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    <span>Read more</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
