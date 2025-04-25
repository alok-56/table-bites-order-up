
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Check, Menu } from "lucide-react";

const OrderConfirmation = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const { items, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    // In a real app, we wouldn't clear the cart immediately
    // This is just for demo purposes
    setTimeout(() => {
      clearCart();
    }, 1000);
  }, [clearCart]);
  
  return (
    <Layout>
      <div className="max-w-md mx-auto text-center">
        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Check className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been sent to the kitchen. The staff will bring your food to table #{tableId}.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 text-left">Order Summary</h2>
          
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.menuItemId} className="flex justify-between text-left">
                <span className="text-gray-700">
                  {item.quantity} x {item.name}
                </span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">${getTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={() => navigate(`/table/${tableId}`)}
        >
          <Menu className="mr-2 h-5 w-5" />
          Back to Menu
        </Button>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
