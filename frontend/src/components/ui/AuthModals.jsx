// src/components/ui/AuthModals.jsx
import { useState } from 'react';
import api from '../../api/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';

const ModalWrapper = ({ children, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
    <div className="relative w-full max-w-md p-8 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl">
      <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white">✕</button>
      {children}
    </div>
  </div>
);

export function LoginModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setCredentials = useAuthStore(state => state.setCredentials);
  const { setUi } = useStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setCredentials(data, data.token);
      setUi('loginOpen', false);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <ModalWrapper onClose={() => setUi('loginOpen', false)}>
      <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
      {error && <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-2 rounded">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded transition-colors">Login</button>
      </form>
      <p className="mt-4 text-sm text-neutral-400 text-center">
        Don't have an account? <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => { setUi('loginOpen', false); setUi('registerOpen', true); }}>Register</span>
      </p>
    </ModalWrapper>
  );
}

export function RegisterModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setCredentials = useAuthStore(state => state.setCredentials);
  const { setUi } = useStore();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { email, password });
      setCredentials(data, data.token);
      setUi('registerOpen', false);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <ModalWrapper onClose={() => setUi('registerOpen', false)}>
      <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
      {error && <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-2 rounded">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        <input type="password" placeholder="Password (min 6 chars)" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition-colors">Register</button>
      </form>
    </ModalWrapper>
  );
}