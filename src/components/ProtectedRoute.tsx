import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole, getDashboardPath } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, needsRoleSelection } = useAuth();

  // Not logged in → landing page
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // 42 user hasn't picked a role yet → role selection
  if (needsRoleSelection) {
    return <Navigate to="/auth/role-select" replace />;
  }

  // Logged in but wrong role → redirect to correct dashboard
  if (user.role !== allowedRole) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
