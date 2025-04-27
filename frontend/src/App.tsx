
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
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
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
              
              {/* Protected admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/menu" element={
                <ProtectedRoute allowedRole="admin">
                  <AdminMenu />
                </ProtectedRoute>
              } />
              <Route path="/admin/tables" element={
                <ProtectedRoute allowedRole="admin">
                  <AdminTables />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute allowedRole="admin">
                  <AdminOrders />
                </ProtectedRoute>
              } />
              
              {/* Protected kitchen route */}
              <Route path="/kitchen" element={
                <ProtectedRoute allowedRole="kitchen">
                  <Kitchen />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
