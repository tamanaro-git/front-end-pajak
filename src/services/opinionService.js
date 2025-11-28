// filepath: /home/zarif/Project/taxmin/front-end/src/services/opinionService.js
import api from './api';

const opinionService = {
  // Get all opinions with pagination and filters
  getAllOpinions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.kategori) queryParams.append('kategori', params.kategori);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const url = `/opinions${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get opinions by user ID with pagination and filters
  getOpinionsByUser: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.kategori) queryParams.append('kategori', params.kategori);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const url = `/opinions/user/${userId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get opinion by ID
  getOpinionById: async (id) => {
    const response = await api.get(`/opinions/${id}`);
    return response.data;
  },

  // Create opinion
  createOpinion: async (opinionData) => {
    const response = await api.post('/opinions', opinionData);
    return response.data;
  },

  // Update opinion
  updateOpinion: async (id, opinionData) => {
    const response = await api.put(`/opinions/${id}`, opinionData);
    return response.data;
  },
  
  // Update opinion status
  updateOpinionStatus: async (id, status) => {
    const response = await api.put(`/opinions/${id}/status`, { status });
    return response.data;
  },

  // Delete opinion
  deleteOpinion: async (id) => {
    const response = await api.delete(`/opinions/${id}`);
    return response.data;
  },

  // Increment views
  incrementViews: async (id) => {
    const response = await api.post(`/opinions/${id}/views`);
    return response.data;
  },

  // Increment likes
  incrementLikes: async (id) => {
    const response = await api.post(`/opinions/${id}/likes`);
    return response.data;
  },

  // Increment shares
  incrementShares: async (id) => {
    const response = await api.post(`/opinions/${id}/shares`);
    return response.data;
  }
};

export default opinionService;