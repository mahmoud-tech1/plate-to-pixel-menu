
export interface MenuItem {
  id: number;
  item_name: string;
  price: number;
  category: string;
  description?: string;
  photo?: string;
  created_by: string;
  updated_by: string;
  restaurantId?: number;
  status?: string;
}
