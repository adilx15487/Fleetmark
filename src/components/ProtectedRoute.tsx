import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole, getDashboardPath } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  // Not logged in → landing page
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but role not in allowed list → redirect to correct dashboard
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
