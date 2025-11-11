import api from './api';

const subchapterService = {
  // Get all subchapters with pagination and optional filtering
  getAllSubchapters: async (params = {}) => {
    try {
      const { page = 1, limit = 10, chapterId } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(chapterId && { chapterId: chapterId.toString() })
      });
      
      const response = await api.get(`/subchapters?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Get subchapter by ID
  getSubchapterById: async (id) => {
    try {
      const response = await api.get(`/subchapters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Get subchapters by chapter ID
  getSubchaptersByChapter: async (chapterId) => {
    try {
      const response = await api.get(`/chapters/${chapterId}/subchapters`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Create new subchapter (Admin/Manager only)
  createSubchapter: async (subchapterData) => {
    try {
      const response = await api.post('/subchapters', subchapterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Update subchapter (Admin/Manager only)
  updateSubchapter: async (id, subchapterData) => {
    try {
      const response = await api.put(`/subchapters/${id}`, subchapterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Delete subchapter (Admin only)
  deleteSubchapter: async (id) => {
    try {
      const response = await api.delete(`/subchapters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Reorder subchapters (drag & drop)
  reorderSubchapters: async (subchapters) => {
    try {
      const response = await api.put('/subchapters/reorder', { subchapters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },
};

export default subchapterService;