// frontend/src/components/ui/AuthView.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../api/axios';
import { 
  Mail, Lock, User, Cpu, AlertCircle, Loader2, 
  Globe, ChevronDown, CheckSquare, XCircle, Eye, EyeOff, KeyRound 
} from 'lucide-react';

const authTranslations = {
  en: {
    back: "Go Back", login_title: "Welcome Back.", register_title: "Start Building.",
    login_desc: "Log in to continue working.", register_desc: "Follow the steps to create your account.",
    or_email: "Or via email", nickname: "Nickname", email: "Email Address", email_or_nick: "Email or Nickname", password: "Password", code: "6-digit Code",
    btn_login: "Sign In", btn_send_code: "Send Code", btn_verify: "Verify Code", btn_register: "Create Account",
    resend_code: "Resend Code", resend_in: "Resend in",
    no_acc: "Don't have an account?", have_acc: "Already have an account?",
    link_reg: "Register", link_login: "Login", social_login: "Or continue with"
  },
  uk: {
    back: "Повернутися", login_title: "З ПОВЕРНЕННЯМ.", register_title: "ПОЧНИ БУДУВАТИ.",
    login_desc: "Увійди, щоб продовжити роботу.", register_desc: "Пройди кроки, щоб створити акаунт.",
    or_email: "АБО ЧЕРЕЗ EMAIL", nickname: "Унікальний Нікнейм", email: "Електронна пошта", email_or_nick: "Email або Нікнейм", password: "Складний пароль", code: "Код з пошти",
    btn_login: "УВІЙТИ В СИСТЕМУ", btn_send_code: "НАДІСЛАТИ КОД", btn_verify: "ПІДТВЕРДИТИ КОД", btn_register: "СТВОРИТИ АКАУНТ",
    resend_code: "Надіслати знову", resend_in: "Через",
    no_acc: "Ще не маєш акаунта?", have_acc: "Вже маєш акаунт?",
    link_reg: "ЗАРЕЄСТРУВАТИСЯ", link_login: "УВІЙТИ", social_login: "Або увійдіть через"
  },
  it: {
    back: "Indietro", login_title: "BENTORNATO.", register_title: "INIZIA A COSTRUIRE.",
    login_desc: "Accedi per continuare a lavorare.", register_desc: "Segui i passaggi per creare il tuo account.",
    or_email: "O TRAMITE EMAIL", nickname: "Nickname", email: "Indirizzo Email", email_or_nick: "Email o Nickname", password: "Password", code: "Codice a 6 cifre",
    btn_login: "ACCEDI", btn_send_code: "Invia Codice", btn_verify: "Verifica Codice", btn_register: "CREA ACCOUNT",
    resend_code: "Invia di nuovo", resend_in: "Riprova tra",
    no_acc: "Non hai un account?", have_acc: "Hai già un account?",
    link_reg: "REGISTRATI", link_login: "ACCEDI", social_login: "O continua con"
  },
  pl: {
    back: "Wróć", login_title: "WITAJ PONOWNIE.", register_title: "ZACZNIJ BUDOWAĆ.",
    login_desc: "Zaloguj się, aby kontynuować pracę.", register_desc: "Postępuj zgodnie z instrukcjami, aby utworzyć konto.",
    or_email: "LUB PRZEZ EMAIL", nickname: "Pseudonim", email: "Adres Email", email_or_nick: "Email lub Pseudonim", password: "Hasło", code: "6-cyfrowy kod",
    btn_login: "ZALOGUJ SIĘ", btn_send_code: "Wyślij kod", btn_verify: "Zweryfikuj kod", btn_register: "STWÓRZ KONTO",
    resend_code: "Wyślij ponownie", resend_in: "Wyślij za",
    no_acc: "Nie masz konta?", have_acc: "Masz już konto?",
    link_reg: "ZAREJESTRUJ SIĘ", link_login: "ZALOGUJ SIĘ", social_login: "Lub kontynuuj przez"
  },
  es: {
    back: "Volver", login_title: "BIENVENIDO.", register_title: "EMPIEZA A CONSTRUIR.",
    login_desc: "Inicia sesión para continuar.", register_desc: "Sigue los pasos para crear tu cuenta.",
    or_email: "O POR EMAIL", nickname: "Apodo", email: "Correo electrónico", email_or_nick: "Email o Apodo", password: "Contraseña", code: "Código de 6 dígitos",
    btn_login: "ENTRAR", btn_send_code: "Enviar código", btn_verify: "Verificar código", btn_register: "CREAR CUENTA",
    resend_code: "Reenviar código", resend_in: "Reenviar en",
    no_acc: "¿No tienes cuenta?", have_acc: "¿Ya tienes cuenta?",
    link_reg: "REGÍSTRATE", link_login: "ENTRAR", social_login: "O continuar con"
  },
  fr: {
    back: "Retour", login_title: "BON RETOUR.", register_title: "COMMENCER À BÂTIR.",
    login_desc: "Connectez-vous pour continuer.", register_desc: "Suivez les étapes pour créer votre compte.",
    or_email: "OU PAR EMAIL", nickname: "Pseudo", email: "Adresse email", email_or_nick: "Email ou Pseudo", password: "Mot de passe", code: "Code à 6 chiffres",
    btn_login: "SE CONNECTER", btn_send_code: "Envoyer le code", btn_verify: "Vérifier le code", btn_register: "CRÉER UN COMPTE",
    resend_code: "Renvoyer le code", resend_in: "Renvoyer dans",
    no_acc: "Pas de compte ?", have_acc: "Déjà un compte ?",
    link_reg: "S'INSCRIRE", link_login: "SE CONNECTER", social_login: "Ou continuer avec"
  },
  de: {
    back: "Zurück", login_title: "WILLKOMMEN ZURÜCK.", register_title: "FANG AN ZU BAUEN.",
    login_desc: "Anmelden, um fortzufahren.", register_desc: "Befolgen Sie die Schritte, um ein Konto zu erstellen.",
    or_email: "ODER PER E-MAIL", nickname: "Spitzname", email: "E-Mail-Adresse", email_or_nick: "E-Mail oder Spitzname", password: "Passwort", code: "6-stelliger Code",
    btn_login: "ANMELDEN", btn_send_code: "Code senden", btn_verify: "Code überprüfen", btn_register: "KONTO ERSTELLEN",
    resend_code: "Code erneut senden", resend_in: "Erneut senden in",
    no_acc: "Kein Konto?", have_acc: "Bereits ein Konto?",
    link_reg: "REGISTRIEREN", link_login: "ANMELDEN", social_login: "Oder weiter mit"
  }
};

export default function AuthView({ initialMode = 'login' }) {
  const { setUi, setCurrentView, language, setLanguage } = useStore();
  const { login, register, error: authError, clearError } = useAuthStore();
  
  const [mode, setMode] = useState(initialMode);
  // Кроки реєстрації: 1 - Email, 2 - Код, 3 - Деталі
  const [regStep, setRegStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', code: '' });
  const [localError, setLocalError] = useState(null);

  // ЗАПОБІЖНИК: Якщо в іншій мові немає слова, беремо англійське (щоб не було UNDEFINED)
  const t = { ...authTranslations['en'], ...(authTranslations[language] || {}) };
  const errorToDisplay = localError || authError;

  // Таймер для повторної відправки коду
  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => { 
    if (typeof clearError === 'function') clearError(); 
    setLocalError(null);
    setRegStep(1); 
    setFormData({ name: '', email: '', password: '', code: '' });
  }, [mode, clearError]);

  const handleClose = () => { setUi('loginOpen', false); setUi('registerOpen', false); };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Валідація пароля (мінімум 8 символів)
  const validatePassword = (pass) => {
    if (pass.length < 8) return language === 'uk' ? "Пароль має містити мінімум 8 символів." : "Password must be at least 8 characters.";
    return null;
  };

  // КРОК 1: Відправка коду
  const handleSendCode = async (e) => {
    e?.preventDefault();
    if (!formData.email) return setLocalError(language === 'uk' ? "Введіть email." : "Please enter email.");
    setLoading(true); setLocalError(null);
    try {
      await api.post('/auth/send-otp', { email: formData.email });
      setRegStep(2);
      setTimer(60); // Блокуємо повторну відправку на 60 сек
    } catch (err) {
      setLocalError(err.response?.data?.message || "Помилка відправки коду");
    } finally { setLoading(false); }
  };

  // КРОК 2: Перевірка коду
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!formData.code) return setLocalError(language === 'uk' ? "Введіть код." : "Please enter code.");
    setLoading(true); setLocalError(null);
    try {
      await api.post('/auth/verify-otp', { email: formData.email, code: formData.code });
      setRegStep(3); // Код вірний, йдемо вводити пароль
    } catch (err) {
      setLocalError(err.response?.data?.message || "Невірний код");
    } finally { setLoading(false); }
  };

  // КРОК 3: Логін або Фінальна Реєстрація
  const handleSubmitFinal = async (e) => {
    e.preventDefault();
    setLoading(true); setLocalError(null);
    try {
      if (mode === 'login') {
        // Відправляємо поле "email", але бекенд знає, що це може бути і нікнейм
        await login(formData.email, formData.password);
      } else {
        const passErr = validatePassword(formData.password);
        if (passErr) { setLoading(false); return setLocalError(passErr); }
        await register(formData.name, formData.email, formData.password, formData.code);
      }
      handleClose();
      setCurrentView('dashboard');
    } catch (err) {
      setLocalError(err.response?.data?.message || "Помилка сервера");
    } finally { setLoading(false); }
  };

const handleOAuth = (provider) => { 
  window.location.href = `https://webkursak.onrender.com/api/auth/${provider.toLowerCase()}`; 
};
  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'uk', label: 'Українська' },
    { code: 'it', label: 'Italiano' },
    { code: 'pl', label: 'Polski' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex w-full h-screen bg-[#09090b] text-neutral-300 font-sans">
      <div className="w-full lg:w-1/2 flex flex-col relative overflow-y-auto">
        
        {/* ХЕДЕР */}
        <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-center">
          <button onClick={handleClose} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
            <XCircle className="w-4 h-4" /> {t.back}
          </button>
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 hover:border-neutral-600 rounded bg-neutral-900/50 text-[10px] font-black text-white transition-all">
              <Globe className="w-3.5 h-3.5 text-blue-500" /> {language.toUpperCase()} <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full right-0 mt-2 w-36 bg-neutral-900 border border-neutral-800 rounded shadow-2xl overflow-hidden z-50">
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { setLanguage(l.code); setLangOpen(false); }} className={`w-full text-left px-4 py-2.5 text-[10px] font-bold transition-colors ${language === l.code ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24">
          <div className="w-full max-w-md">
            
            <div className="flex flex-row items-center justify-center gap-3 mb-12 mt-10">
              <div className="p-2.5 bg-blue-600/10 border border-blue-500/30 rounded-xl">
                <Cpu className="w-8 h-8 text-blue-500" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase text-white">
                PCWITH<span className="text-blue-500">BLADVIK</span>
              </span>
            </div>

            <div className="mb-8 text-center">
              <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">
                {mode === 'login' ? t.login_title : t.register_title}
              </h1>
              <p className="text-neutral-500 text-sm">{mode === 'login' ? t.login_desc : t.register_desc}</p>
            </div>

            {/* OAUTH КНОПКИ (Тільки Google та GitHub) */}
            {mode === 'login' && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button onClick={() => handleOAuth('Google')} className="flex items-center justify-center gap-2.5 p-3 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white text-neutral-400 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-[0.98]">
                   <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                   Google
                </button>
                <button onClick={() => handleOAuth('GitHub')} className="flex items-center justify-center gap-2.5 p-3 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white text-neutral-400 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-[0.98]">
                   <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                   GitHub
                </button>
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-neutral-800"></div>
              <span className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest">{t.or_email}</span>
              <div className="flex-1 h-px bg-neutral-800"></div>
            </div>

            {errorToDisplay && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-500">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-xs font-bold">{errorToDisplay}</p>
              </div>
            )}

            {/* ДИНАМІЧНА ФОРМА */}
            <form onSubmit={
              mode === 'login' ? handleSubmitFinal :
              (regStep === 1 ? handleSendCode : (regStep === 2 ? handleVerifyCode : handleSubmitFinal))
            } className="space-y-4">
              
              {/* ПОЛЕ EMAIL / НІКНЕЙМ */}
              {(mode === 'login' || regStep >= 1) && (
                <div className="relative">
                  {/* ФІКС ІКОНОК: pl-12 на input вирішує проблему накладання */}
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500"><Mail className="w-5 h-5" /></div>
                  <input type="text" name="email" autoComplete="off" value={formData.email} onChange={handleChange} disabled={mode === 'register' && regStep > 1} required className="w-full bg-[#09090b] border border-neutral-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-neutral-600 focus:border-blue-500 outline-none transition-all disabled:opacity-50 shadow-inner" placeholder={mode === 'login' ? t.email_or_nick : t.email} />
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* КРОК 2: Ввід коду */}
                {mode === 'register' && regStep === 2 && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-blue-500"><KeyRound className="w-5 h-5" /></div>
                      <input type="text" name="code" autoComplete="off" value={formData.code} onChange={handleChange} required className="w-full bg-blue-500/5 border border-blue-500/30 rounded-xl py-3.5 pl-12 pr-4 text-sm text-blue-100 placeholder-blue-500/50 focus:border-blue-500 outline-none transition-all tracking-widest font-mono" placeholder={t.code} />
                    </div>
                    <div className="text-right">
                      <button type="button" onClick={handleSendCode} disabled={timer > 0 || loading} className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-blue-500 disabled:opacity-50 transition-colors">
                        {timer > 0 ? `${t.resend_in} ${timer}s` : t.resend_code}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* КРОК 3: Пароль і Нікнейм (Логін показує тільки пароль) */}
                {(mode === 'login' || (mode === 'register' && regStep === 3)) && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    
                    {mode === 'register' && (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500"><User className="w-5 h-5" /></div>
                        <input type="text" name="name" autoComplete="off" value={formData.name} onChange={handleChange} required className="w-full bg-[#09090b] border border-neutral-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-neutral-600 focus:border-blue-500 outline-none transition-all shadow-inner" placeholder={t.nickname} />
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500"><Lock className="w-5 h-5" /></div>
                      {/* ВИМКНЕННЯ АВТОЗАПОВНЕННЯ autoComplete="new-password" */}
                      <input type={showPassword ? "text" : "password"} name="password" autoComplete="new-password" value={formData.password} onChange={handleChange} required className="w-full bg-[#09090b] border border-neutral-800 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-neutral-600 focus:border-blue-500 outline-none transition-all shadow-inner" placeholder={t.password} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-neutral-500 hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {/* ДИНАМІЧНА КНОПКА САБМІТУ */}
              <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex justify-center items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                  (mode === 'login' ? t.btn_login : 
                  (regStep === 1 ? t.btn_send_code : 
                  (regStep === 2 ? t.btn_verify : t.btn_register)))
                }
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-neutral-500 text-xs">
                {mode === 'login' ? t.no_acc : t.have_acc}{" "}
                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-blue-500 font-bold hover:text-blue-400 transition-colors uppercase tracking-wider ml-1">
                  {mode === 'login' ? t.link_reg : t.link_login}
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ПРАВА ЧАСТИНА - КАРТИНКА */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10" />
        <img src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80" alt="PC Build" className="w-full h-full object-cover opacity-60" />
      </div>
    </div>
  );
}