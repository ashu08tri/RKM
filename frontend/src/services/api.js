import axios from 'axios';

const API_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Don't send malformed tokens (like mock tokens)
    if (token && token.startsWith('mock-jwt-token-')) {
      console.error('Invalid token format detected. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(new Error('Invalid token format'));
    }
    
    // Add valid token to header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For file uploads, we need to set the Content-Type to multipart/form-data
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    // Avoid CORS issues with external rocket.new domains
    if (config.url && config.url.includes('builtwithrocket.new')) {
      console.warn('Skipping request to external Rocket domain to avoid CORS issues');
      return Promise.reject(new Error('Request blocked to prevent CORS issues'));
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle auth errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Avoid redirect loops
      if (!originalRequest._retry && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Ignore errors from rocket.new domains (they're expected due to CORS)
    if (originalRequest?.url?.includes('builtwithrocket.new')) {
      console.log('Ignoring expected CORS error from Rocket domain');
      return Promise.resolve({ data: { status: 'ok' } }); 
    }
    
    return Promise.reject(error);
  }
);

export default api;
