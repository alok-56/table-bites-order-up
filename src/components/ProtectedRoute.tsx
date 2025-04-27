
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      // Check if token exists
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsChecking(false);
        return;
      }
      
      try {
        // Verify token by getting current user
        const response = await authAPI.getCurrentUser();
        
        if (response.success && response.data) {
          const userRole = response.data.role;
          
          // Check if user has required role
          if (allowedRoles.includes(userRole)) {
            setIsAuthenticated(true);
          } else {
            toast.error("You don't have permission to access this page");
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
          }
        } else {
          // Token invalid or expired
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [allowedRoles]);
  
  if (isChecking) {
    // Show loading state while checking authentication
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Determine which login page to redirect to
    let redirectPath = "/admin/login";
    
    if (allowedRoles.includes("kitchen") && !allowedRoles.includes("admin")) {
      redirectPath = "/kitchen/login";
    }
    
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // If authenticated and has correct role, render children
  return <>{children}</>;
};

export default ProtectedRoute;
