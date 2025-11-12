// filepath: /home/zarif/Project/taxmin/front-end/src/utils/auth.js
// Auth utility functions for managing authentication state

export const authUtils = {
  // Store user data in localStorage
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', user.token);
    localStorage.setItem('role', user.role);
  },

  // Get user data from localStorage
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get user role
  getRole: () => {
    return localStorage.getItem('role');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Check if user has required role(s)
  hasRole: (allowedRoles) => {
    const userRole = localStorage.getItem('role');
    if (!userRole) return false;
    
    // If allowedRoles is array, check if user role is in array
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(userRole);
    }
    
    // If allowedRoles is string, check exact match
    return userRole === allowedRoles;
  },

  // Logout - clear all auth data
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  },

  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
};

export default authUtils;