// api.js - Axios instance with base URL and JWT token injection
import axios from 'axios';

 const api = axios.create({
  baseURL: 'https://garbage-management-backend-production.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Interceptor: handle 401 Unauthorized (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
