import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon: Icon, color, bg }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-amber-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner", bg)}>
      <Icon className={color} size={28} />
    </div>
    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">{label}</p>
    <p className="text-4xl font-black text-stone-900 tracking-tighter italic">{value}</p>
  </div>
);
