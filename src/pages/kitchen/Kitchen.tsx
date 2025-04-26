
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { orders as initialOrders } from "@/lib/sample-data";
import { Order } from "@/lib/types";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import OrderColumn from "./components/OrderColumn";

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
        <OrderColumn
          title="Pending"
          orders={pendingOrders}
          variant="default"
          onUpdateStatus={updateOrderStatus}
          nextStatus="confirmed"
          buttonText="Confirm Order"
        />
        
        <OrderColumn
          title="Confirmed"
          orders={confirmedOrders}
          variant="orange"
          onUpdateStatus={updateOrderStatus}
          nextStatus="preparing"
          buttonText="Start Preparing"
        />
        
        <OrderColumn
          title="Preparing"
          orders={preparingOrders}
          variant="blue"
          onUpdateStatus={updateOrderStatus}
          nextStatus="ready"
          buttonText="Mark as Ready"
        />
        
        <OrderColumn
          title="Ready for Service"
          orders={readyOrders}
          variant="green"
          onUpdateStatus={updateOrderStatus}
          nextStatus="delivered"
          buttonText="Mark as Delivered"
        />
      </div>
    </Layout>
  );
};

export default Kitchen;
