import React from 'react';

export const TermsAcknowledgment: React.FC = () => {
  const terms = [
    "Orders must be placed before the approved evening or morning cut-off time.",
    "Prepaid outlets must complete payment before delivery is scheduled.",
    "Credit supply must be approved by management before goods leave the bakery.",
    "Returns must be reported the same day with reason and quantity.",
    "Damaged goods due to poor outlet storage will not qualify for return.",
    "Repeated late payment may lead to supply suspension.",
    "Meal Villa may adjust route timing based on logistics efficiency."
  ];

  return (
    <div className="bg-white border border-amber-100/50 rounded-[2.5rem] p-10 mt-10 shadow-xl shadow-stone-200/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
      
      <h3 className="text-xs font-black text-stone-900 mb-8 uppercase tracking-[0.3em] italic">Standard Supply Terms Acknowledgment</h3>
      <ul className="space-y-4 relative z-10">
        {terms.map((term, index) => (
          <li key={index} className="flex items-start gap-4 text-[11px] text-stone-600 leading-relaxed font-bold group">
            <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center text-[10px] font-black text-stone-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
              0{index + 1}
            </span>
            <span className="mt-1">{term}</span>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex items-center gap-5 p-6 bg-stone-950 rounded-[2rem] border border-stone-800 shadow-2xl relative z-10 group cursor-pointer hover:border-amber-600/50 transition-all">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl border-2 border-stone-800 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-amber-600/50">
          <div className="w-4 h-4 bg-amber-600 rounded-lg shadow-[0_0_10px_rgba(217,119,6,0.5)]" />
        </div>
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-loose">
          I confirm that <span className="text-amber-500">all terms</span> above have been explained to and accepted by the <span className="text-white italic">outlet representative</span>.
        </p>
      </div>
    </div>
  );
};
