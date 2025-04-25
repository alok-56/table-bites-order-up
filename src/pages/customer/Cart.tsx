
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, ChevronLeft, Plus, Minus, Check } from "lucide-react";

const Cart = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  
  const handlePlaceOrder = () => {
    // In a real app, we would send the order to the backend
    // For now, just navigate to the confirmation page
    navigate(`/table/${tableId}/confirmation`);
  };
  
  if (items.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-600 mb-6">Add some delicious items to get started!</p>
          <Button 
            onClick={() => navigate(`/table/${tableId}`)}
            className="flex items-center"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Menu
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => navigate(`/table/${tableId}`)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Menu
          </Button>
          <h1 className="text-2xl font-bold">Your Order</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Items in your cart</h2>
          
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.menuItemId} className="flex justify-between items-center border-b pb-4">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="w-6 text-center">{item.quantity}</span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="ml-4 text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special instructions
            </label>
            <Textarea 
              placeholder="Any special requests for your order..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Subtotal</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 pb-4 border-b">
            <span className="font-medium">Table Service Fee</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
          
          <Button 
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
            size="lg"
            onClick={handlePlaceOrder}
          >
            <Check className="mr-2 h-5 w-5" />
            Place Order
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
