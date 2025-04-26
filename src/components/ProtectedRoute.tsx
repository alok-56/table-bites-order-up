
import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  allowedRole: 'admin' | 'kitchen';
};

const ProtectedRoute = ({ children, allowedRole }: Props) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token || userRole !== allowedRole) {
    return <Navigate to={`/${allowedRole}/login`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
