
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/types";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import OrderColumn from "./components/OrderColumn";
import { ordersAPI } from "@/lib/api";

const Kitchen = () => {
  const queryClient = useQueryClient();
  
  // Fetch all orders
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['kitchenOrders'],
    queryFn: async () => {
      const response = await ordersAPI.getAllOrders();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  // Update order status mutation
  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: Order['status'] }) => {
      return ordersAPI.updateOrder(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update order status");
    }
  });
  
  const updateStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatus({ orderId, status });
    
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
  
  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to load orders</h2>
          <p className="text-gray-600 mb-6">There was an error loading the kitchen orders.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] })}>
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }
  
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
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <OrderColumn
            title="Pending"
            orders={pendingOrders}
            variant="default"
            onUpdateStatus={updateStatus}
            nextStatus="confirmed"
            buttonText="Confirm Order"
          />
          
          <OrderColumn
            title="Confirmed"
            orders={confirmedOrders}
            variant="orange"
            onUpdateStatus={updateStatus}
            nextStatus="preparing"
            buttonText="Start Preparing"
          />
          
          <OrderColumn
            title="Preparing"
            orders={preparingOrders}
            variant="blue"
            onUpdateStatus={updateStatus}
            nextStatus="ready"
            buttonText="Mark as Ready"
          />
          
          <OrderColumn
            title="Ready for Service"
            orders={readyOrders}
            variant="green"
            onUpdateStatus={updateStatus}
            nextStatus="delivered"
            buttonText="Mark as Delivered"
          />
        </div>
      )}
    </Layout>
  );
};

export default Kitchen;
