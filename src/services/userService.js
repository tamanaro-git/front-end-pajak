// filepath: /home/zarif/Project/taxmin/front-end/src/services/userService.js
import api from './api';

const userService = {
  // Get all users (admin only)
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Update user profile
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      
      // Update localStorage if updating current user
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser && currentUser.id === id) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Delete user (admin only)
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/users/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await api.post('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser) {
        currentUser.profilePicture = response.data.data.profilePicture;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },
};

export default userService;