// src/components/layout/Sidebar.jsx
import { useEffect } from 'react';
import { useStore, translations } from '../../store/useStore';

export default function Sidebar() {
  const { 
    catalog, searchQuery, sortOption, categoryFilter, 
    language, partColors, focusedPartType,
    setSearchQuery, setSortOption, setCategoryFilter, 
    setPartColor, setFanInSlot,
    selectedParts, equipPart
  } = useStore();

  const t = translations[language];

  // Auto-scroll to the clicked 3D component
  useEffect(() => {
    if (focusedPartType) {
      const el = document.getElementById(`equipped-part-${focusedPartType}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusedPartType]);

const filteredCatalog = catalog.filter((item) => {
    const matchesCategory = categoryFilter === 'All' || item.type === categoryFilter;
    // БЕЗПЕЧНИЙ ПОШУК: шукаємо по імені та полях сумісності
    const searchableText = `${item.name} ${Object.values(item.compatibility || {}).join(' ')}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedAndFilteredCatalog = [...filteredCatalog].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
    return 0;
  });

  const categories = ['All', 'Case', 'Motherboard', 'CPU', 'GPU', 'RAM', 'PSU', 'SSD', 'CaseFans'];
  const activeCase = catalog.find(c => c.id === selectedParts.Case);

  return (
    <div className="w-[400px] h-full bg-white border-l border-gray-200 flex flex-col shadow-lg z-20">
      <div className="p-5 border-b border-gray-200 space-y-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{t.configTitle|| 'Loading...'}</h2>
          <span className="text-[10px] text-gray-400 font-bold uppercase px-2 py-1 bg-gray-200 rounded">{t.clickToFocus}</span>
        </div>
        
        <input 
          type="text" placeholder={t.searchPlaceholder}
          className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex gap-2">
          <select 
            className="flex-1 p-2 border border-gray-300 rounded bg-white text-sm focus:ring-2 focus:ring-blue-500"
            value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">{t.all}</option>
            {categories.slice(1).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select 
            className="flex-1 p-2 border border-gray-300 rounded bg-white text-sm focus:ring-2 focus:ring-blue-500"
            value={sortOption} onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="price-asc">{t.lowestPrice}</option>
            <option value="price-desc">{t.highestPrice}</option>
            <option value="name-asc">{t.az}</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
        {sortedAndFilteredCatalog.map((item) => {
          const isFan = item.type === 'CaseFans';
          let isEquipped = false;
          
          if (isFan) {
            isEquipped = Object.values(selectedParts.CaseFans).includes(item.id);
          } else {
            isEquipped = selectedParts[item.type] === item.id;
          }

          const currentColors = partColors[item.type] || { base: '#ffffff', rgb: '#000000' };
          const isFocused = focusedPartType === item.type;

          return (
            <div 
              key={item.id} 
              id={isEquipped ? `equipped-part-${item.type}` : undefined}
              className={`p-4 border rounded-xl transition-all duration-300 ${isFocused ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' : ''} ${isEquipped ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200 bg-white'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                <span className="text-gray-900 font-bold ml-2">${item.price}</span>
              </div>
              
              <div className="text-xs text-gray-500 mb-4 flex flex-wrap gap-1.5">
                <span className="bg-gray-100 px-2 py-1 rounded-md font-medium text-gray-700">{item.type}</span>
               {Object.entries(item.compatibility || {}).map(([key, val]) => (
                  <span key={key} className="bg-gray-100 px-2 py-1 rounded-md">{val}</span>
                ))}
              </div>
              
              {/* Conditional Action Buttons: Normal vs Slots */}
              {!isFan ? (
                <button 
                  onClick={() => equipPart(item.type, item.id)}
                  className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${
                    isEquipped ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {isEquipped ? t.removePart : t.equipPart}
                </button>
              ) : (
                <div className="space-y-2 mt-3 pt-3 border-t border-gray-200">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{t.availableSlots}</p>
                  {activeCase?.fanSlots && Object.keys(activeCase.fanSlots).map(slotName => {
                    const isSlotEquippedWithThisFan = selectedParts.CaseFans[slotName] === item.id;
                    return (
                      <button 
                        key={slotName}
                        onClick={() => setFanInSlot(slotName, item.id)}
                        className={`w-full py-2 rounded-md text-xs font-bold transition-all border ${
                          isSlotEquippedWithThisFan ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {isSlotEquippedWithThisFan ? `${t.removeFromSlot} ${slotName}` : `${t.equipToSlot} ${slotName}`}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Color Controls (Only appears if equipped) */}
              {isEquipped && (
                <div className="mt-4 pt-4 border-t border-blue-200 grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t.baseColorLabel}</span>
                      {currentColors.base && (
                        <button onClick={() => setPartColor(item.type, 'base', null)} className="text-[9px] text-red-500 hover:text-red-700 font-bold uppercase transition-colors">{t.clearBase}</button>
                      )}
                    </div>
                    <input type="color" value={currentColors.base || '#ffffff'} onChange={(e) => setPartColor(item.type, 'base', e.target.value)} className="w-full h-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t.rgbLabel}</span>
                      {currentColors.rgb && (
                        <button onClick={() => setPartColor(item.type, 'rgb', null)} className="text-[9px] text-red-500 hover:text-red-700 font-bold uppercase transition-colors">{t.clearRgb}</button>
                      )}
                    </div>
                    <input type="color" value={currentColors.rgb || '#000000'} onChange={(e) => setPartColor(item.type, 'rgb', e.target.value)} className="w-full h-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}