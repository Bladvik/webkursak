// frontend/src/api/axios.js
import axios from 'axios';

const api = axios.create({
  // ДОДАНО /api В КІНЦІ ПОСИЛАННЯ!
  baseURL: 'https://webkursak.onrender.com/api', 
  withCredentials: true, // Дозволяє передачу токенів/куків між доменами
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach the JWT if it exists
api.interceptors.request.use(
  (config) => {
    // We parse the Zustand persist storage to grab the token
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state && state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (err) {
        console.error("Error parsing auth-storage", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;