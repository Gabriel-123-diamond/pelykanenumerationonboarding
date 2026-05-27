import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { EvaluationMatrix } from '../../types';

interface Step3Props {
  evaluation: EvaluationMatrix;
  setEvaluation: (evalData: EvaluationMatrix) => void;
  initialEvaluation: EvaluationMatrix;
}

const SCORE_GUIDES: Record<keyof EvaluationMatrix, { label: string; levels: string[] }> = {
  footTraffic: {
    label: 'Foot Traffic',
    levels: ['Very busy', 'Busy', 'Moderate', 'Quiet', 'Very quiet'],
  },
  breadSalesVolume: {
    label: 'Bread Sales Volume',
    levels: ['100+ loaves/day', '51-100 loaves/day', '21-50 loaves/day', '5-20 loaves/day', 'Below 5 loaves/day'],
  },
  paymentReliability: {
    label: 'Payment Reliability',
    levels: ['Always prepaid', 'Pays same day', 'Occasional delay', 'Needs close follow-up', 'High payment risk'],
  },
  routeFit: {
    label: 'Route Fit',
    levels: ['On active route', 'Minor route stretch', 'Manageable detour', 'Difficult detour', 'Not route-ready'],
  },
  storageHygiene: {
    label: 'Storage Hygiene',
    levels: ['Display-ready', 'Clean shelved', 'Acceptable', 'Needs improvement', 'Poor storage'],
  },
  productInterest: {
    label: 'Product Interest',
    levels: ['Strong demand', 'Clear interest', 'Open to trial', 'Low interest', 'Not interested'],
  },
  preOrderReadiness: {
    label: 'Pre-Order Readiness',
    levels: ['Ready to order', 'Needs simple setup', 'Can trial weekly', 'Needs training', 'Not ready to order'],
  },
  growthPotential: {
    label: 'Growth Potential',
    levels: ['High expansion', 'Good upside', 'Stable outlet', 'Limited upside', 'No clear growth'],
  },
};

export const Step3Evaluation: React.FC<Step3Props> = ({ evaluation, setEvaluation, initialEvaluation }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <section className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-amber-100/50">
        <h2 className="text-xs font-black text-stone-400 uppercase tracking-[0.18em] sm:tracking-[0.3em] mb-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <Star size={16} className="text-amber-600" />
          </div>
          Evaluation Matrix
        </h2>
        <div className="space-y-10">
          {(Object.keys(initialEvaluation) as Array<keyof EvaluationMatrix>).map((key) => (
            <div key={key} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
                <label className="text-[10px] font-black text-stone-900 uppercase tracking-widest italic ml-1">
                  {SCORE_GUIDES[key].label}
                </label>
                <span className={cn(
                  "text-[10px] font-black px-4 py-1.5 rounded-xl border tracking-widest uppercase",
                  evaluation[key] <= 2 ? "bg-amber-50 text-amber-700 border-amber-200" :
                  evaluation[key] === 3 ? "bg-stone-50 text-stone-600 border-stone-200" :
                  "bg-orange-50 text-orange-700 border-orange-200"
                )}>
                  {evaluation[key]} - {SCORE_GUIDES[key].levels[evaluation[key] - 1]}
                </span>
              </div>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={evaluation[key]}
                  onChange={(e) => setEvaluation({ ...evaluation, [key]: parseInt(e.target.value) })}
                  className="w-full h-3 bg-stone-100 rounded-full appearance-none cursor-pointer accent-amber-600 border border-stone-200"
                />
                <div className="grid grid-cols-5 gap-1 text-[7px] sm:text-[8px] text-stone-400 font-black uppercase tracking-tight sm:tracking-widest mt-3 px-1">
                  {SCORE_GUIDES[key].levels.map((level, index) => (
                    <div
                      key={level}
                      className={cn(
                        "flex flex-col gap-1",
                        index === 0 ? "items-start text-left" : index === 4 ? "items-end text-right" : "items-center text-center",
                        evaluation[key] === index + 1 && (index <= 1 ? "text-amber-600" : index === 2 ? "text-stone-700" : "text-orange-600")
                      )}
                    >
                      <span>({index + 1})</span>
                      <span className="leading-tight">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
