import api from './api';

const chapterService = {
  // Get all chapters with pagination and optional filtering
  getAllChapters: async (params = {}) => {
    try {
      const { page = 1, limit = 10, bookId } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(bookId && { bookId: bookId.toString() })
      });
      
      const response = await api.get(`/chapters?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Get chapter by ID with subchapters
  getChapterById: async (id) => {
    try {
      const response = await api.get(`/chapters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Get chapters by book ID
  getChaptersByBook: async (bookId) => {
    try {
      const response = await api.get(`/books/${bookId}/chapters`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Create new chapter (Admin/Manager only)
  createChapter: async (chapterData) => {
    try {
      const response = await api.post('/chapters', chapterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Update chapter (Admin/Manager only)
  updateChapter: async (id, chapterData) => {
    try {
      const response = await api.put(`/chapters/${id}`, chapterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Delete chapter (Admin only)
  deleteChapter: async (id) => {
    try {
      const response = await api.delete(`/chapters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Reorder chapters (drag & drop)
  reorderChapters: async (chapters) => {
    try {
      const response = await api.put('/chapters/reorder', { chapters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },
};

export default chapterService;