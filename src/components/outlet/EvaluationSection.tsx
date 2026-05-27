import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import type { Outlet } from '../../types';

export const EvaluationSection: React.FC<{ outlet: Outlet }> = ({ outlet }) => (
  <div className="bg-stone-950 p-10 rounded-[3rem] text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><CheckCircle2 size={120} /></div>
    <div className="relative z-10 flex flex-col md:flex-row gap-12">
      <div className="flex-1 space-y-8">
        <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] flex items-center gap-3 italic">
          <Star size={14} /> Algorithmic Ranking
        </h3>
        <div className="flex items-end gap-4">
          <p className="text-7xl font-black italic tracking-tighter leading-none">Grade {outlet.recommendedClass || 'Not Available'}</p>
          <div className="pb-1">
            <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Aggregate</p>
            <p className="text-2xl font-black text-amber-500 italic">{outlet.totalScore || 0}</p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest flex items-center gap-2">Executive Review</p>
          <p className="text-sm font-bold text-stone-300 leading-relaxed italic border-l-2 border-amber-600 pl-6 bg-stone-900/50 py-4 rounded-r-2xl">
            {outlet.supervisorReview || "No review notes available."}
          </p>
        </div>
      </div>
      <div className="w-full md:w-64 space-y-4">
        <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-4">Matrix Points</p>
        {outlet.evaluation && Object.entries(outlet.evaluation).map(([key, val]) => (
          <div key={key} className="flex justify-between items-center bg-stone-900/50 p-3 rounded-xl border border-stone-800">
            <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
            <span className="text-xs font-black text-amber-500">{val as number}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
