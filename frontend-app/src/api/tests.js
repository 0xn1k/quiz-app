import apiClient from './client';

export const testsAPI = {
  getAll: (params) => apiClient.get('/tests', { params }),
  getById: (id) => apiClient.get(`/tests/${id}`),
  getMyTests: () => apiClient.get('/tests/user/my-tests'),
  create: (data) => apiClient.post('/tests', data),
};
