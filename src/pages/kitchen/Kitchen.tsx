
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { orders as initialOrders } from "@/lib/sample-data";
import { Order } from "@/lib/types";
import { Link } from "react-router-dom";
import { Check, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const Kitchen = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    const statusMessages = {
      confirmed: "Order confirmed",
      preparing: "Order started preparation",
      ready: "Order is ready for delivery",
      delivered: "Order marked as delivered",
    };
    
    toast.success(statusMessages[status] || "Order status updated");
  };
  
  // Group orders by status
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const confirmedOrders = orders.filter(order => order.status === 'confirmed');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/">
            <Button variant="ghost" className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Pending</h2>
              <Badge variant="outline" className="bg-gray-200">
                {pendingOrders.length}
              </Badge>
            </div>
          </div>
          
          <div className="p-2 space-y-2 min-h-[200px]">
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <div key={order.id} className="bg-white border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Table #{order.tableNumber}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    {order.items.map((item) => (
                      <div key={item.menuItemId}>
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'confirmed')}
                    className="w-full"
                    size="sm"
                  >
                    Confirm Order
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                No pending orders
              </div>
            )}
          </div>
        </div>
        
        {/* Confirmed Orders */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-orange-50 px-4 py-2 border-b border-orange-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-orange-700">Confirmed</h2>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                {confirmedOrders.length}
              </Badge>
            </div>
          </div>
          
          <div className="p-2 space-y-2 min-h-[200px]">
            {confirmedOrders.length > 0 ? (
              confirmedOrders.map((order) => (
                <div key={order.id} className="bg-white border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Table #{order.tableNumber}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    {order.items.map((item) => (
                      <div key={item.menuItemId}>
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    size="sm"
                  >
                    Start Preparing
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                No confirmed orders
              </div>
            )}
          </div>
        </div>
        
        {/* Preparing Orders */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-blue-700">Preparing</h2>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                {preparingOrders.length}
              </Badge>
            </div>
          </div>
          
          <div className="p-2 space-y-2 min-h-[200px]">
            {preparingOrders.length > 0 ? (
              preparingOrders.map((order) => (
                <div key={order.id} className="bg-white border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Table #{order.tableNumber}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    {order.items.map((item) => (
                      <div key={item.menuItemId}>
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    variant="outline"
                    className="w-full border-blue-500 text-blue-700 hover:bg-blue-50"
                    size="sm"
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Mark as Ready
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                No orders in preparation
              </div>
            )}
          </div>
        </div>
        
        {/* Ready Orders */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-50 px-4 py-2 border-b border-green-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-green-700">Ready for Service</h2>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                {readyOrders.length}
              </Badge>
            </div>
          </div>
          
          <div className="p-2 space-y-2 min-h-[200px]">
            {readyOrders.length > 0 ? (
              readyOrders.map((order) => (
                <div key={order.id} className="bg-white border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Table #{order.tableNumber}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    {order.items.map((item) => (
                      <div key={item.menuItemId}>
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    className="w-full bg-green-500 hover:bg-green-600"
                    size="sm"
                  >
                    Mark as Delivered
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                No orders ready for service
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Kitchen;
