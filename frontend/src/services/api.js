import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  uploadAvatar: (formData) => api.post('/auth/upload-avatar', formData),
};

export const opportunitiesAPI = {
  getOpportunities: (params) => api.get('/opportunities', { params }),
  getOpportunityById: (id) => api.get(`/opportunities/${id}`),
  triggerParsing: () => api.post('/opportunities/parse'),
};

export default api;