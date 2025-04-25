
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orders, tables } from "@/lib/sample-data";
import { ShoppingCart, Table as TableIcon, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // Calculate stats
  const activeOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing'].includes(order.status)).length;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const occupiedTables = tables.filter(table => table.status === 'occupied').length;
  
  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
            <p className="text-xs text-gray-500">orders in progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tables Occupied</CardTitle>
            <TableIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupiedTables} / {tables.length}</div>
            <p className="text-xs text-gray-500">tables currently in use</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500">from {orders.length} orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Orders Completed</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-gray-500">orders delivered today</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.length > 0 ? (
                <>
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">Table #{order.tableNumber}</p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} items • ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-orange-100 text-orange-800' :
                          order.status === 'ready' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-4">
                    <Link to="/admin/orders">
                      <Button variant="outline" size="sm">
                        View All Orders
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Table Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tables.map((table) => (
                <div 
                  key={table.id}
                  className={`p-4 rounded-lg border-2 text-center ${
                    table.status === 'occupied' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-green-500 bg-green-50'
                  }`}
                >
                  <p className="font-medium text-lg">#{table.number}</p>
                  <p className="text-xs">
                    {table.status === 'occupied' ? 'Occupied' : 'Available'}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="/admin/tables">
                <Button variant="outline" size="sm">
                  Manage Tables
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
