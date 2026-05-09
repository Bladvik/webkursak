import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      loading: false, // Додали стан loading

      // Очищення помилок
      clearError: () => set({ error: null }),

      // Встановлення даних вручну
      setCredentials: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        error: null
      }),

      // Вихід з акаунту
      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      // --- ЛОГІКА ЛОГІНУ ---
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }

          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            loading: false
          });
        } catch (err) {
          set({ 
            error: err.response?.data?.message || 'Помилка входу. Перевірте дані.',
            loading: false
          });
          throw err;
        }
      },

      // --- ЛОГІКА РЕЄСТРАЦІЇ (З КОДОМ) ---
      register: async (name, email, password, code) => {
        set({ loading: true, error: null });
        try {
          // Відправляємо код разом з іншими даними
          const res = await api.post('/auth/register', { name, email, password, code }); 
          
          if (res.data.token) {
            localStorage.setItem('token', res.data.token);
          }

          set({ 
            user: res.data, 
            token: res.data.token, 
            isAuthenticated: true, 
            loading: false 
          });
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Помилка реєстрації. Можливо, невірний код.', 
            loading: false 
          });
          throw error;
        }
      }

    }),
    {
      name: 'auth-storage', // Ключ для збереження в LocalStorage
    }
  )
);