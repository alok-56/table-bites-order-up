
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ordersAPI } from "@/lib/api";
import { Order } from "@/lib/types";
import { toast } from "sonner";
import { useState } from "react";

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const { 
    data: orders = [], 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await ordersAPI.getAllOrders();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    }
  });
  
  const { mutate: updateOrderStatus, isPending } = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: Order['status'] }) => {
      return ordersAPI.updateOrder(orderId, status);
    },
    onSuccess: () => {
      toast.success("Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update order status");
    }
  });
  
  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus({ orderId, status });
  };
  
  // Format the date/time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Toggle order details
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  
  // Get status badge color
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'confirmed':
        return 'bg-orange-100 text-orange-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (error) {
    return (
      <AdminLayout title="Order Management">
        <div className="text-center py-8">
          <p className="text-red-500">Error loading orders. Please try again.</p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Order Management">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <>
                    <TableRow key={order.id} className="cursor-pointer" onClick={() => toggleOrderDetails(order.id)}>
                      <TableCell className="font-medium">{order.id.slice(-6)}</TableCell>
                      <TableCell>#{order.tableNumber}</TableCell>
                      <TableCell>
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select 
                          defaultValue={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                          disabled={isPending}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                    
                    {/* Order details row */}
                    {expandedOrder === order.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-gray-50 p-4">
                          <div className="text-sm">
                            <h4 className="font-medium mb-2">Order Items</h4>
                            <ul className="space-y-2">
                              {order.items.map((item, index) => (
                                <li key={index} className="flex justify-between border-b pb-2">
                                  <div>
                                    <span className="font-medium">{item.name}</span>
                                    {item.specialInstructions && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        Note: {item.specialInstructions}
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    <span>${item.price.toFixed(2)} × {item.quantity}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            {order.notes && (
                              <div className="mt-4">
                                <h4 className="font-medium">Order Notes:</h4>
                                <p className="text-gray-600">{order.notes}</p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
