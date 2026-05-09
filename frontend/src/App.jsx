import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/useAuthStore';
import api from './api/axios';

// Імпортуємо всі наші види
import HomeView from './components/ui/HomeView';
import EditorView from './components/ui/EditorView';
import DashboardView from './components/ui/DashboardView';
import AuthView from './components/ui/AuthView';

// ---> ДОДАЙ ІМПОРТ ТВОЄЇ МОДАЛКИ ЗБЕРЕЖЕННЯ <---
// (Якщо твій файл називається інакше, наприклад SaveBuildModal.jsx, зміни назву)
import SaveModal from './components/ui/ConfigModals.jsx'; 

export default function App() {
  const { currentView, ui } = useStore();
  const { setCredentials } = useAuthStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setCredentials(res.data, token);
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(err => {
          console.error('Помилка авторизації', err);
          localStorage.removeItem('token');
        });
    }
  }, [setCredentials]);

  // Екран логіну/реєстрації перекриває все
  if (ui.loginOpen || ui.registerOpen) {
    return <AuthView initialMode={ui.loginOpen ? 'login' : 'register'} />;
  }

  // Звичайний рендер сторінок
  return (
    <>
      {currentView === 'home' && <HomeView />}
      {currentView === 'editor' && <EditorView />}
      {currentView === 'dashboard' && <DashboardView />}
      
      {/* ---> ВІДНОВЛЮЄМО ВІКНО ЗБЕРЕЖЕННЯ <--- */}
      {ui.saveOpen && <SaveModal />}
    </>
  );
}