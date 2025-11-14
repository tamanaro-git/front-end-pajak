import api from './api';

const authService = {
  // Regular Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Save token and user to localStorage
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('role', response.data.data.user.role);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Auto login after register if token is provided
      if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Google OAuth - Login with ID Token
  googleLogin: async (idToken) => {
    try {
      const response = await api.post('/auth/google/token', { idToken });
      
      // Save token and user to localStorage
      if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Deprecated: Old OAuth flow method
  // Google OAuth - Get Auth URL
  getGoogleAuthUrl: async () => {
    try {
      const response = await api.get('/auth/google');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Handle Google OAuth Callback (if needed)
  handleGoogleCallback: async (code) => {
    try {
      const response = await api.get(`/auth/google/callback?code=${code}`);
      
      // Token should be in URL params from backend redirect
      // This is handled by backend redirect, but we can use this for API-only flow
      if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      return true;
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      throw error.response?.data || { message: error.message };
    }
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },
};

export default authService;