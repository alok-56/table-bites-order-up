
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

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
              
              {/* Protected routes - these should check for auth */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/menu" element={<AdminMenu />} />
              <Route path="/admin/tables" element={<AdminTables />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              
              {/* Kitchen route */}
              <Route path="/kitchen" element={<Kitchen />} />
              
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
