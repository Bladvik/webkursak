// frontend/src/components/ui/DashboardView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { useStore, OFFICIAL_BLUEPRINTS } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';

import { 
  Cpu, Globe, Sun, Moon, Plus, Edit2, Copy, 
  Trash2, Award, Image as ImageIcon, AlertTriangle, LogOut, Lock, User, Crown
} from 'lucide-react';

const t = (key, lang) => {
  const dicts = {
    en: { 
      title: "Engineering Workbench", subtitle: "Manage, analyze, and render your saved hardware blueprints.",
      confirm_del: "Confirm Deletion?", del_warning: "This blueprint will be permanently erased.", cancel: "Cancel", delete: "Delete Rig",
      btn_create: "Initialize New Build", btn_create_sub: "Start from a clean slate", nav_pro: "Upgrade to Pro", nav_elite: "Upgrade to Elite",
      login: "Login", btn_locked: "Login to Create", btn_locked_sub: "Unlock full configurator",
      plan: "Plan", used_saves: "Saves Used", limit_reached: "Limit Reached", upgrade_plan: "Upgrade Plan"
    },
    uk: { 
      title: "Інженерна Майстерня", subtitle: "Керуйте, аналізуйте та рендеріть ваші збережені креслення.",
      confirm_del: "Підтвердити видалення?", del_warning: "Цю збірку буде видалено назавжди.", cancel: "Скасувати", delete: "Видалити",
      btn_create: "Створити Нову", btn_create_sub: "З чистого аркуша", nav_pro: "Отримати Pro", nav_elite: "Отримати Elite",
      login: "Увійти", btn_locked: "Увійдіть для створення", btn_locked_sub: "Розблокувати конфігуратор",
      plan: "План", used_saves: "Використано збережень", limit_reached: "Ліміт вичерпано", upgrade_plan: "Оновити підписку"
    },
    it: {
      title: "Laboratorio d'Ingegneria", subtitle: "Gestisci, analizza e renderizza i tuoi progetti hardware.",
      confirm_del: "Confermare Eliminazione?", del_warning: "Questo progetto verrà cancellato in modo permanente.", cancel: "Annulla", delete: "Elimina Setup",
      btn_create: "Inizia Nuovo", btn_create_sub: "Inizia da zero", nav_pro: "Passa a Pro", nav_elite: "Passa a Elite",
      login: "Accedi", btn_locked: "Accedi per creare", btn_locked_sub: "Sblocca configuratore",
      plan: "Piano", used_saves: "Salvataggi Usati", limit_reached: "Limite Raggiunto", upgrade_plan: "Aggiorna Piano"
    },
    pl: {
      title: "Warsztat Inżynieryjny", subtitle: "Zarządzaj i analizuj swoje zapisane projekty hardware'owe.",
      confirm_del: "Potwierdź Usunięcie?", del_warning: "Ten projekt zostanie trwale usunięty.", cancel: "Anuluj", delete: "Usuń Zestaw",
      btn_create: "Zacznij Nowy", btn_create_sub: "Zacznij od zera", nav_pro: "Ulepsz do Pro", nav_elite: "Ulepsz do Elite",
      login: "Zaloguj", btn_locked: "Zaloguj by tworzyć", btn_locked_sub: "Odblokuj konfigurator",
      plan: "Plan", used_saves: "Użyte Zapisy", limit_reached: "Osiągnięto Limit", upgrade_plan: "Ulepsz Plan"
    },
    es: {
      title: "Taller de Ingeniería", subtitle: "Gestiona, analiza y renderiza tus diseños guardados.",
      confirm_del: "¿Confirmar Eliminación?", del_warning: "Este diseño se borrará permanentemente.", cancel: "Cancelar", delete: "Eliminar PC",
      btn_create: "Iniciar Nuevo", btn_create_sub: "Empezar desde cero", nav_pro: "Mejorar a Pro", nav_elite: "Mejorar a Elite",
      login: "Entrar", btn_locked: "Entra para crear", btn_locked_sub: "Desbloquea el configurador",
      plan: "Plan", used_saves: "Guardados Usados", limit_reached: "Límite Alcanzado", upgrade_plan: "Mejorar Plan"
    },
    fr: {
      title: "Atelier d'Ingénierie", subtitle: "Gérez, analysez et rendez vos plans matériels sauvegardés.",
      confirm_del: "Confirmer la Suppression?", del_warning: "Ce plan sera définitivement effacé.", cancel: "Annuler", delete: "Supprimer",
      btn_create: "Nouveau Projet", btn_create_sub: "Partir de zéro", nav_pro: "Passer à Pro", nav_elite: "Passer à Elite",
      login: "Connexion", btn_locked: "Connectez-vous", btn_locked_sub: "Débloquer le configurateur",
      plan: "Forfait", used_saves: "Sauvegardes Utilisées", limit_reached: "Limite Atteinte", upgrade_plan: "Améliorer le Forfait"
    },
    de: {
      title: "Ingenieur-Werkstatt", subtitle: "Verwalten und analysieren Sie Ihre gespeicherten Hardware-Baupläne.",
      confirm_del: "Löschen Bestätigen?", del_warning: "Dieser Bauplan wird dauerhaft gelöscht.", cancel: "Abbrechen", delete: "Löschen",
      btn_create: "Neues Projekt", btn_create_sub: "Ganz von vorn anfangen", nav_pro: "Auf Pro upgraden", nav_elite: "Auf Elite upgraden",
      login: "Anmelden", btn_locked: "Zum Erstellen anmelden", btn_locked_sub: "Konfigurator freischalten",
      plan: "Tarif", used_saves: "Speicherungen", limit_reached: "Limit Erreicht", upgrade_plan: "Tarif Upgraden"
    }
  };
  return dicts[lang]?.[key] || dicts['en'][key] || key;
};

function FadeIn({ children, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={domRef} className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function DashboardView() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); 
  const [langOpen, setLangOpen] = useState(false);
  
  const { setCurrentView, loadConfiguration, resetBuild, language, setLanguage, viewerBg, setViewerBg, catalog, setUi } = useStore();
  const { isAuthenticated, logout, user } = useAuthStore();

  const availableLanguages = [
    { code: 'en', label: 'English (EN)' }, { code: 'uk', label: 'Українська (UK)' }, 
    { code: 'it', label: 'Italiano (IT)' }, { code: 'pl', label: 'Polski (PL)' },
    { code: 'es', label: 'Español (ES)' }, { code: 'fr', label: 'Français (FR)' },
    { code: 'de', label: 'Deutsch (DE)' }
  ];

  // --- ЛОГІКА ПІДПИСОК ---
  const userTier = user?.role || 'user';
  const MAX_SAVES = { user: 1, pro: 5, elite: '∞' };
  const limit = MAX_SAVES[userTier];
  const currentSaves = builds.length;
  const isLimitReached = userTier !== 'elite' && currentSaves >= limit;

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api.get('/configs')
        .then(res => {
          const sorted = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setBuilds(sorted);
        })
        .catch(err => console.error("Failed to fetch builds", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const confirmDelete = async () => {
    try {
      await api.delete(`/configs/${deleteId}`);
      setBuilds(builds.filter(b => b._id !== deleteId));
      setDeleteId(null);
    } catch (err) { console.error(err); }
  };

  const handleDuplicate = async (build) => {
    if (isLimitReached) return;
    try {
      const payload = {
        name: `${build.name} (Copy)`,
        selectedParts: build.selectedParts,
        partColors: build.partColors,
        thumbnailUrl: build.thumbnailUrl,
        updatedAt: new Date().toISOString()
      };
      const res = await api.post('/configs', payload);
      setBuilds([res.data, ...builds]);
    } catch (err) { console.error("Duplicate failed", err); }
  };

  const handleLoadOfficial = (data) => {
    loadConfiguration(data, true); 
    setCurrentView('editor');
  };

  const handleCreateNewBuild = () => {
    if (isLimitReached) return;
    resetBuild(); 
    setCurrentView('editor'); 
  };

  const handleLoadCustom = (data) => {
    loadConfiguration(data, false); 
    setCurrentView('editor');
  };

  // Перехід до підписок
  const handleUpgradeClick = () => {
    setCurrentView('home');
    // Робимо затримку, щоб компонент HomeView встиг завантажитись
    setTimeout(() => {
      const el = document.getElementById('pricing');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const getPartName = (id) => catalog.find(p => p.id === id)?.name || "N/A";

  return (
    <div className={`min-h-screen ${viewerBg === 'dark' ? 'bg-[#09090b] text-neutral-300' : 'bg-neutral-100 text-neutral-800'} flex flex-col font-sans transition-colors duration-500`}>
      
      {/* HEADER */}
      <nav className={`fixed top-0 w-full z-50 ${viewerBg === 'dark' ? 'bg-[#09090b]/90 border-neutral-800' : 'bg-white/90 border-neutral-300'} backdrop-blur-md border-b h-16 flex items-center px-6 justify-between transition-colors duration-500`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('home')}>
          <div className={`p-1.5 border rounded-sm group-hover:border-blue-500 transition-colors ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-700' : 'bg-neutral-100 border-neutral-300'}`}>
            <Cpu className={`w-5 h-5 ${viewerBg === 'dark' ? 'text-white' : 'text-neutral-900'} group-hover:text-blue-500`} />
          </div>
          <span className={`font-black tracking-tighter uppercase ${viewerBg === 'dark' ? 'text-white' : 'text-neutral-900'}`}>PCWITH<span className="text-blue-500">BLADVIK</span></span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setViewerBg(viewerBg === 'dark' ? 'light' : 'dark')} className={`p-2 border rounded transition-all ${viewerBg === 'dark' ? 'border-neutral-800 bg-neutral-900 hover:border-neutral-600' : 'border-neutral-300 bg-neutral-100 hover:border-neutral-400'}`}>
            {viewerBg === 'dark' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
          </button>

          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className={`flex items-center gap-2 px-3 py-1.5 border rounded text-xs font-bold transition-colors uppercase ${viewerBg === 'dark' ? 'border-neutral-800 bg-neutral-900 text-white' : 'border-neutral-300 bg-neutral-100 text-neutral-900'}`}>
              <Globe className="w-4 h-4" /> {language}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className={`absolute right-0 mt-2 w-40 border rounded shadow-2xl overflow-hidden z-50 ${viewerBg === 'dark' ? 'bg-[#09090b] border-neutral-800' : 'bg-white border-neutral-200'}`}>
                  {availableLanguages.map((lang) => (
                    <button key={lang.code} onClick={() => { setLanguage(lang.code); setLangOpen(false); }} className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors ${viewerBg === 'dark' ? 'text-neutral-400 hover:bg-neutral-900 hover:text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'} ${language === lang.code && 'text-blue-500'}`}>
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Кнопка Оновлення Підписки (ховаємо для elite) */}
          {userTier !== 'elite' && (
            <button 
              onClick={handleUpgradeClick} 
              className={`hidden sm:flex items-center gap-2 text-xs font-bold px-4 py-2 ${userTier === 'pro' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-900/20' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/20'} text-white rounded shadow-lg transition-all`}
            >
              <Award className="w-4 h-4" /> {userTier === 'pro' ? t('nav_elite', language) : t('nav_pro', language)}
            </button>
          )}
          
          {isAuthenticated ? (
            <div className={`flex items-center gap-4 pl-4 ml-2 border-l ${viewerBg === 'dark' ? 'border-neutral-800' : 'border-neutral-300'}`}>
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  {/* Аватарка з градієнтом, що змінюється від статусу */}
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${userTier === 'elite' ? 'from-purple-600 to-pink-500' : 'from-blue-600 to-indigo-500'} flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-105 transition-transform border border-white/10`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {/* КОРОНА ДЛЯ ELITE */}
                  {userTier === 'elite' && (
                    <Crown className="w-4 h-4 text-yellow-400 absolute -top-2 -right-1 transform rotate-12 drop-shadow-md" />
                  )}
                </div>
                <span className={`text-xs font-bold hidden sm:block transition-colors ${viewerBg === 'dark' ? 'text-neutral-300 group-hover:text-white' : 'text-neutral-600 group-hover:text-black'}`}>
                  {user?.name || 'User'}
                </span>
              </div>
              <button onClick={logout} className={`p-2 rounded transition-colors ${viewerBg === 'dark' ? 'text-neutral-500 hover:text-red-500 hover:bg-red-500/10' : 'text-neutral-400 hover:text-red-600 hover:bg-red-50'}`} title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setUi('loginOpen', true)} className="flex items-center gap-1 text-xs font-bold hover:text-blue-500 transition-colors ml-2">
              <User className="w-4 h-4" /> {t('login', language)}
            </button>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-12 border-b pb-8 flex flex-col md:flex-row justify-between items-end gap-4" style={{ borderColor: viewerBg === 'dark' ? '#262626' : '#e5e5e5' }}>
          <div>
            <h1 className={`text-4xl font-black tracking-tighter uppercase mb-2 ${viewerBg === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{t('title', language)}</h1>
            <p className={viewerBg === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>{t('subtitle', language)}</p>
          </div>
        </div>

        {/* ІНДИКАТОР ПІДПИСКИ */}
        {isAuthenticated && (
          <FadeIn delay={0}>
            <div className={`p-5 mb-8 border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300 shadow-sm'}`}>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className={`p-3 rounded-lg ${userTier === 'elite' ? 'bg-purple-500/10 text-purple-500' : userTier === 'pro' ? 'bg-blue-500/10 text-blue-500' : 'bg-neutral-500/10 text-neutral-500'}`}>
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{t('plan', language)}</span>
                  <div className={`text-lg font-black uppercase ${userTier === 'elite' ? 'text-purple-500' : userTier === 'pro' ? 'text-blue-500' : viewerBg === 'dark' ? 'text-white' : 'text-black'}`}>
                    {userTier}
                  </div>
                </div>
              </div>
              
              <div className="w-full sm:w-1/2">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-neutral-500">{t('used_saves', language)}</span>
                  <span className={`text-lg font-black ${isLimitReached ? 'text-red-500' : 'text-emerald-500'}`}>
                    {currentSaves} / {limit}
                  </span>
                </div>
                {userTier !== 'elite' && (
                  <div className={`h-2 w-full rounded-full overflow-hidden ${viewerBg === 'dark' ? 'bg-black' : 'bg-neutral-200'}`}>
                    <div className={`h-full rounded-full transition-all duration-1000 ${isLimitReached ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((currentSaves / limit) * 100, 100)}%` }} />
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* CREATE NEW BUTTON */}
          <FadeIn delay={50}>
            {isAuthenticated ? (
              <div onClick={handleCreateNewBuild} className={`group flex flex-col items-center justify-center h-80 border-2 border-dashed rounded-lg transition-all ${isLimitReached ? (viewerBg === 'dark' ? 'bg-red-900/5 border-red-900/30 cursor-not-allowed opacity-75' : 'bg-red-50 border-red-200 cursor-not-allowed opacity-75') : (viewerBg === 'dark' ? 'bg-[#09090b] border-neutral-800 cursor-pointer hover:border-blue-500 hover:bg-blue-900/10' : 'bg-white border-neutral-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50')}`}>
                <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-300 mb-6 shadow-2xl ${isLimitReached ? 'bg-red-500/10 border-red-500/30' : (viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-800 group-hover:bg-blue-600' : 'bg-neutral-50 border-neutral-200 group-hover:bg-blue-500')}`}>
                  {isLimitReached ? <Lock className="w-8 h-8 text-red-500" /> : <Plus className={`w-8 h-8 ${viewerBg === 'dark' ? 'text-neutral-600 group-hover:text-white' : 'text-neutral-400 group-hover:text-white'}`} />}
                </div>
                <h3 className={`font-black text-lg uppercase tracking-wide transition-colors ${isLimitReached ? 'text-red-500' : (viewerBg === 'dark' ? 'text-white group-hover:text-blue-400' : 'text-neutral-800 group-hover:text-blue-600')}`}>
                  {isLimitReached ? t('limit_reached', language) : t('btn_create', language)}
                </h3>
                <p className={`text-xs mt-2 font-medium text-center px-4 ${isLimitReached ? 'text-red-400' : 'text-neutral-500'}`}>
                  {isLimitReached ? t('upgrade_plan', language) : t('btn_create_sub', language)}
                </p>
                {/* Додаткова кнопка оновлення прямо тут, якщо ліміт */}
                {isLimitReached && (
                  <button onClick={(e) => { e.stopPropagation(); handleUpgradeClick(); }} className="mt-4 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded transition-colors">
                    {t('upgrade_plan', language)}
                  </button>
                )}
              </div>
            ) : (
              <div onClick={() => setUi('loginOpen', true)} className={`group flex flex-col items-center justify-center h-80 border-2 border-dashed rounded-lg cursor-pointer transition-all ${viewerBg === 'dark' ? 'bg-[#09090b] border-neutral-800 hover:border-red-500/30 hover:bg-red-900/10' : 'bg-neutral-100 border-neutral-300 hover:border-red-500/30 hover:bg-red-50'}`}>
                <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-300 mb-6 shadow-2xl ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-800 group-hover:bg-red-900/30' : 'bg-neutral-200 border-neutral-300 group-hover:bg-red-100'}`}>
                  <Lock className={`w-8 h-8 ${viewerBg === 'dark' ? 'text-neutral-600 group-hover:text-red-500' : 'text-neutral-400 group-hover:text-red-500'}`} />
                </div>
                <h3 className={`font-black text-lg uppercase tracking-wide transition-colors ${viewerBg === 'dark' ? 'text-neutral-500 group-hover:text-red-400' : 'text-neutral-500 group-hover:text-red-500'}`}>{t('btn_locked', language)}</h3>
                <p className={`text-xs mt-2 font-medium ${viewerBg === 'dark' ? 'text-neutral-600' : 'text-neutral-400'}`}>{t('btn_locked_sub', language)}</p>
              </div>
            )}
          </FadeIn>

          {/* OFFICIAL BLUEPRINTS */}
          {OFFICIAL_BLUEPRINTS.map((bp, i) => (
            <FadeIn key={bp.id} delay={(i + 2) * 50}>
              <div className={`h-80 border rounded-lg overflow-hidden flex flex-col relative group shadow-xl transition-transform hover:-translate-y-1 ${viewerBg === 'dark' ? 'bg-[#09090b] border-blue-500/30' : 'bg-white border-blue-500/30'}`}>
                <div className="absolute top-2 right-2 z-10 bg-blue-600 text-[9px] font-black px-2 py-1 rounded text-white flex items-center gap-1 shadow-lg">
                  <Award className="w-3 h-3" /> OFFICIAL
                </div>
                <div className={`w-full h-72 flex items-center justify-center overflow-hidden ${viewerBg === 'dark' ? 'bg-neutral-950' : 'bg-neutral-100'}`}>
                   {bp.thumbnailUrl ? (
                     <img src={bp.thumbnailUrl} alt={bp.name} className="w-full h-full object-cover object-center" />
                   ) : (
                     <ImageIcon className="text-neutral-500 w-10 h-10" />
                   )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className={`font-bold mb-1 uppercase text-sm truncate ${viewerBg === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{bp.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4 mt-2">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded border truncate max-w-full ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-800 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-600'}`}>{getPartName(bp.selectedParts.CPU)}</span>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded border truncate max-w-full ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-800 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-600'}`}>{getPartName(bp.selectedParts.GPU)}</span>
                  </div>
                  <button onClick={() => handleLoadOfficial(bp)} className="mt-auto w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded transition-all">
                    Load Template
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}

          {/* USER SAVED BUILDS */}
          {isAuthenticated && (
            loading ? (
              <div className="col-span-full h-32 flex items-center justify-center font-bold uppercase tracking-widest animate-pulse opacity-50">Syncing...</div>
            ) : (
              builds.map((build, index) => (
                <FadeIn key={build._id} delay={(index + 3) * 100}>
                  <div className={`border rounded-lg overflow-hidden flex flex-col group transition-all hover:border-blue-500/50 hover:shadow-2xl ${viewerBg === 'dark' ? 'bg-[#09090b] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
                    <div className={`h-64 relative overflow-hidden ${viewerBg === 'dark' ? 'bg-black border-b border-neutral-800' : 'bg-neutral-100 border-b border-neutral-200'}`}>
                      {build.thumbnailUrl ? (
                         <img src={build.thumbnailUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" style={{ objectPosition: 'center 61%' }}/>
                      ) : (
                         <div className="flex items-center justify-center h-full"><ImageIcon className="text-neutral-600 w-10 h-10" /></div>
                      )}
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur text-white text-[9px] font-black uppercase px-2 py-1 rounded z-20">
                        ID: {build._id.slice(-5)}
                      </div>
                    </div>
                    <div className="p-3 flex flex-col">
                      <h3 className={`font-bold text-sm truncate ${viewerBg === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{build.name}</h3>
                      <p className="text-[10px] text-neutral-500 mb-4">Modified: {new Date(build.updatedAt || build.createdAt).toLocaleDateString()}</p>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleLoadCustom(build)} className={`flex-1 py-2 text-[10px] font-black uppercase rounded transition-colors flex items-center justify-center gap-1 ${viewerBg === 'dark' ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'}`}>
                          <Edit2 className="w-3 h-3"/> Edit
                        </button>
                        <button onClick={() => handleDuplicate(build)} disabled={isLimitReached} className={`p-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${viewerBg === 'dark' ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'bg-neutral-50 hover:bg-neutral-200 text-neutral-500'}`}>
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(build._id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))
            )
          )}
        </div>
      </main>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-sm border p-6 rounded-xl shadow-2xl ${viewerBg === 'dark' ? 'bg-neutral-900 border-red-500/30' : 'bg-white border-red-500/30'}`}>
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-lg font-black uppercase tracking-tight">{t('confirm_del', language)}</h2>
            </div>
            <p className={`text-sm mb-6 ${viewerBg === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>{t('del_warning', language)}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className={`flex-1 py-3 border text-xs font-bold rounded transition-all ${viewerBg === 'dark' ? 'border-neutral-700 text-white hover:bg-neutral-800' : 'border-neutral-300 text-neutral-900 hover:bg-neutral-100'}`}>
                {t('cancel', language)}
              </button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-500 transition-all shadow-lg shadow-red-900/20">
                {t('delete', language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}