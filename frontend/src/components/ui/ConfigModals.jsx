import api from '../../api/axios';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, CloudUpload, Zap, DollarSign, CheckCircle2, Copy } from 'lucide-react';
import { useStore, translations } from '../../store/useStore';

export default function SaveBuildModal() {
  const { 
    ui, setUi, currentBuildId, systemStats, viewerBg, language, 
    saveCurrentBuild, updateCurrentBuild, setCurrentView 
  } = useStore();
  
  const [saveMode, setSaveMode] = useState(currentBuildId ? 'update' : 'new');
  const [buildName, setBuildName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = translations[language] || translations['en'];

  useEffect(() => {
    if (ui.saveOpen) {
      setSaveMode(currentBuildId ? 'update' : 'new');
      setBuildName('');
      setIsSuccess(false);
      setIsSaving(false);
    }
  }, [ui.saveOpen, currentBuildId]);

  if (!ui.saveOpen) return null;

  const handleClose = () => setUi('saveOpen', false);

  const handleSaveClick = async () => {
    if (saveMode === 'new' && !buildName.trim()) return;
    setIsSaving(true);

    try {
      // 📸 РОБИМО СКРІНШОТ ПЕРЕД ЗБЕРЕЖЕННЯМ!
      let generatedThumbnail = null;
      if (typeof window.forceStandardScreenshot === 'function') {
        generatedThumbnail = window.forceStandardScreenshot();
        console.log("📸 Скріншот успішно зроблено!");
      } else {
        console.warn("⚠️ Функція скріншоту не знайдена.");
      }

      // 1. Формуємо дані для бази (ТЕПЕР ІЗ ФОТО)
      const payload = {
        name: buildName || 'My Custom Build',
        selectedParts: useStore.getState().selectedParts,
        partColors: useStore.getState().partColors,
        stats: useStore.getState().systemStats,
        thumbnailUrl: generatedThumbnail, // <--- ДОДАЛИ ФОТО СЮДИ!
        // --- ДОДАЄМО НАЛАШТУВАННЯ AURA STUDIO СЮДИ ---
        rgbEnabled: useStore.getState().rgbEnabled,
        rgbSync: useStore.getState().rgbSync,
        baseSync: useStore.getState().baseSync,
        globalRgbColor: useStore.getState().globalRgbColor,
        globalBaseColor: useStore.getState().globalBaseColor,
        updatedAt: new Date().toISOString()
      };

      // 2. Відправляємо на БЕКЕНД
      if (saveMode === 'new') {
        console.log("Відправляємо нову збірку на сервер...");
        await api.post('/configs', payload);
      } else if (saveMode === 'update') {
        console.log(`Оновлюємо збірку ${currentBuildId} на сервері...`);
        await api.put(`/configs/${currentBuildId}`, payload); 
      }

      setIsSaving(false);
      setIsSuccess(true);
      
      // 3. Переходимо в дашборд
      setTimeout(() => {
        handleClose();
        setCurrentView('dashboard');
      }, 1000);

    } catch (error) {
      console.error("❌ Помилка при збереженні в базу даних:", error);
      setIsSaving(false);
    }
  };

  const isDark = viewerBg === 'dark';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className={`relative w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl ${isDark ? 'bg-[#09090b] border-neutral-800 shadow-black/50' : 'bg-white border-neutral-200 shadow-neutral-300/50'}`}>
          <div className={`px-6 py-5 border-b flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-50 text-blue-600'}`}><CloudUpload className="w-5 h-5" /></div>
              <div><h2 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-neutral-900'}`}>{saveMode === 'update' ? 'Update Configuration' : 'Save New Build'}</h2></div>
            </div>
            <button onClick={handleClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'}`}><X className="w-4 h-4" /></button>
          </div>

          <div className="p-6">
            <div className={`flex items-center justify-between p-3 rounded-lg border mb-6 ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /><div><div className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Est. Power</div><div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>{systemStats?.totalWattage || 0}W</div></div></div>
              <div className={`h-8 w-px ${isDark ? 'bg-neutral-800' : 'bg-neutral-300'}`}></div>
              <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500" /><div><div className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Perf. Score</div><div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>{systemStats?.performanceScore || 0}/100</div></div></div>
            </div>

            {currentBuildId && (
              <div className="flex gap-2 mb-6">
                <button onClick={() => setSaveMode('update')} className={`flex-1 py-2.5 px-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-colors ${saveMode === 'update' ? 'bg-blue-600 border-blue-500 text-white' : (isDark ? 'bg-transparent border-neutral-700 text-neutral-400' : 'bg-transparent border-neutral-300 text-neutral-600')}`}><Save className="w-3.5 h-3.5" /> Overwrite</button>
                <button onClick={() => setSaveMode('new')} className={`flex-1 py-2.5 px-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-colors ${saveMode === 'new' ? 'bg-emerald-600 border-emerald-500 text-white' : (isDark ? 'bg-transparent border-neutral-700 text-neutral-400' : 'bg-transparent border-neutral-300 text-neutral-600')}`}><Copy className="w-3.5 h-3.5" /> Save as New</button>
              </div>
            )}

            <AnimatePresence>
              {saveMode === 'new' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Configuration Name</label>
                  <input type="text" placeholder="e.g. My Dream Workstation" value={buildName} onChange={(e) => setBuildName(e.target.value)} className={`w-full h-12 px-4 rounded-lg border outline-none text-sm transition-all focus:ring-2 focus:ring-blue-500/50 ${isDark ? 'bg-black border-neutral-800 text-white placeholder:text-neutral-600' : 'bg-white border-neutral-300 text-black placeholder:text-neutral-400'}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={`p-4 border-t flex justify-end gap-3 ${isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
            <button onClick={handleClose} className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'}`}>Cancel</button>
            <button onClick={handleSaveClick} disabled={isSaving || isSuccess || (saveMode === 'new' && !buildName.trim())} className={`relative px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-white transition-all overflow-hidden ${isSuccess ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'} disabled:opacity-50`}>
              <span className={`flex items-center gap-2 transition-opacity ${isSaving ? 'opacity-0' : 'opacity-100'}`}>{isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}{isSuccess ? 'Saved!' : 'Confirm'}</span>
              {isSaving && <div className="absolute inset-0 flex items-center justify-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}