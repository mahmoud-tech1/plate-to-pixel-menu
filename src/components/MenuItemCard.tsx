
import { MenuItem } from '../types/MenuItem';
import { ImageIcon } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    e.currentTarget.nextElementSibling?.classList.remove('hidden');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-100">
        {item.photo ? (
          <>
            <img
              src={item.photo}
              alt={item.item_name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">No image available</p>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">No image available</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {item.item_name}
          </h3>
          <span className="text-lg font-bold text-emerald-600 ml-2">
            ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
          </span>
        </div>
        
        {item.description && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
