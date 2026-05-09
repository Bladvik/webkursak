import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, CloudUpload, Zap, DollarSign, CheckCircle2, Copy } from 'lucide-react';
import api from '../../api/axios';
import { useStore, translations } from '../../store/useStore';

export default function SaveBuildModal() {
  const { 
    ui, setUi, currentBuildId, systemStats, viewerBg, language, 
    setCurrentView, loadConfiguration 
  } = useStore();
  
  const [saveMode, setSaveMode] = useState(currentBuildId ? 'update' : 'new');
  const [buildName, setBuildName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = translations[language] || translations['en'];

  // Скидаємо стан при відкритті
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

  // Функція для захоплення екрану (Screenshot)
  const captureScreenshot = () => {
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        return canvas.toDataURL('image/jpeg', 0.6); 
      }
    } catch (err) {
      console.warn("Could not capture 3D snapshot", err);
    }
    return null;
  };

  const handleSaveClick = async () => {
    if (saveMode === 'new' && !buildName.trim()) return;
    setIsSaving(true);

    try {
      // 1. Робимо знімок 3D сцени
      const thumbnailDataUrl = captureScreenshot();

      // 2. Формуємо дані
      const payload = {
        name: saveMode === 'new' ? buildName : (useStore.getState().catalog.find(p => p.id === currentBuildId)?.name || 'Updated Build'),
        selectedParts: useStore.getState().selectedParts,
        partColors: useStore.getState().partColors,
        thumbnailUrl: thumbnailDataUrl,
        // Додаємо налаштування світла
        rgbEnabled: useStore.getState().rgbEnabled,
        rgbSync: useStore.getState().rgbSync,
        baseSync: useStore.getState().baseSync,
        globalRgbColor: useStore.getState().globalRgbColor,
        globalBaseColor: useStore.getState().globalBaseColor,
        updatedAt: new Date().toISOString()
      };

      // 3. Відправляємо на сервер
      if (saveMode === 'new') {
        const response = await api.post('/configs', payload);
        // Оновлюємо ID в сторі, щоб наступне збереження було як "update"
        loadConfiguration(response.data); 
      } else {
        await api.put(`/configs/${currentBuildId}`, payload);
      }

      setIsSaving(false);
      setIsSuccess(true);
      
      // 4. Закриваємо та переходимо в дашборд через секунду
      setTimeout(() => {
        handleClose();
        setCurrentView('dashboard');
      }, 1000);

    } catch (error) {
      console.error("❌ Save failed:", error);
      alert("Failed to save configuration.");
      setIsSaving(false);
    }
  };

  const isDark = viewerBg === 'dark';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={handleClose} 
          className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.9, y: 20 }} 
          className={`relative w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl ${isDark ? 'bg-[#09090b] border-neutral-800 shadow-black/50' : 'bg-white border-neutral-200 shadow-neutral-300/50'}`}
        >
          {/* Header */}
          <div className={`px-6 py-5 border-b flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                <CloudUpload className="w-5 h-5" />
              </div>
              <h2 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {saveMode === 'update' ? 'Update Blueprint' : 'Save Blueprint'}
              </h2>
            </div>
            <button onClick={handleClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'}`}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            {/* Stats Summary */}
            <div className={`flex items-center justify-between p-3 rounded-lg border mb-6 ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <div>
                  <div className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">Power</div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>{systemStats?.totalWattage || 0}W</div>
                </div>
              </div>
              <div className={`h-8 w-px ${isDark ? 'bg-neutral-800' : 'bg-neutral-300'}`}></div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">Price</div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>${systemStats?.totalPrice || 0}</div>
                </div>
              </div>
            </div>

            {/* Mode Switcher if editing */}
            {currentBuildId && (
              <div className="flex gap-2 mb-6">
                <button 
                  onClick={() => setSaveMode('update')} 
                  className={`flex-1 py-2.5 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all ${saveMode === 'update' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'border-neutral-700 text-neutral-500 hover:text-neutral-300'}`}
                >
                  <Save className="w-3.5 h-3.5" /> Overwrite
                </button>
                <button 
                  onClick={() => setSaveMode('new')} 
                  className={`flex-1 py-2.5 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all ${saveMode === 'new' ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'border-neutral-700 text-neutral-500 hover:text-neutral-300'}`}
                >
                  <Copy className="w-3.5 h-3.5" /> Save New
                </button>
              </div>
            )}

            {/* Input for Name */}
            {saveMode === 'new' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Blueprint Name</label>
                <input 
                  type="text" 
                  value={buildName} 
                  onChange={(e) => setBuildName(e.target.value)}
                  placeholder="e.g. Project Nightshade" 
                  className={`w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-all shadow-inner`}
                />
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          <div className={`p-4 border-t flex justify-end gap-3 ${isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
            <button onClick={handleClose} className="px-4 py-2 text-xs font-bold uppercase text-neutral-500 hover:text-white transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleSaveClick} 
              disabled={isSaving || (saveMode === 'new' && !buildName.trim())}
              className={`px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-white transition-all flex items-center gap-2 ${isSuccess ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'} disabled:opacity-50 shadow-lg shadow-blue-600/20`}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSuccess ? (
                <><CheckCircle2 className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> Save & Capture</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}