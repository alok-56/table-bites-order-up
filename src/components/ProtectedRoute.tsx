
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

type Props = {
  children: React.ReactNode;
  allowedRole: 'admin' | 'kitchen';
};

const ProtectedRoute = ({ children, allowedRole }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      if (!token || userRole !== allowedRole) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await authAPI.getCurrentUser();
        if (response.success && response.data) {
          setIsAuthenticated(true);
        } else {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    validateAuth();
  }, [allowedRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${allowedRole}/login`} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
