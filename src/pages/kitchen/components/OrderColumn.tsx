
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/types";

interface OrderColumnProps {
  title: string;
  orders: Order[];
  variant: 'default' | 'orange' | 'blue' | 'green';
  onUpdateStatus: (orderId: string) => void;
  nextStatus: string;
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
  // Get header color based on variant
  const getHeaderClass = () => {
    switch (variant) {
      case 'orange':
        return 'bg-orange-50 border-orange-200';
      case 'blue':
        return 'bg-blue-50 border-blue-200';
      case 'green':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  
  // Get button color based on variant
  const getButtonClass = () => {
    switch (variant) {
      case 'orange':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'green':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  // Format time (relative to now)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins === 1) {
      return '1 minute ago';
    } else if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else {
      const hours = Math.floor(diffMins / 60);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className={`p-4 rounded-t-lg border-b ${getHeaderClass()}`}>
        <h3 className="font-semibold">{title}</h3>
        <div className="text-sm text-gray-500">{orders.length} orders</div>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-240px)]">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4 p-4">
            {orders.map((order) => (
              <Card key={order.id} className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">Table #{order.tableNumber}</CardTitle>
                    <span className="text-sm text-gray-500">{formatTime(order.createdAt)}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ul className="mb-4 space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                          {item.specialInstructions && (
                            <p className="text-xs text-gray-500">Note: {item.specialInstructions}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  {order.notes && (
                    <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
                      <p className="font-medium">Order Notes:</p>
                      <p className="text-gray-700">{order.notes}</p>
                    </div>
                  )}
                  
                  <Button 
                    className={`w-full ${getButtonClass()}`}
                    onClick={() => onUpdateStatus(order.id)}
                  >
                    {buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            No orders in this status
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderColumn;
