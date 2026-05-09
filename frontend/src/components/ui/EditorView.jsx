// frontend/src/components/ui/EditorView.jsx
import React, { useState, useMemo } from 'react';
import { useStore, translations } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Sliders, Zap, Layers, Cpu, Server, 
  HardDrive, Monitor, Moon, Sun, Globe, User, AlertTriangle, 
  Plus, Thermometer, Info, BarChart3, Lightbulb, Fan, Palette, Power, Eraser, LogOut, Lock, Crown
} from 'lucide-react';
import Scene from '../3d/Scene';

export default function EditorView() {
  const { 
    setCurrentView, systemStats, selectedParts, catalog, equipPart, setFanInSlot,
    viewerBg, setViewerBg, language, setLanguage, setUi, compatibilityIssues, isFullyBuilt,
    isOfficialBuild, rgbEnabled, toggleRgbEnabled, rgbSync, toggleRgbSync, 
    globalRgbColor, setGlobalRgbColor, baseSync, toggleBaseSync, globalBaseColor, 
    setGlobalBaseColor, partColors, setPartColor, resetColors
  } = useStore();
  
  const { isAuthenticated, user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('loadout'); 
  const [activeCategory, setActiveCategory] = useState('Case');
  const [langOpen, setLangOpen] = useState(false); 
  const [sortConfig, setSortConfig] = useState('priceAsc');
  
  const t = translations[language] || translations['en'];

  const localTexts = {
    en: { select_canvas: "Select Your Canvas", canvas_sub: "Where should we start? Choose a case.", select_case: "Select Case", locked: "Aura Studio Locked", upgrade_msg: "Upgrade to PRO to unlock full RGB and fan controls.", upgrade_btn: "Upgrade Plan" },
    uk: { select_canvas: "Оберіть основу", canvas_sub: "З чого почнемо збірку? Оберіть корпус.", select_case: "Обрати цей корпус", locked: "Aura Studio Заблоковано", upgrade_msg: "Оновіть підписку до PRO, щоб розблокувати управління RGB.", upgrade_btn: "Оновити план" },
    it: { select_canvas: "Scegli la base", canvas_sub: "Da dove iniziamo? Scegli un case.", select_case: "Scegli Case", locked: "Aura Studio Bloccato", upgrade_msg: "Passa a PRO per sbloccare i controlli RGB.", upgrade_btn: "Aggiorna Piano" },
    pl: { select_canvas: "Wybierz bazę", canvas_sub: "Od czego zaczynamy? Wybierz obudowę.", select_case: "Wybierz obudowę", locked: "Aura Studio Zablokowane", upgrade_msg: "Zaktualizuj do PRO, aby odblokować kontrolę RGB.", upgrade_btn: "Ulepsz Plan" },
    es: { select_canvas: "Elige la base", canvas_sub: "¿Por dónde empezamos? Elige una caja.", select_case: "Elegir Caja", locked: "Aura Studio Bloqueado", upgrade_msg: "Mejora a PRO para desbloquear los controles RGB.", upgrade_btn: "Mejorar Plan" },
    fr: { select_canvas: "Choisissez la base", canvas_sub: "Par où commencer ? Choisissez un boîtier.", select_case: "Choisir le boîtier", locked: "Aura Studio Verrouillé", upgrade_msg: "Passez à PRO pour débloquer les contrôles RGB.", upgrade_btn: "Améliorer le Forfait" },
    de: { select_canvas: "Wählen Sie die Basis", canvas_sub: "Wo fangen wir an? Wählen Sie ein Gehäuse.", select_case: "Gehäuse wählen", locked: "Aura Studio Gesperrt", upgrade_msg: "Upgraden Sie auf PRO, um RGB-Steuerung freizuschalten.", upgrade_btn: "Tarif Upgraden" }
  };
  const lt = localTexts[language] || localTexts['en'];

  const LANGUAGES = [
    { code: 'en', label: 'English (EN)' }, { code: 'uk', label: 'Українська (UK)' },
    { code: 'it', label: 'Italiano (IT)' }, { code: 'pl', label: 'Polski (PL)' },
    { code: 'es', label: 'Español (ES)' }, { code: 'fr', label: 'Français (FR)' },
    { code: 'de', label: 'Deutsch (DE)' }
  ];

  const getPartData = (partId) => catalog.find(p => p.id === partId);

  const currentCaseData = useMemo(() => getPartData(selectedParts.Case), [selectedParts.Case, catalog]);
  const currentMoboData = useMemo(() => getPartData(selectedParts.Motherboard), [selectedParts.Motherboard, catalog]);
  const currentCpuData = useMemo(() => getPartData(selectedParts.CPU), [selectedParts.CPU, catalog]);
  
  const availableFanSlots = currentCaseData?.fanSlots ? Object.keys(currentCaseData.fanSlots) : [];

  const categories = [
    { id: 'Case', icon: <Server className="w-4 h-4" /> },
    { id: 'Motherboard', icon: <Monitor className="w-4 h-4" /> },
    { id: 'CPU', icon: <Cpu className="w-4 h-4" /> },
    { id: 'GPU', icon: <Monitor className="w-4 h-4" /> },
    { id: 'RAM', icon: <Layers className="w-4 h-4" /> },
    { id: 'PSU', icon: <Zap className="w-4 h-4" /> },
    { id: 'SSD', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'CaseFans', icon: <Fan className="w-4 h-4" /> }
  ];

  const handleSlotClick = (categoryId) => {
    if (isOfficialBuild || !isAuthenticated) return; 
    setActiveCategory(categoryId);
    setActiveTab('catalog');
  };

  const { currentTotalPrice, missingCriticalParts } = useMemo(() => {
    let price = 0;
    const missing = [];
    const criticalTypes = ['Case', 'Motherboard', 'CPU', 'GPU', 'RAM', 'PSU'];

    criticalTypes.forEach(type => {
      if (selectedParts[type]) {
        const p = getPartData(selectedParts[type]);
        if (p) price += p.price;
      } else {
        missing.push(type);
      }
    });
    
    if (selectedParts['SSD']) price += getPartData(selectedParts['SSD'])?.price || 0;
    else missing.push('SSD');
    
    if (selectedParts.CaseFans && typeof selectedParts.CaseFans === 'object') {
      Object.values(selectedParts.CaseFans).forEach(fanId => {
        if (fanId) price += getPartData(fanId)?.price || 0;
      });
    }

    return { currentTotalPrice: price, missingCriticalParts: missing };
  }, [selectedParts, catalog]);

  const sortedCatalog = useMemo(() => {
    return [...catalog].filter(p => p.type === activeCategory).sort((a, b) => {
      if (sortConfig === 'priceAsc') return a.price - b.price;
      if (sortConfig === 'priceDesc') return b.price - a.price;
      if (sortConfig === 'nameAsc') return a.name.localeCompare(b.name);
      if (sortConfig === 'powerDesc') return (b.powerDraw || 0) - (a.powerDraw || 0);
      return 0;
    });
  }, [catalog, activeCategory, sortConfig]);

  const canRunBenchmarks = (systemStats?.fps?.cs2 || 0) > 0;
  const getSafeSocket = (part) => part?.compatibility?.socket?.toString().trim().toUpperCase();
  const availableCases = useMemo(() => catalog.filter(p => p.type === 'Case'), [catalog]);

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden font-sans select-none transition-colors duration-300 ${viewerBg === 'dark' ? 'bg-[#09090b] text-neutral-300' : 'bg-neutral-100 text-neutral-800'}`}>
      
      <header className={`h-14 flex items-center justify-between px-4 shrink-0 z-30 border-b ${viewerBg === 'dark' ? 'bg-[#09090b] border-neutral-800' : 'bg-white border-neutral-300 shadow-sm'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'home')} className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest hover:text-blue-500 transition-colors">
            <ChevronLeft className="w-4 h-4" /> {t.back || "Back"}
          </button>
          <div className="h-4 w-px bg-neutral-700 hidden md:block"></div>
          <span className="hidden md:block text-xs font-black uppercase tracking-widest text-blue-500">
            {isOfficialBuild ? "Official Showcase" : (!isAuthenticated ? "Read-Only Mode" : (t.workbench || "Workbench Pro"))}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setViewerBg(viewerBg === 'light' ? 'dark' : 'light')} className="p-2 rounded-full hover:bg-neutral-500/10 transition-colors">
            {viewerBg === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-yellow-500" />}
          </button>
          
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className={`flex items-center gap-1 p-2 text-xs font-bold rounded transition-colors ${langOpen ? (viewerBg === 'dark' ? 'bg-neutral-800' : 'bg-neutral-100') : 'hover:bg-neutral-500/10'}`}>
              <Globe className="w-4 h-4 text-blue-500" /> 
              <span className="hidden md:inline-block">{LANGUAGES.find(l => l.code === language)?.label}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`absolute top-full right-0 mt-2 w-48 border rounded-lg shadow-2xl z-50 overflow-hidden ${viewerBg === 'dark' ? 'bg-[#09090b] border-neutral-800' : 'bg-white border-neutral-200'}`}>
                  {LANGUAGES.map(lang => (
                    <button key={lang.code} onClick={() => { setLanguage(lang.code); setLangOpen(false); }} className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors ${language === lang.code ? 'bg-blue-600 text-white' : (viewerBg === 'dark' ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-black')}`}>
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isAuthenticated ? (
            <div className={`flex items-center gap-4 pl-4 ml-2 border-l ${viewerBg === 'dark' ? 'border-neutral-800' : 'border-neutral-300'}`}>
              
              {/* Профіль з Короною */}
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${user?.role === 'elite' ? 'from-purple-600 to-pink-500' : 'from-blue-600 to-indigo-500'} flex items-center justify-center text-white font-black text-[10px] shadow-lg group-hover:scale-105 transition-transform`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {user?.role === 'elite' && (
                    <Crown className="w-3 h-3 text-yellow-400 absolute -top-1.5 -right-1 transform rotate-12 drop-shadow-md" />
                  )}
                </div>
                <span className={`text-[10px] font-bold hidden lg:block transition-colors ${viewerBg === 'dark' ? 'text-neutral-300 group-hover:text-white' : 'text-neutral-600 group-hover:text-black'}`}>
                  {user?.name || 'User'}
                </span>
              </div>

              <button onClick={logout} className={`p-2 rounded transition-colors ${viewerBg === 'dark' ? 'text-neutral-500 hover:text-red-500' : 'text-neutral-400 hover:text-red-600'}`} title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className={`flex items-center gap-2 pl-4 ml-2 border-l ${viewerBg === 'dark' ? 'border-neutral-800' : 'border-neutral-300'}`}>
              <button onClick={() => setUi('loginOpen', true)} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">
                {t.login || "Login"}
              </button>
              <button onClick={() => setUi('registerOpen', true)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded transition-all shadow-lg shadow-blue-900/20">
                {t.register || "Sign Up"}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <motion.aside initial={{ x: -340 }} animate={{ x: 0 }} className={`w-[340px] flex-shrink-0 flex flex-col z-20 border-r relative ${viewerBg === 'dark' ? 'bg-[#09090b] border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <div className={`flex border-b shrink-0 ${viewerBg === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}`}>
            <button onClick={() => setActiveTab('loadout')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'loadout' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-neutral-500 hover:text-neutral-400'}`}>
              <Layers className="w-4 h-4" /> {t.loadout || "Loadout"}
            </button>
            
            {!isOfficialBuild && isAuthenticated && (
              <button onClick={() => { setActiveTab('catalog'); setActiveCategory('Case'); }} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'catalog' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-neutral-500 hover:text-neutral-400'}`}>
                <Sliders className="w-4 h-4" /> {t.catalog || "Catalog"}
              </button>
            )}

            <button onClick={() => setActiveTab('customize')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'customize' ? 'text-purple-500 border-b-2 border-purple-500 bg-purple-500/5' : 'text-neutral-500 hover:text-neutral-400'}`}>
              <Palette className="w-4 h-4" /> {t.auraStudio || "Lighting"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-500/30">
            {activeTab === 'loadout' && (
              <div className="p-4 flex flex-col min-h-full">
                <div className="space-y-3 mb-6">
                  {categories.map((cat) => {
                    const cursorClass = (isOfficialBuild || !isAuthenticated) ? 'cursor-default' : 'cursor-pointer hover:border-blue-500';

                    if (cat.id === 'CaseFans') {
                      return (
                        <div key={cat.id} className={`border p-3 rounded-lg ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                          <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-2">
                            {cat.icon} {cat.id}
                          </div>
                          {!currentCaseData ? (
                            <div className="text-[10px] text-red-500 font-bold">Please equip a case first.</div>
                          ) : (
                            <div className="space-y-1.5 mt-2">
                              {availableFanSlots.map(slot => {
                                const fanId = selectedParts.CaseFans?.[slot];
                                const fanData = getPartData(fanId);
                                return (
                                  <div key={slot} className={`flex justify-between items-center px-2 py-1.5 rounded ${viewerBg === 'dark' ? 'bg-black/40' : 'bg-white border'}`}>
                                    <span className="text-[9px] font-bold text-neutral-500 uppercase">{slot}</span>
                                    <span className={`text-[10px] font-bold truncate max-w-[120px] ${fanData ? (viewerBg === 'dark' ? 'text-white' : 'text-black') : 'text-neutral-500'}`}>
                                      {fanData ? fanData.name : 'Empty'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    const partData = getPartData(selectedParts[cat.id]);
                    return (
                      <div key={cat.id} onClick={() => handleSlotClick(cat.id)} className={`border p-3 rounded-lg transition-colors ${viewerBg === 'dark' ? `bg-neutral-900 border-neutral-800 ${cursorClass}` : `bg-neutral-50 border-neutral-200 ${cursorClass}`}`}>
                        <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-1">
                          {cat.icon} {cat.id}
                        </div>
                        {partData ? (
                          <div>
                            <div className="text-sm font-bold truncate">{partData.name}</div>
                            <div className="text-xs text-blue-500 mt-1">${partData.price}</div>
                          </div>
                        ) : (
                          <div className="text-sm font-bold text-neutral-500 flex items-center gap-1 mt-1">
                            <Plus className="w-4 h-4" /> {t.selectComponent || "Select"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className={`mt-auto pt-6`}>
                  <div className={`p-4 rounded-lg border ${viewerBg === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-200 border-neutral-300'}`}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.totalPrice || "Total Cost"}</span>
                      <span className="text-2xl font-black text-emerald-500">${currentTotalPrice}</span>
                    </div>
                    {!isFullyBuilt ? (
                      <div className="mt-2">
                        <span className="text-[9px] text-orange-500 font-bold uppercase tracking-widest">{t.missingParts || "Missing:"}</span>
                        <p className="text-[10px] text-neutral-400 mt-0.5 leading-tight">{missingCriticalParts.join(', ')}</p>
                      </div>
                    ) : (
                      <div className="mt-2 py-1 px-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] text-emerald-500 font-black uppercase tracking-widest text-center">
                        {t.systemReady || "System Ready"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'catalog' && (
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{activeCategory} {t.catalog || "Catalog"}</span>
                  <select value={sortConfig} onChange={(e) => setSortConfig(e.target.value)} className={`text-[9px] font-bold p-1 rounded border outline-none cursor-pointer ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-700 text-neutral-300' : 'bg-white border-neutral-300 text-neutral-700'}`}>
                    <option value="priceAsc">{t.priceAsc || "Price: Low to High"}</option>
                    <option value="priceDesc">{t.priceDesc || "Price: High to Low"}</option>
                    <option value="nameAsc">{t.nameAsc || "Name: A-Z"}</option>
                    <option value="powerDesc">{t.powerDesc || "Power: High to Low"}</option>
                  </select>
                </div>

                <div className="space-y-3 pr-1">
                  {sortedCatalog.map(item => {
                    const isEquipped = selectedParts[activeCategory] === item.id;
                    
                    let isSocketIncompatible = false;
                    let requiredSocket = '';

                    if (activeCategory === 'CPU' && currentMoboData) {
                      const moboSocket = getSafeSocket(currentMoboData);
                      const cpuSocket = getSafeSocket(item);
                      if (moboSocket && cpuSocket && moboSocket !== cpuSocket) {
                        isSocketIncompatible = true;
                        requiredSocket = moboSocket;
                      }
                    } else if (activeCategory === 'Motherboard' && currentCpuData) {
                      const cpuSocket = getSafeSocket(currentCpuData);
                      const moboSocket = getSafeSocket(item);
                      if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
                        isSocketIncompatible = true;
                        requiredSocket = cpuSocket;
                      }
                    }

                    return (
                      <div key={item.id} className={`p-3 border rounded-lg flex flex-col ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} ${isSocketIncompatible ? 'opacity-50' : ''}`}>
                        <div className="text-sm font-bold leading-tight mb-1">{item.name}</div>
                        
                        <div className="flex gap-3 text-[9px] text-neutral-500 uppercase tracking-widest mb-2">
                           {item.brand && <span>{item.brand}</span>}
                           {item.powerDraw > 0 && <span>⚡ {item.powerDraw}W</span>}
                           {item.compatibility?.socket && <span className={isSocketIncompatible ? 'text-red-500 font-black' : ''}>Socket: {item.compatibility.socket}</span>}
                        </div>
                        
                        {item.description && (
                           <p className="text-[10px] text-neutral-400 mb-3 leading-tight">{item.description}</p>
                        )}

                        <div className="flex justify-between items-end border-t border-neutral-500/20 pt-2 mt-auto">
                          <span className="font-black text-emerald-500">${item.price}</span>
                          
                          {activeCategory === 'CaseFans' ? (
                            <div className="flex flex-col gap-1 w-full max-w-[140px]">
                              {!currentCaseData ? (
                                <span className="text-[9px] text-red-500 font-bold text-right">No Case Selected</span>
                              ) : (
                                <div className="grid grid-cols-2 gap-1">
                                  {availableFanSlots.map(slot => {
                                    const isEquippedInSlot = selectedParts.CaseFans?.[slot] === item.id;
                                    return (
                                      <button
                                        key={slot}
                                        onClick={() => setFanInSlot(slot, item.id)}
                                        className={`py-1 px-1 text-[8px] font-black uppercase rounded transition-colors truncate ${isEquippedInSlot ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50' : 'bg-blue-600/10 text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500/30'}`}
                                      >
                                        {isEquippedInSlot ? 'ON' : slot}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-end gap-1">
                              {isSocketIncompatible && (
                                <span className="text-[8px] text-red-500 font-bold uppercase">
                                  {language === 'uk' ? `Потрібен: ${requiredSocket}` : `Needs: ${requiredSocket}`}
                                </span>
                              )}
                              <button 
                                onClick={() => !isSocketIncompatible && equipPart(activeCategory, item.id)} 
                                disabled={isSocketIncompatible}
                                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-colors ${
                                  isEquipped 
                                    ? 'bg-emerald-500/20 text-emerald-500' 
                                    : isSocketIncompatible 
                                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                                }`}
                              >
                                {isEquipped ? (t.equipped || "Equipped") : isSocketIncompatible ? (language === 'uk' ? 'Заблоковано' : 'Blocked') : (t.equip || "Equip")}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'customize' && (
              <div className="p-4 flex flex-col space-y-6 relative">
                
                {/* ЗАГЛУШКА ДЛЯ БАЗОВИХ ЮЗЕРІВ */}
                {user?.role === 'user' && (
                  <div className="absolute inset-0 z-20 bg-[#09090b]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded-lg border border-neutral-800 m-4">
                    <Lock className="w-8 h-8 text-neutral-500 mb-3" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">{lt.locked}</h3>
                    <p className="text-xs text-neutral-400 mb-4">{lt.upgrade_msg}</p>
                    <button onClick={() => setCurrentView('home')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded transition-colors">
                      {lt.upgrade_btn}
                    </button>
                  </div>
                )}

                <div className={`transition-opacity ${user?.role === 'user' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                  <div className={`p-4 border rounded-xl flex items-center justify-between shadow-lg mb-6 ${viewerBg === 'dark' ? 'bg-[#09090b] border-neutral-800' : 'bg-white border-neutral-200'}`}>
                    <div>
                      <span className={`text-xs font-black uppercase tracking-widest block mb-1 ${rgbEnabled ? 'text-emerald-500' : 'text-neutral-500'}`}>
                        {t.systemPower || "RGB Power"}
                      </span>
                      <span className="text-[9px] text-neutral-500">{rgbEnabled ? "Lighting is ON" : "Lighting is OFF"}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={resetColors} className="p-3 rounded-full transition-all duration-300 bg-red-500/10 text-red-500 hover:bg-red-500/20" title="Reset all colors">
                        <Eraser className="w-5 h-5" />
                      </button>
                      <button onClick={() => toggleRgbEnabled(!rgbEnabled)} className={`p-3 rounded-full transition-all duration-300 shadow-xl ${rgbEnabled ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 shadow-emerald-500/20' : 'bg-neutral-800 text-neutral-500 hover:text-white'}`}>
                        <Power className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Global Master Override</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-3 border rounded-lg ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[9px] font-bold uppercase text-neutral-400">Base Sync</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={baseSync} onChange={(e) => toggleBaseSync(e.target.checked)} />
                            <div className="w-7 h-4 bg-neutral-600 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-500"></div>
                          </label>
                        </div>
                        <input type="color" disabled={!baseSync} value={globalBaseColor} onChange={(e) => setGlobalBaseColor(e.target.value)} className="w-full h-8 rounded cursor-pointer disabled:opacity-30 border-0 p-0" />
                      </div>

                      <div className={`p-3 border rounded-lg ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[9px] font-bold uppercase text-purple-500">RGB Sync</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" disabled={!rgbEnabled} className="sr-only peer" checked={rgbSync} onChange={(e) => toggleRgbSync(e.target.checked)} />
                            <div className="w-7 h-4 bg-neutral-600 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-500 disabled:opacity-30"></div>
                          </label>
                        </div>
                        <input type="color" disabled={!rgbSync || !rgbEnabled} value={globalRgbColor} onChange={(e) => setGlobalRgbColor(e.target.value)} className="w-full h-8 rounded cursor-pointer disabled:opacity-30 border-0 p-0" />
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-3 transition-opacity ${rgbSync && baseSync ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                     <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{t.individualZones || "Individual Zones"}</span>
                     
                     {['Case', 'CaseFans', 'RAM', 'GPU', 'Motherboard'].map(partType => {
                       const isEquipped = typeof selectedParts[partType] === 'object' 
                          ? Object.values(selectedParts[partType] || {}).some(id => id !== null) 
                          : !!selectedParts[partType];
                       
                       if (!isEquipped) return null;

                       return (
                         <div key={partType} className={`p-3 border rounded-lg ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                           <div className="text-xs font-bold mb-3 flex items-center gap-2">
                             <Palette className="w-3 h-3 text-purple-500" /> {partType}
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="flex-1 flex flex-col gap-1.5">
                                <span className="text-[9px] font-bold text-neutral-500 uppercase">{t.baseColorLabel || "Base"}</span>
                                <input 
                                  type="color" 
                                  disabled={baseSync}
                                  value={partColors[partType]?.base || '#ffffff'} 
                                  onChange={(e) => setPartColor(partType, 'base', e.target.value)} 
                                  className="w-full h-8 rounded cursor-pointer border-0 p-0 disabled:opacity-30" 
                                />
                              </div>
                              <div className="flex-1 flex flex-col gap-1.5">
                                <span className="text-[9px] font-bold text-purple-500 uppercase">{t.rgbLabel || "RGB"}</span>
                                <input 
                                  type="color" 
                                  disabled={rgbSync || !rgbEnabled} 
                                  value={partColors[partType]?.rgb || '#00e5ff'} 
                                  onChange={(e) => setPartColor(partType, 'rgb', e.target.value)} 
                                  className="w-full h-8 rounded cursor-pointer border-0 p-0 disabled:opacity-30" 
                                />
                              </div>
                           </div>
                         </div>
                       )
                     })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <AnimatePresence>
            {!isOfficialBuild && isAuthenticated && activeTab === 'catalog' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute left-[340px] top-6 flex flex-col gap-1 z-30 pointer-events-auto">
                {categories.map(c => {
                  const isActive = activeCategory === c.id;
                  return (
                    <button 
                      key={c.id} onClick={() => setActiveCategory(c.id)}
                      className={`group flex items-center gap-2 px-3 py-2 rounded-r-lg backdrop-blur-md transition-all border-y border-r overflow-hidden
                        ${isActive 
                          ? 'bg-blue-600/90 text-white border-blue-500 w-32 shadow-[5px_0_15px_rgba(37,99,235,0.3)]' 
                          : `w-12 hover:w-32 ${viewerBg === 'dark' ? 'bg-[#09090b]/60 text-neutral-400 border-neutral-800 hover:bg-neutral-800/80 hover:text-white' : 'bg-white/60 text-neutral-500 border-neutral-200 hover:bg-white/90 hover:text-black'}`
                        }`}
                    >
                      <div className="flex-shrink-0">{c.icon}</div>
                      <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {c.id}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>

        <main className={`flex-1 relative flex items-center justify-center overflow-hidden shadow-inner ${viewerBg === 'dark' ? 'bg-black' : 'bg-neutral-200'}`}>
          <div className="absolute inset-0">
            <Scene />
          </div>
        </main>

        <motion.aside initial={{ x: 320 }} animate={{ x: 0 }} className={`w-[340px] flex-shrink-0 flex flex-col z-20 border-l shadow-[-20px_0_40px_rgba(0,0,0,0.2)] ${viewerBg === 'dark' ? 'bg-[#09090b] border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-500/30">
            <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <BarChart3 className="w-3 h-3 text-blue-500" /> Analytics & Benchmarks
            </h3>
            
            {compatibilityIssues?.length > 0 && (
              <div className="space-y-3 mb-6">
                {compatibilityIssues.map((issue, idx) => (
                  <div key={idx} className="p-3 bg-red-500/10 border border-red-500/40 rounded-lg">
                    <div className="flex items-center gap-1.5 text-red-500 font-bold text-[10px] uppercase tracking-widest mb-1.5">
                      <AlertTriangle className="w-3 h-3" /> {t.compatIssue || "Issue Detected"}
                    </div>
                    <p className="text-[10px] text-red-400 leading-tight mb-2">{issue.text}</p>
                    <div className="flex items-start gap-1.5 bg-black/30 p-2 rounded">
                      <Lightbulb className="w-3 h-3 text-yellow-500 shrink-0 mt-0.5" />
                      <p className="text-[9px] text-neutral-300 leading-tight">{issue.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {systemStats?.bottleneckAlert && (
              <div className="mb-6 p-3 bg-orange-500/10 border border-orange-500/50 rounded-lg">
                <div className="flex items-center gap-1.5 text-orange-500 font-bold text-[10px] uppercase tracking-widest mb-1.5">
                  <Info className="w-3 h-3" /> {t.bottleneckWarn || "Bottleneck Alert"}
                </div>
                <p className="text-[10px] text-orange-400 leading-tight mb-2">{systemStats.bottleneckAlert.text}</p>
                <div className="flex items-start gap-1.5 bg-black/30 p-2 rounded">
                  <Lightbulb className="w-3 h-3 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-neutral-300 leading-tight">{systemStats.bottleneckAlert.hint}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-3 rounded-lg border ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">{t.estPower || "Power"}</span>
                <span className="text-lg font-black text-white flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500"/> {systemStats?.totalWattage || 0}W</span>
              </div>
              <div className={`p-3 rounded-lg border ${viewerBg === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">{t.temp || "Temp"}</span>
                <span className={`text-lg font-black flex items-center gap-1 ${(systemStats?.estimatedTemp || 0) > 75 ? 'text-red-500' : 'text-orange-500'}`}>
                  <Thermometer className="w-3 h-3"/> {systemStats?.estimatedTemp || 25}°C
                </span>
              </div>
            </div>

            {systemStats?.totalWattage > 0 && (
              <div className="mb-6">
                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-2 block">Power Breakdown</span>
                <div className="flex h-1.5 rounded-full overflow-hidden mb-2 bg-neutral-800">
                   <div style={{ width: `${(systemStats.powerBreakdown?.cpu / systemStats.totalWattage) * 100}%` }} className="bg-blue-500" />
                   <div style={{ width: `${(systemStats.powerBreakdown?.gpu / systemStats.totalWattage) * 100}%` }} className="bg-emerald-500" />
                   <div style={{ width: `${(systemStats.powerBreakdown?.other / systemStats.totalWattage) * 100}%` }} className="bg-neutral-500" />
                </div>
                <div className="flex justify-between text-[9px] font-bold uppercase text-neutral-400">
                  <span className="text-blue-500">CPU: {systemStats.powerBreakdown?.cpu || 0}W</span>
                  <span className="text-emerald-500">GPU: {systemStats.powerBreakdown?.gpu || 0}W</span>
                  <span className="text-neutral-500">Other: {systemStats.powerBreakdown?.other || 0}W</span>
                </div>
              </div>
            )}

            <div className="mb-6">
               <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-3 block">1440p Gaming Performance</span>
               {!canRunBenchmarks ? (
                 <div className={`p-4 text-center rounded-lg border border-dashed ${viewerBg === 'dark' ? 'border-neutral-700 text-neutral-500' : 'border-neutral-300 text-neutral-400'}`}>
                   <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Core Parts</span>
                   <p className="text-[9px] mt-1">Select CPU and Motherboard to estimate performance.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   <div>
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                       <span className="text-neutral-400">Cyberpunk 2077</span>
                       <span className="text-emerald-400">{systemStats.fps?.cyberpunk || 0} FPS</span>
                     </div>
                     <div className={`h-1.5 w-full rounded-full overflow-hidden ${viewerBg === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                       <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(((systemStats.fps?.cyberpunk || 0) / 240) * 100, 100)}%` }} className="h-full bg-emerald-500 rounded-full" transition={{ duration: 1 }} />
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                       <span className="text-neutral-400">Counter-Strike 2</span>
                       <span className="text-emerald-400">{systemStats.fps?.cs2 || 0} FPS</span>
                     </div>
                     <div className={`h-1.5 w-full rounded-full overflow-hidden ${viewerBg === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                       <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(((systemStats.fps?.cs2 || 0) / 400) * 100, 100)}%` }} className="h-full bg-emerald-500 rounded-full" transition={{ duration: 1, delay: 0.1 }} />
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                       <span className="text-neutral-400">CoD: Warzone</span>
                       <span className="text-emerald-400">{systemStats.fps?.warzone || 0} FPS</span>
                     </div>
                     <div className={`h-1.5 w-full rounded-full overflow-hidden ${viewerBg === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                       <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(((systemStats.fps?.warzone || 0) / 240) * 100, 100)}%` }} className="h-full bg-emerald-500 rounded-full" transition={{ duration: 1, delay: 0.2 }} />
                     </div>
                   </div>
                 </div>
               )}
            </div>

            {canRunBenchmarks && (
              <div className="mb-6 pt-4 border-t border-neutral-800">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                   <span className="text-neutral-400">Rendering & Productivity</span>
                   <span className="text-blue-400">{systemStats.workloadScore}/100</span>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${viewerBg === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                   <motion.div initial={{ width: 0 }} animate={{ width: `${systemStats.workloadScore}%` }} className="h-full bg-blue-500 rounded-full" transition={{ duration: 1 }} />
                </div>
              </div>
            )}
          </div>

          {!isOfficialBuild && isAuthenticated && (
            <div className={`p-4 border-t ${viewerBg === 'dark' ? 'border-neutral-800 bg-[#09090b]' : 'border-neutral-200 bg-neutral-100'}`}>
               <button onClick={() => setUi('saveOpen', true)} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] rounded transition-colors">
                 {t.saveCapture || "Save & Capture"}
               </button>
            </div>
          )}
          
          {!isAuthenticated && (
             <div className="p-4 bg-neutral-900 border-t border-neutral-800 text-center">
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest leading-tight">
                  Log in to edit parts & save configurations
                </p>
             </div>
          )}
        </motion.aside>

        {/* ПОВНОЕКРАННИЙ ВИБІР КОРПУСУ (ДЛЯ НОВИХ ЗБІРОК) */}
        <AnimatePresence>
          {!selectedParts.Case && !isOfficialBuild && isAuthenticated && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b]/95 backdrop-blur-xl p-6"
            >
              <div className="text-center mb-12">
                 <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                   {lt.select_canvas}
                 </h2>
                 <p className="text-neutral-400">
                   {lt.canvas_sub}
                 </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                {availableCases.map(caseItem => (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={caseItem.id} 
                    onClick={() => equipPart('Case', caseItem.id)}
                    className="bg-neutral-900 border border-neutral-800 hover:border-blue-500 rounded-3xl p-8 flex flex-col items-center text-center group transition-colors shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="h-40 w-full flex items-center justify-center mb-6 relative">
                      {caseItem.image ? (
                        <img 
                          src={caseItem.image} 
                          alt={caseItem.name} 
                          className="max-h-full max-w-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <Server className={`w-24 h-24 text-neutral-700 group-hover:text-blue-500 transition-colors absolute ${caseItem.image ? 'hidden' : 'block'}`} />
                    </div>

                    <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">{caseItem.name}</h3>
                    <p className="text-neutral-500 text-sm mb-6">{caseItem.description}</p>
                    <div className="mt-auto px-6 py-3 bg-blue-600/10 text-blue-500 font-bold uppercase tracking-widest text-xs rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {lt.select_case}
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <button onClick={() => setCurrentView('dashboard')} className="mt-12 text-xs font-bold text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">
                {t.back || "Go Back"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}