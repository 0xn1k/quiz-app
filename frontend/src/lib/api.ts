import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  sendOTP: (mobile: string) => api.post('/auth/otp', { mobile }),
  verifyOTP: (idToken: string, name: string) => api.post('/auth/verify-otp', { idToken, name }),
  googleLogin: (idToken: string) => api.post('/auth/google', { idToken }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const questionAPI = {
  getAll: (params?: any) => api.get('/questions', { params }),
  getPYQs: (params?: any) => api.get('/questions/pyqs', { params }),
  getDaily: (params?: any) => api.get('/questions/daily', { params }),
  getById: (id: string) => api.get(`/questions/${id}`),
  create: (data: any) => api.post('/questions', data),
};

export const testAPI = {
  getAll: (params?: any) => api.get('/tests', { params }),
  getById: (id: string) => api.get(`/tests/${id}`),
  create: (data: any) => api.post('/tests', data),
  getMyTests: () => api.get('/tests/user/my-tests'),
};

export const analyticsAPI = {
  getAll: (params?: any) => api.get('/analytics', { params }),
  submit: (data: any) => api.post('/analytics', data),
  getCategoryStats: () => api.get('/analytics/stats/category'),
  getTrends: (days?: number) => api.get('/analytics/stats/trends', { params: { days } }),
};

export const paymentAPI = {
  createOrder: (data: any) => api.post('/payments/create', data),
  verifyPayment: (data: any) => api.post('/payments/verify', data),
  getSubscriptionStatus: () => api.get('/payments/subscription-status'),
};

export const filterAPI = {
  getAll: () => api.get('/filters'),
  getCategories: () => api.get('/filters/categories'),
  getYears: () => api.get('/filters/years'),
  getTags: () => api.get('/filters/tags'),
  getStats: () => api.get('/filters/stats'),
};

export default api;
