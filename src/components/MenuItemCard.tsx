
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MenuItem } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem, items } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const isInCart = items.some((cartItem) => cartItem.menuItemId === item.id);
  
  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      menuItemId: item._id,
      name: item.name,
      price: item.price
    });
    toast.success(`${item.name} added to cart`);
    setTimeout(() => setIsAdding(false), 1000);
  };
  
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium">Currently Unavailable</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
          <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        <Button 
          variant={isInCart ? "secondary" : "default"}
          className={`w-full ${isInCart ? 'bg-gray-100' : 'bg-orange-500 hover:bg-orange-600'}`}
          onClick={handleAddToCart}
          disabled={!item.available || isAdding}
        >
          {isInCart ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Added to cart
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add to cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
