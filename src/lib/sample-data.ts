
import { MenuItem, Category, Table, Order } from './types';

// Sample categories
export const categories: Category[] = [
  { id: '1', name: 'Starters' },
  { id: '2', name: 'Main Course' },
  { id: '3', name: 'Desserts' },
  { id: '4', name: 'Beverages' },
];

// Sample menu items
export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Crispy Calamari',
    description: 'Tender calamari fried to golden perfection, served with marinara sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1633436375153-d7045cb93e51?q=80&w=2832&auto=format&fit=crop',
    category: '1',
    available: true,
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with creamy Caesar dressing, parmesan, and croutons',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=2070&auto=format&fit=crop',
    category: '1',
    available: true,
  },
  {
    id: '3',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon fillet grilled to perfection with lemon butter sauce',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop',
    category: '2',
    available: true,
  },
  {
    id: '4',
    name: 'Filet Mignon',
    description: '8oz center-cut beef tenderloin grilled to your preference with garlic butter',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=2080&auto=format&fit=crop',
    category: '2',
    available: true,
  },
  {
    id: '5',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1617026061250-62b474264442?q=80&w=1974&auto=format&fit=crop',
    category: '3',
    available: true,
  },
  {
    id: '6',
    name: 'Strawberry Cheesecake',
    description: 'Creamy New York style cheesecake topped with fresh strawberry compote',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=2070&auto=format&fit=crop',
    category: '3',
    available: true,
  },
  {
    id: '7',
    name: 'Craft Beer',
    description: 'Selection of local craft beers',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?q=80&w=2070&auto=format&fit=crop',
    category: '4',
    available: true,
  },
  {
    id: '8',
    name: 'Wine by the Glass',
    description: 'Selection of red and white wines',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
    category: '4',
    available: true,
  },
];

// Sample tables
export const tables: Table[] = [
  { id: '1', number: 1, seats: 2, qrCode: '/qr/table1.png', status: 'available' },
  { id: '2', number: 2, seats: 4, qrCode: '/qr/table2.png', status: 'occupied' },
  { id: '3', number: 3, seats: 6, qrCode: '/qr/table3.png', status: 'available' },
  { id: '4', number: 4, seats: 2, qrCode: '/qr/table4.png', status: 'available' },
  { id: '5', number: 5, seats: 8, qrCode: '/qr/table5.png', status: 'occupied' },
];

// Sample orders
export const orders: Order[] = [
  {
    id: '1',
    tableId: '2',
    tableNumber: 2,
    items: [
      { menuItemId: '1', name: 'Crispy Calamari', price: 12.99, quantity: 1 },
      { menuItemId: '3', name: 'Grilled Salmon', price: 24.99, quantity: 2 },
    ],
    status: 'preparing',
    total: 62.97,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
  },
  {
    id: '2',
    tableId: '5',
    tableNumber: 5,
    items: [
      { menuItemId: '2', name: 'Caesar Salad', price: 10.99, quantity: 1 },
      { menuItemId: '4', name: 'Filet Mignon', price: 32.99, quantity: 3 },
      { menuItemId: '6', name: 'Strawberry Cheesecake', price: 7.99, quantity: 1 },
    ],
    status: 'confirmed',
    total: 117.95,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
];
