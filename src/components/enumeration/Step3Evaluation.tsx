import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { EvaluationMatrix } from '../../types';

interface Step3Props {
  evaluation: EvaluationMatrix;
  setEvaluation: (evalData: EvaluationMatrix) => void;
  initialEvaluation: EvaluationMatrix;
}

export const Step3Evaluation: React.FC<Step3Props> = ({ evaluation, setEvaluation, initialEvaluation }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-amber-100/50">
        <h2 className="text-xs font-black text-stone-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <Star size={16} className="text-amber-600" />
          </div>
          Evaluation Matrix (1=Best)
        </h2>
        <div className="space-y-10">
          {Object.keys(initialEvaluation).map((key) => (
            <div key={key} className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-stone-900 uppercase tracking-widest italic ml-1">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                <span className={cn(
                  "text-[10px] font-black px-4 py-1.5 rounded-xl border tracking-widest uppercase",
                  evaluation[key as keyof EvaluationMatrix] <= 2 ? "bg-amber-50 text-amber-700 border-amber-200" :
                  evaluation[key as keyof EvaluationMatrix] === 3 ? "bg-stone-50 text-stone-600 border-stone-200" :
                  "bg-orange-50 text-orange-700 border-orange-200"
                )}>
                  Point: {evaluation[key as keyof EvaluationMatrix]}
                </span>
              </div>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={evaluation[key as keyof EvaluationMatrix]}
                  onChange={(e) => setEvaluation({ ...evaluation, [key]: parseInt(e.target.value) })}
                  className="w-full h-3 bg-stone-100 rounded-full appearance-none cursor-pointer accent-amber-600 border border-stone-200"
                />
                <div className="flex justify-between text-[8px] text-stone-400 font-black uppercase tracking-widest mt-3 px-1">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-amber-600">High Grade (1)</span>
                    <span className="text-[7px] opacity-50">Excellent</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span>(2)</span>
                    <span className="text-[7px] opacity-50">Good</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span>(3)</span>
                    <span className="text-[7px] opacity-50">Average</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span>(4)</span>
                    <span className="text-[7px] opacity-50">Below Avg</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-orange-600">Low Grade (5)</span>
                    <span className="text-[7px] opacity-50">Poor</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
