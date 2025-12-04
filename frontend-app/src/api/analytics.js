import apiClient from './client';

export const analyticsAPI = {
  getAll: (params) => apiClient.get('/analytics', { params }),
  submit: (data) => apiClient.post('/analytics', data),
  getCategoryStats: () => apiClient.get('/analytics/stats/category'),
  getTrends: (params) => apiClient.get('/analytics/stats/trends', { params }),
};
