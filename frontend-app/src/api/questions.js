import apiClient from './client';

export const questionsAPI = {
  getAll: (params) => apiClient.get('/questions', { params }),
  getPYQs: (params) => apiClient.get('/questions/pyqs', { params }),
  getDaily: (params) => apiClient.get('/questions/daily', { params }),
  getById: (id) => apiClient.get(`/questions/${id}`),
};
