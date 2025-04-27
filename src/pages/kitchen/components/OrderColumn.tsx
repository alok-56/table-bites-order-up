
import { Order } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface OrderColumnProps {
  title: string;
  orders: Order[];
  variant: 'default' | 'orange' | 'blue' | 'green';
  onUpdateStatus: (orderId: string) => void;
  nextStatus: Order['status'];
  buttonText: string;
  isLoading?: boolean;
}

const OrderColumn = ({ 
  title, 
  orders, 
  variant, 
  onUpdateStatus, 
  nextStatus, 
  buttonText,
  isLoading = false
}: OrderColumnProps) => {
  const getVariantStyles = () => {
    const styles = {
      default: {
        header: 'bg-gray-100',
        badge: 'bg-gray-200',
        button: ''
      },
      orange: {
        header: 'bg-orange-50 border-orange-200',
        badge: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
        button: 'bg-orange-500 hover:bg-orange-600'
      },
      blue: {
        header: 'bg-blue-50 border-blue-200',
        badge: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
        button: 'border-blue-500 text-blue-700 hover:bg-blue-50'
      },
      green: {
        header: 'bg-green-50 border-green-200',
        badge: 'bg-green-100 text-green-700 hover:bg-green-100',
        button: 'bg-green-500 hover:bg-green-600'
      }
    };
    return styles[variant];
  };

  const styles = getVariantStyles();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`${styles.header} px-4 py-2 border-b`}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{title}</h2>
          <Badge className={styles.badge}>
            {orders.length}
          </Badge>
        </div>
      </div>
      
      <div className="p-2 space-y-2 min-h-[200px] max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-white border rounded p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Table #{order.tableNumber}</span>
                <span className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-3 max-h-36 overflow-y-auto">
                {order.items.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between mb-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {order.notes && (
                  <div className="mt-2 pt-2 border-t text-xs italic text-gray-500">
                    Note: {order.notes}
                  </div>
                )}
              </div>
              
              <Button
                onClick={() => onUpdateStatus(order.id)}
                className={`w-full ${styles.button}`}
                size="sm"
                variant={variant === 'blue' ? 'outline' : 'default'}
              >
                {variant === 'blue' && <Check className="mr-1 h-4 w-4" />}
                {buttonText}
              </Button>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full py-10 text-gray-500 italic">
            No {title.toLowerCase()} orders
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderColumn;
