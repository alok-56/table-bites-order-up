
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/types";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import OrderColumn from "./components/OrderColumn";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersAPI } from "@/lib/api";

const Kitchen = () => {
  const queryClient = useQueryClient();
  
  // Fetch orders by status
  const { data: pendingOrders = [], isLoading: pendingLoading } = useQuery({
    queryKey: ['orders', 'pending'],
    queryFn: async () => {
      const response = await ordersAPI.getOrdersByStatus('pending');
      return response.success ? response.data : [];
    },
    refetchInterval: 10000 // Refetch every 10 seconds
  });
  
  const { data: confirmedOrders = [], isLoading: confirmedLoading } = useQuery({
    queryKey: ['orders', 'confirmed'],
    queryFn: async () => {
      const response = await ordersAPI.getOrdersByStatus('confirmed');
      return response.success ? response.data : [];
    },
    refetchInterval: 10000
  });
  
  const { data: preparingOrders = [], isLoading: preparingLoading } = useQuery({
    queryKey: ['orders', 'preparing'],
    queryFn: async () => {
      const response = await ordersAPI.getOrdersByStatus('preparing');
      return response.success ? response.data : [];
    },
    refetchInterval: 10000
  });
  
  const { data: readyOrders = [], isLoading: readyLoading } = useQuery({
    queryKey: ['orders', 'ready'],
    queryFn: async () => {
      const response = await ordersAPI.getOrdersByStatus('ready');
      return response.success ? response.data : [];
    },
    refetchInterval: 10000
  });
  
  // Update order status mutation
  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: Order['status'] }) => {
      return ordersAPI.updateOrder(orderId, status);
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success(`Order status updated to ${variables.status}`);
        // Invalidate relevant queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      } else {
        toast.error(data.message || "Failed to update order status");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred while updating order");
    }
  });
  
  const isLoading = pendingLoading || confirmedLoading || preparingLoading || readyLoading;
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <OrderColumn
          title="Pending"
          orders={pendingOrders}
          variant="default"
          onUpdateStatus={(orderId) => updateOrderStatus({ orderId, status: 'confirmed' })}
          nextStatus="confirmed"
          buttonText="Confirm Order"
          isLoading={pendingLoading}
        />
        
        <OrderColumn
          title="Confirmed"
          orders={confirmedOrders}
          variant="orange"
          onUpdateStatus={(orderId) => updateOrderStatus({ orderId, status: 'preparing' })}
          nextStatus="preparing"
          buttonText="Start Preparing"
          isLoading={confirmedLoading}
        />
        
        <OrderColumn
          title="Preparing"
          orders={preparingOrders}
          variant="blue"
          onUpdateStatus={(orderId) => updateOrderStatus({ orderId, status: 'ready' })}
          nextStatus="ready"
          buttonText="Mark as Ready"
          isLoading={preparingLoading}
        />
        
        <OrderColumn
          title="Ready for Service"
          orders={readyOrders}
          variant="green"
          onUpdateStatus={(orderId) => updateOrderStatus({ orderId, status: 'delivered' })}
          nextStatus="delivered"
          buttonText="Mark as Delivered"
          isLoading={readyLoading}
        />
      </div>
    </Layout>
  );
};

export default Kitchen;
