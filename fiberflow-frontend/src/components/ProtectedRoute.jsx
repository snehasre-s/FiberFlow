import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, allowedRoles }) => {
  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but not authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role.toLowerCase()}-dashboard`} replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;