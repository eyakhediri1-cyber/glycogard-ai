import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Blood Sugar endpoints
export const bloodSugarAPI = {
  addRecord: (data) => api.post('/blood-sugar/add', data),
  getRecords: (days = 30) => api.get(`/blood-sugar/records?days=${days}`),
  getStats: (days = 30) => api.get(`/blood-sugar/stats?days=${days}`),
};

// Medication endpoints
export const medicationAPI = {
  addMedication: (data) => api.post('/medications/add', data),
  getMedications: () => api.get('/medications/list'),
  updateMedication: (id, data) => api.put(`/medications/${id}`, data),
  deleteMedication: (id) => api.delete(`/medications/${id}`),
};

// Nutrition endpoints
export const nutritionAPI = {
  addLog: (data) => api.post('/nutrition/add', data),
  getLogs: (logDate) => api.get('/nutrition/logs', { params: { logDate } }),
  getStats: (days = 30) => api.get(`/nutrition/stats?days=${days}`),
  searchFood: (query) => axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1`),
};

// Mental Health endpoints
export const mentalHealthAPI = {
  addLog: (data) => api.post('/mental-health/add', data),
  getLogs: (days = 30) => api.get(`/mental-health/logs?days=${days}`),
  getStats: (days = 30) => api.get(`/mental-health/stats?days=${days}`),
};

// Risk Assessment endpoints
export const riskAssessmentAPI = {
  assess: () => api.post('/risk-assessment/assess'),
  getAssessments: () => api.get('/risk-assessment/assessments'),
  getInsights: () => api.get('/risk-assessment/insights'),
};

// AI Companion endpoints
export const aiCompanionAPI = {
  sendMessage: (message) => api.post('/ai-companion/message', { message }),
  getChatHistory: (limit = 20) => api.get(`/ai-companion/history?limit=${limit}`),
};

export default api;
