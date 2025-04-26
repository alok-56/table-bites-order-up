
import axios from 'axios';
import { ApiResponse, Category, MenuItem, Order, Table, User } from '../lib/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Login failed' };
    }
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Registration failed' };
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get('/auth/me');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to get user' };
    }
  },
};

// Tables API
export const tablesAPI = {
  getAllTables: async (): Promise<ApiResponse<Table[]>> => {
    try {
      const response = await api.get('/tables');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to fetch tables' };
    }
  },

  createTable: async (tableData: { number: number; seats: number }): Promise<ApiResponse<Table>> => {
    try {
      const response = await api.post('/tables', tableData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to create table' };
    }
  },

  regenerateQRCode: async (id: string): Promise<ApiResponse<Table>> => {
    try {
      const response = await api.post(`/tables/${id}/qrcode`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to regenerate QR code' };
    }
  },
};

// Menu API
export const menuAPI = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const response = await api.get('/menu/categories');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to fetch categories' };
    }
  },

  createCategory: async (name: string): Promise<ApiResponse<Category>> => {
    try {
      const response = await api.post('/menu/categories', { name });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to create category' };
    }
  },

  getMenuItems: async (): Promise<ApiResponse<MenuItem[]>> => {
    try {
      const response = await api.get('/menu/items');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to fetch menu items' };
    }
  },
};

// Orders API
export const ordersAPI = {
  getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
    try {
      const response = await api.get('/orders');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to fetch orders' };
    }
  },

  createOrder: async (orderData: {
    tableId: string;
    items: { menuItemId: string; quantity: number; specialInstructions?: string }[];
    notes?: string;
  }): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.post('/orders', orderData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to create order' };
    }
  },

  updateOrder: async (id: string, status: Order['status']): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.put(`/orders/${id}`, { status });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to update order' };
    }
  },
};

export default api;
