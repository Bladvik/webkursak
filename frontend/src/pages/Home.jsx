// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore, translations } from '../store/useStore';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language, setLanguage } = useStore();
  const t = translations[language];

  const slides = [
    { id: 1, title: t.slide1Title, subtitle: t.slide1Sub, description: t.slide1Desc, bgGradient: "from-neutral-900 via-black to-black" },
    { id: 2, title: t.slide2Title, subtitle: t.slide2Sub, description: t.slide2Desc, bgGradient: "from-emerald-900/20 via-black to-black" },
    { id: 3, title: t.slide3Title, subtitle: t.slide3Sub, description: t.slide3Desc, bgGradient: "from-blue-900/20 via-black to-black" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1)), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50">
        <div className="text-white font-bold tracking-widest text-sm uppercase">Nexus Systems</div>
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setLanguage(language === 'uk' ? 'en' : 'uk')}
            className="text-xs font-bold px-2 py-1 border border-neutral-700 rounded hover:bg-neutral-800 transition-colors"
          >
            {language === 'uk' ? 'EN' : 'UA'}
          </button>
          <div className="text-neutral-500 text-sm font-light hover:text-white transition-colors cursor-pointer">{t.admin}</div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${slide.bgGradient} ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className={`text-center px-6 max-w-4xl transform transition-transform duration-1000 ${index === currentSlide ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}>
              <span className="text-white/50 font-semibold tracking-widest uppercase text-xs mb-4 block">{slide.subtitle}</span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-tight mb-6">{slide.title}</h1>
              <p className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mx-auto tracking-wide mb-12">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA & Controls */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center">
        <Link to="/configurator" className="group relative inline-flex items-center justify-center px-12 py-5 text-sm uppercase tracking-widest font-bold text-black bg-white transition-all duration-300 hover:bg-neutral-200 hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
          {t.enterConfig}
        </Link>
      </div>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50 flex space-x-3">
        {slides.map((_, index) => (
          <button key={index} onClick={() => setCurrentSlide(index)} className={`w-12 h-1 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-white' : 'bg-neutral-700 hover:bg-neutral-500'}`} />
        ))}
      </div>
    </div>
  );
}