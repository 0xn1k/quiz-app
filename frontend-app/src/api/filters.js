import apiClient from './client';

export const filtersAPI = {
  getAll: () => apiClient.get('/filters'),
  getCategories: () => apiClient.get('/filters/categories'),
  getYears: () => apiClient.get('/filters/years'),
  getTags: () => apiClient.get('/filters/tags'),
  getStats: () => apiClient.get('/filters/stats'),
};
