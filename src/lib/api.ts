import axios, { AxiosResponse } from 'axios';
import { ApiResponse, Category, MenuItem, Order, Table, User } from "./types";

const API_URL = import.meta.env.VITE_API_URL || 'https://final-year-backend-sooty.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fix response interceptor 
api.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    // Convert to our API response format
    return {
      success: true,
      data: response.data.data || response.data
    } as ApiResponse<any>;
  },
  (error) => {
    // Handle errors and convert to our API response format
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'An error occurred'
    } as ApiResponse<any>;
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response as unknown as ApiResponse<{ token: string; user: User }>;
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  },
  
  register: async (userData: { 
    username: string; 
    email: string; 
    password: string; 
    role: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> => {
    return api.post('/auth/register', userData);
  },
  
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return api.get('/auth/me');
  },
};

// Tables API
export const tablesAPI = {
  getAllTables: async (): Promise<ApiResponse<Table[]>> => {
    return api.get('/tables');
  },

  createTable: async (tableData: { number: number; seats: number }): Promise<ApiResponse<Table>> => {
    return api.post('/tables', tableData);
  },

  regenerateQRCode: async (id: string): Promise<ApiResponse<Table>> => {
    return api.post(`/tables/${id}/qrcode`);
  },
  
  getTable: async (id: string): Promise<ApiResponse<Table>> => {
    return api.get(`/tables/${id}`);
  },
  
  updateTable: async (id: string, tableData: Partial<Table>): Promise<ApiResponse<Table>> => {
    const payload = { ...tableData };
    return api.put(`/tables/${id}`, payload);
  },
  
  deleteTable: async (id: string): Promise<ApiResponse<{}>> => {
    return api.delete(`/tables/${id}`);
  },
};

// Menu API
export const menuAPI = {
  // Categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return api.get('/menu/categories');
  },
  
  createCategory: async (name: string): Promise<ApiResponse<Category>> => {
    return api.post('/menu/categories', { name });
  },
  
  deleteCategory: async (id: string): Promise<ApiResponse<{}>> => {
    return api.delete(`/menu/categories/${id}`);
  },
  
  // Menu Items
  getMenuItems: async (): Promise<ApiResponse<MenuItem[]>> => {
    return api.get('/menu/items');
  },
  
  getMenuItem: async (id: string): Promise<ApiResponse<MenuItem>> => {
    return api.get(`/menu/items/${id}`);
  },
  
  createMenuItem: async (itemData: {
    name: string;
    description: string;
    price: number;
    image?: string;
    category: string;
    available?: boolean;
  }): Promise<ApiResponse<MenuItem>> => {
    return api.post('/menu/items', itemData);
  },
  
  updateMenuItem: async (id: string, itemData: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> => {
    return api.put(`/menu/items/${id}`, itemData);
  },
  
  deleteMenuItem: async (id: string): Promise<ApiResponse<{}>> => {
    return api.delete(`/menu/items/${id}`);
  },
};

// Orders API
export const ordersAPI = {
  getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
    return api.get('/orders');
  },
  
  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    return api.get(`/orders/${id}`);
  },
  
  createOrder: async (orderData: {
    tableId: string;
    items: {
      menuItemId: string;
      quantity: number;
      specialInstructions?: string;
    }[];
    notes?: string;
  }): Promise<ApiResponse<Order>> => {
    return api.post('/orders', orderData);
  },
  
  updateOrder: async (id: string, status: Order['status']): Promise<ApiResponse<Order>> => {
    return api.put(`/orders/${id}`, { status });
  },
  
  getOrdersByTable: async (tableId: string): Promise<ApiResponse<Order[]>> => {
    return api.get(`/orders/table/${tableId}`);
  },
  
  getOrdersByStatus: async (status: Order['status']): Promise<ApiResponse<Order[]>> => {
    return api.get(`/orders/status/${status}`);
  },
};
