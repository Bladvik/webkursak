import React from 'react';
import { useStore } from '../../store/useStore';

export default function StatsOverlay() {
  const { systemStats, compatibilityIssues } = useStore();
  const { totalWattage, performanceScore, estimatedTemp, bottleneckAlert, fps } = systemStats;

  // Color Coding Performance
  let scoreColor = 'text-red-500';
  let scoreBg = 'bg-red-500';
  if (performanceScore >= 80) { scoreColor = 'text-emerald-500'; scoreBg = 'bg-emerald-500'; } 
  else if (performanceScore >= 50) { scoreColor = 'text-yellow-500'; scoreBg = 'bg-yellow-500'; }

  // Color Coding Temps
  let tempColor = 'text-emerald-500';
  let tempBg = 'bg-emerald-500/20';
  if (estimatedTemp >= 80) { tempColor = 'text-red-500'; tempBg = 'bg-red-500/20'; } 
  else if (estimatedTemp >= 60) { tempColor = 'text-yellow-500'; tempBg = 'bg-yellow-500/20'; }

  return (
    <div className="absolute top-20 left-6 z-40 w-80 max-h-[80vh] bg-neutral-900/90 backdrop-blur-md border border-neutral-700 rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent transition-all duration-300">
      
      <div className="bg-black/50 px-5 py-3 border-b border-neutral-800 sticky top-0 z-10">
        <h3 className="text-white font-bold text-xs tracking-widest uppercase">System Diagnostics</h3>
      </div>

      <div className="p-5 flex flex-col gap-6">
        
        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">Perf. Score</span>
            <span className={`text-2xl font-black leading-none ${scoreColor}`}>{performanceScore}</span>
            <div className="w-full h-1 bg-neutral-800 rounded-full mt-2 overflow-hidden">
              <div className={`h-full ${scoreBg} transition-all duration-700`} style={{ width: `${performanceScore}%` }} />
            </div>
          </div>
          
          <div className="bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">Est. Power</span>
            <span className="text-2xl font-bold text-white leading-none">{totalWattage} <span className="text-xs text-neutral-500">W</span></span>
          </div>

          <div className={`col-span-2 p-3 rounded-lg border border-neutral-700 ${tempBg} transition-colors duration-500`}>
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Thermal Dynamics (Load)</span>
              <span className={`text-xl font-black leading-none ${tempColor}`}>{estimatedTemp}°C</span>
            </div>
          </div>
        </div>

        {/* Bottleneck Alert */}
        {bottleneckAlert && (
          <div className="bg-orange-950/40 border border-orange-500/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-orange-500 text-sm">⚠️</span>
              <h4 className="text-orange-500 font-bold text-[10px] uppercase tracking-wider">Bottleneck Detected</h4>
            </div>
            <p className="text-xs text-orange-200/80 leading-snug">{bottleneckAlert}</p>
          </div>
        )}

        {/* FPS Estimator */}
        <div>
          <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-3">Estimated FPS (1440p High)</h4>
          <div className="space-y-3">
            {[
              { game: 'CS2 / Valorant', fps: fps?.cs2 || 0, color: 'bg-orange-500', max: 550 },
              { game: 'Call of Duty: Warzone', fps: fps?.warzone || 0, color: 'bg-blue-500', max: 160 },
              { game: 'GTA V', fps: fps?.gta || 0, color: 'bg-green-500', max: 210 },
              { game: 'Cyberpunk 2077', fps: fps?.cyberpunk || 0, color: 'bg-yellow-400', max: 110 }
            ].map((est, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between text-xs font-bold text-white mb-1.5">
                  <span>{est.game}</span>
                  <span className={est.fps === 0 ? 'text-red-500' : ''}>{est.fps === 0 ? 'N/A' : `${est.fps} FPS`}</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className={`h-full ${est.color} transition-all duration-1000 ease-out`} style={{ width: `${Math.min((est.fps / est.max) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stress Test Button */}
        <button 
          className="w-full py-3 bg-neutral-800 border border-neutral-600 hover:border-blue-500 text-white font-bold rounded-lg text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          onClick={() => alert("Stress Test Module initializing in Phase 10...")}
        >
          <span>Run Benchmark</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </button>

      </div>

      {/* Critical Errors */}
      {compatibilityIssues.length > 0 && (
        <div className="bg-red-950/80 border-t border-red-900/50 p-5 mt-auto">
          <h4 className="text-red-500 font-bold text-[11px] uppercase tracking-wider mb-3">System Warnings</h4>
          <ul className="space-y-2">
            {compatibilityIssues.map((issue, index) => (
              <li key={index} className="text-xs text-red-200 bg-red-900/30 p-2.5 rounded-md border border-red-800/50">{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}