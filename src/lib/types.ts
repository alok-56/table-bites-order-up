
// Data models for the application

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  qrCode: string;
  status: 'available' | 'occupied';
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'canceled';
  total: number;
  createdAt: string;
  notes?: string;
}
