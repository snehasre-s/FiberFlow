import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, allowedRoles }) => {
  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // User doesn't have permission - redirect to their dashboard
      const roleRoutes = {
        'Admin': '/admin-dashboard',
        'Planner': '/planner-dashboard',
        'Technician': '/technician-dashboard',
        'SupportAgent': '/support-dashboard',
        'FieldEngineer': '/field-engineer-dashboard',
        'DeploymentLead': '/deployment-lead-dashboard'
      };
      return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
    }
  }

  // User is authorized
  return children;
};

export default ProtectedRoute;