import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Step4Props {
  recommendedClass: string;
  total: number;
  handleSubmit: () => void;
  loading: boolean;
}

export const Step4Review: React.FC<Step4Props> = ({
  recommendedClass, total, handleSubmit, loading
}) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div className="bg-stone-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-stone-800">
        <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
          <CheckCircle2 size={160} />
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl" />
        
        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4">Algorithmic Assessment</p>
        <h2 className="text-6xl font-black mb-10 tracking-tighter italic">Grade {recommendedClass}</h2>
        
        <div className="grid grid-cols-2 gap-8 relative z-10">
          <div>
            <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2">Aggregate Score</p>
            <p className="text-3xl font-black text-white italic">{total}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2">System Verdict</p>
            <p className={cn(
              "text-xl font-black uppercase tracking-tight",
              ['A', 'B'].includes(recommendedClass) ? "text-amber-500" : 
              recommendedClass === 'C' ? "text-amber-500/80" : "text-stone-500"
            )}>
              {recommendedClass === 'A' ? "High Volume Target" : 
               recommendedClass === 'B' ? "Stable Daily Sales" :
               recommendedClass === 'C' ? "Growth Potential" :
               recommendedClass === 'D' ? "Weak Demand / Decline" : "Management Review"}
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 gap-4">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
            <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2 italic">Class Definition & Action</p>
            <p className="text-[11px] font-bold text-stone-300 leading-relaxed">
              {recommendedClass === 'A' ? "Strong supermarket or high-volume provision store. Target 30 to 100 plus loaves daily. May qualify for approved short credit." : 
               recommendedClass === 'B' ? "Medium volume shop with stable daily sales. Target 10 to 30 loaves daily. Prepaid or one-day approved credit." :
               recommendedClass === 'C' ? "Small shop with growth potential. Target 5 to 10 loaves daily. Strictly prepaid." :
               recommendedClass === 'D' ? "Poor location, weak demand, poor storage, or low interest. Do not supply until improved." : 
               "Payment delays, high returns, complaints, or repeated order failures. Management review required."}
            </p>
          </div>
        </div>
      </div>

      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-amber-100/50">
        <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-6">Final Attestation</h3>
        <div className="space-y-6">
          <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100 italic text-stone-700 text-xs font-bold leading-relaxed">
            "I hereby verify that all data points captured in this enumeration are accurate and reflect the true operational status of the outlet."
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-stone-950 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-amber-900/20 active:scale-95 disabled:bg-stone-200"
          >
            {loading ? "Transmitting..." : "Finalize Enumeration"}
          </button>
        </div>
      </section>
    </div>
  );
};
