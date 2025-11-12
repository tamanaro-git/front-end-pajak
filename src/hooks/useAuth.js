// filepath: /home/zarif/Project/taxmin/front-end/src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import authUtils from '../utils/auth';

/**
 * Custom hook for authentication
 * Usage: const { user, isAuthenticated, hasRole, login, logout } = useAuth();
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    const userData = authUtils.getUser();
    const isAuth = authUtils.isAuthenticated();
    
    setUser(userData);
    setIsAuthenticated(isAuth);
  }, []);

  /**
   * Login user and save to localStorage
   * @param {Object} userData - User data from API (must include token and role)
   */
  const login = (userData) => {
    authUtils.setUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Logout user and clear localStorage
   */
  const logout = () => {
    authUtils.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Check if user has required role(s)
   * @param {string|string[]} allowedRoles - Role or array of roles
   * @returns {boolean}
   */
  const hasRole = (allowedRoles) => {
    return authUtils.hasRole(allowedRoles);
  };

  /**
   * Get user role
   * @returns {string|null}
   */
  const getRole = () => {
    return authUtils.getRole();
  };

  return {
    user,
    isAuthenticated,
    hasRole,
    getRole,
    login,
    logout
  };
};

export default useAuth;