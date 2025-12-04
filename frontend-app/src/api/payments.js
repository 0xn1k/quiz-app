import apiClient from './client';

export const paymentsAPI = {
  createOrder: (data) => apiClient.post('/payments/create', data),
  verifyPayment: (data) => apiClient.post('/payments/verify', data),
  getSubscriptionStatus: () => apiClient.get('/payments/subscription-status'),
};
