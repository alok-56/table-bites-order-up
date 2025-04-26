import { ApiResponse, Category, MenuItem, Order, Table, User } from "./types";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6000/api';

// Helper function for making authenticated requests
const authFetch = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  // Get token from local storage
  const token = localStorage.getItem('token');
  
  // Set headers with authentication token
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'Unknown error occurred' };
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data };
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
    return authFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return authFetch('/auth/me');
  },
};

// Tables API
export const tablesAPI = {
  getAllTables: async (): Promise<ApiResponse<Table[]>> => {
    try {
      const response = await fetch(`${API_URL}/tables`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to fetch tables' };
    }
  },

  createTable: async (tableData: { number: number; seats: number }): Promise<ApiResponse<Table>> => {
    try {
      const response = await fetch(`${API_URL}/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(tableData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to create table' };
    }
  },

  regenerateQRCode: async (id: string): Promise<ApiResponse<Table>> => {
    try {
      const response = await fetch(`${API_URL}/tables/${id}/qrcode`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to regenerate QR code' };
    }
  },
  
  getTable: async (id: string): Promise<ApiResponse<Table>> => {
    return authFetch(`/tables/${id}`);
  },
  
  updateTable: async (id: string, tableData: Partial<Table>): Promise<ApiResponse<Table>> => {
    return authFetch(`/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tableData),
    });
  },
  
  deleteTable: async (id: string): Promise<ApiResponse<{}>> => {
    return authFetch(`/tables/${id}`, {
      method: 'DELETE',
    });
  },
};

// Menu API
export const menuAPI = {
  // Categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return authFetch('/menu/categories');
  },
  
  createCategory: async (name: string): Promise<ApiResponse<Category>> => {
    return authFetch('/menu/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
  
  deleteCategory: async (id: string): Promise<ApiResponse<{}>> => {
    return authFetch(`/menu/categories/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Menu Items
  getMenuItems: async (): Promise<ApiResponse<MenuItem[]>> => {
    return authFetch('/menu/items');
  },
  
  getMenuItem: async (id: string): Promise<ApiResponse<MenuItem>> => {
    return authFetch(`/menu/items/${id}`);
  },
  
  createMenuItem: async (itemData: {
    name: string;
    description: string;
    price: number;
    image?: string;
    category: string;
    available?: boolean;
  }): Promise<ApiResponse<MenuItem>> => {
    return authFetch('/menu/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },
  
  updateMenuItem: async (id: string, itemData: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> => {
    return authFetch(`/menu/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },
  
  deleteMenuItem: async (id: string): Promise<ApiResponse<{}>> => {
    return authFetch(`/menu/items/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
    return authFetch('/orders');
  },
  
  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    return authFetch(`/orders/${id}`);
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
    return authFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  
  updateOrder: async (id: string, status: Order['status']): Promise<ApiResponse<Order>> => {
    return authFetch(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  
  getOrdersByTable: async (tableId: string): Promise<ApiResponse<Order[]>> => {
    return authFetch(`/orders/table/${tableId}`);
  },
  
  getOrdersByStatus: async (status: Order['status']): Promise<ApiResponse<Order[]>> => {
    return authFetch(`/orders/status/${status}`);
  },
};
