
import MenuItemCard from './MenuItemCard';
import { MenuItem } from '../types/MenuItem';

interface MenuCategoryProps {
  category: string;
  items: MenuItem[];
}

const MenuCategory = ({ category, items }: MenuCategoryProps) => {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 playful-font mb-2">
          {category}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MenuCategory;
