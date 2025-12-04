import apiClient from './client';

export const authAPI = {
  sendOTP: (mobile) => apiClient.post('/auth/otp', { mobile }),
  verifyOTP: (idToken, name) => apiClient.post('/auth/verify-otp', { idToken, name }),
  googleLogin: (idToken) => apiClient.post('/auth/google', { idToken }),
  getProfile: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};
