import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole, getDashboardPath } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  // Not logged in → landing page
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role → redirect to correct dashboard
  if (user.role !== allowedRole) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
