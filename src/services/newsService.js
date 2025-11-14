// src/services/newsService.js
import api from './api';

const newsService = {
  // Get all news with pagination and filters
  getAllNews: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.kategori) queryParams.append('kategori', params.kategori);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const url = `/news${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get news by ID
  getNewsById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  // Get news by artikel ID (increments view)
  getNewsByArtikelId: async (artikelId) => {
    const response = await api.get(`/news/artikel/${artikelId}`);
    return response.data;
  },

  // Create news
  createNews: async (newsData) => {
    const response = await api.post('/news', newsData);
    return response.data;
  },

  // Update news
  updateNews: async (id, newsData) => {
    const response = await api.put(`/news/${id}`, newsData);
    return response.data;
  },

  // Update news status (approve/reject workflow)
  updateNewsStatus: async (id, status) => {
    const response = await api.put(`/news/${id}/status`, { status });
    return response.data;
  },

  // Delete news
  deleteNews: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  }
};

export default newsService;