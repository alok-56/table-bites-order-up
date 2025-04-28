
import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, MenuItem } from "@/lib/types";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  tableId: string | null;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setTableId: (id: string | null) => void;
  getTotal: () => number;
  getItemCount: () => number;
  // Add these functions
  addToCart: (item: MenuItem) => void;
  isItemInCart: (menuItemId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableId, setTableId] = useState<string | null>(null);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item.menuItemId === newItem.menuItemId
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        toast.success(`Added another ${newItem.name} to your cart`);
        return updatedItems;
      } else {
        // New item
        toast.success(`Added ${newItem.name} to your cart`);
        return [...currentItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems((currentItems) => {
      const itemToRemove = currentItems.find(item => item.menuItemId === menuItemId);
      if (itemToRemove) {
        toast.info(`Removed ${itemToRemove.name} from your cart`);
      }
      return currentItems.filter((item) => item.menuItemId !== menuItemId);
    });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  // Add new function to check if an item is in the cart
  const isItemInCart = (menuItemId: string): boolean => {
    return items.some((item) => item.menuItemId === menuItemId);
  };

  // Add new function to directly add menu items to cart
  const addToCart = (menuItem: MenuItem) => {
    const newCartItem = {
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price
    };
    addItem(newCartItem);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        tableId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setTableId,
        getTotal,
        getItemCount,
        // Add new functions to the context value
        addToCart,
        isItemInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
