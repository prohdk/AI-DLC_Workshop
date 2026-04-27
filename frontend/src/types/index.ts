export interface Category {
  id: number;
  name: string;
  display_order: number;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_available: boolean;
}

export type OrderStatus = 'pending' | 'preparing' | 'completed';

export interface OrderItem {
  id: number;
  menu_item_id: number;
  menu_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  table_id: number;
  session_id: number;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

export interface Table {
  id: number;
  table_number: number;
  current_session_id: number | null;
}

export interface TableSummary {
  id: number;
  table_number: number;
  current_session_id: number | null;
  total_amount: number;
  order_count: number;
}

export interface OrderHistoryItem {
  menu_name: string;
  quantity: number;
  unit_price: number;
}

export interface OrderHistory {
  id: number;
  order_number: number;
  status: string;
  total_amount: number;
  created_at: string;
  archived_at: string;
  items: OrderHistoryItem[];
}

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface SSEEvent {
  event: string;
  data: string;
}
