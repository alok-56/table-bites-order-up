
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const { addToCart, isItemInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const alreadyInCart = isItemInCart(item._id);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(item);
      toast.success(`Added ${item.name} to your cart`);
      setIsAdding(false);
    }, 300);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group border border-gray-200">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {item.image ? (
          <>
            <div 
              className={`absolute inset-0 bg-gray-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}
            />
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } group-hover:scale-110`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50">
            <span className="text-orange-300 text-xl font-light">No Image</span>
          </div>
        )}
        
        {/* Price tag */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md text-orange-800 font-medium">
          ${item.price.toFixed(2)}
        </div>
      </div>
      
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 h-10">
          {item.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 px-4">
        <Button
          onClick={handleAddToCart}
          disabled={alreadyInCart || isAdding}
          className={`w-full transition-all duration-300 ${
            alreadyInCart
              ? "bg-green-500 hover:bg-green-600"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {alreadyInCart ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added to Cart
            </>
          ) : isAdding ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
