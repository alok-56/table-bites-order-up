
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { Plus } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col animate-fade-in">
      <div className="h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2 flex-grow">{item.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleAddToCart}
            disabled={!item.available}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
