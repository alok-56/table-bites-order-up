
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import AdminLogin from "./pages/auth/AdminLogin";
import KitchenLogin from "./pages/auth/KitchenLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminTables from "./pages/admin/AdminTables";
import AdminOrders from "./pages/admin/AdminOrders";
import CustomerMenu from "./pages/customer/CustomerMenu";
import Cart from "./pages/customer/Cart";
import OrderConfirmation from "./pages/customer/OrderConfirmation";
import Kitchen from "./pages/kitchen/Kitchen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipPrimitive.Provider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/kitchen/login" element={<KitchenLogin />} />
              
              {/* Customer routes */}
              <Route path="/table/:tableId" element={<CustomerMenu />} />
              <Route path="/table/:tableId/cart" element={<Cart />} />
              <Route path="/table/:tableId/confirmation" element={<OrderConfirmation />} />
              
              {/* Protected Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/menu" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminMenu />
                </ProtectedRoute>
              } />
              <Route path="/admin/tables" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminTables />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminOrders />
                </ProtectedRoute>
              } />
              
              {/* Protected Kitchen route */}
              <Route path="/kitchen" element={
                <ProtectedRoute allowedRoles={['kitchen', 'admin']}>
                  <Kitchen />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipPrimitive.Provider>
    </QueryClientProvider>
  );
};

export default App;
