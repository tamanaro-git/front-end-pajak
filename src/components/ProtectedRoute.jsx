// filepath: /home/zarif/Project/taxmin/front-end/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import authUtils from '../utils/auth';

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and role requirements
 * 
 * @param {React.Component} children - Component to render if authorized
 * @param {string|string[]} allowedRoles - Role(s) allowed to access this route
 * @param {string} redirectTo - Path to redirect if not authorized (default: '/login')
 */
const ProtectedRoute = ({ children, allowedRoles = null, redirectTo = '/login' }) => {
  const isAuthenticated = authUtils.isAuthenticated();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If allowedRoles specified, check if user has required role
  if (allowedRoles) {
    const hasRequiredRole = authUtils.hasRole(allowedRoles);
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page or home
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authorized, render children
  return children;
};

export default ProtectedRoute;