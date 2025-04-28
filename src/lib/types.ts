
// Data models for the application

export interface MenuItem {
  _id: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  available: boolean;
}

export interface Category {
  _id: string;
  id?: string;
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
  _id: string;
  id?: string;
  number: number;
  seats: number;
  qrCode: string;
  status: 'available' | 'occupied';
}

export interface Order {
  _id: string;
  id?: string;
  tableId: string;
  tableNumber: number;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'canceled';
  total: number;
  createdAt: string;
  notes?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'kitchen';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
