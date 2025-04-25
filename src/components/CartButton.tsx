
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartButtonProps {
  tableId: string;
}

export function CartButton({ tableId }: CartButtonProps) {
  const { getItemCount, getTotal } = useCart();
  const navigate = useNavigate();
  
  const itemCount = getItemCount();
  const total = getTotal();
  
  const handleClick = () => {
    navigate(`/table/${tableId}/cart`);
  };
  
  if (itemCount === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={handleClick}
        className="shadow-lg bg-orange-500 hover:bg-orange-600 transition-all pl-4 pr-5 py-6"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
        <span className="mx-2">•</span>
        <span>${total.toFixed(2)}</span>
      </Button>
    </div>
  );
}
