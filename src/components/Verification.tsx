import React from 'react';
import type { OnboardingChecklist } from '../types';
import { cn } from '../lib/utils';

interface VerificationProps {
  checklist: OnboardingChecklist;
  onChange: (key: keyof OnboardingChecklist, value: boolean) => void;
}

const CHECKLIST_ITEMS: { key: keyof OnboardingChecklist; label: string }[] = [
  { key: 'detailsVerified', label: 'Outlet details verified' },
  { key: 'contactConfirmed', label: 'Contact person confirmed' },
  { key: 'classApproved', label: 'Outlet class approved' },
  { key: 'routeAssigned', label: 'Route assigned' },
  { key: 'productListExplained', label: 'Product list explained' },
  { key: 'priceListExplained', label: 'Price list explained' },
  { key: 'cutoffTimeExplained', label: 'Order cut-off time explained' },
  { key: 'paymentRuleExplained', label: 'Payment rule explained' },
  { key: 'creditStatusConfirmed', label: 'Credit approval status confirmed' },
  { key: 'deliveryTimeAgreed', label: 'Delivery time agreed' },
  { key: 'returnPolicyExplained', label: 'Return policy explained' },
  { key: 'complaintChannelShared', label: 'Complaint channel shared' },
  { key: 'addedToActiveList', label: 'Outlet added to active customer list' },
];

export const Verification: React.FC<VerificationProps> = ({ checklist, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 bg-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-amber-100/50">
      {CHECKLIST_ITEMS.map((item) => (
        <div
          key={item.key}
          className={cn(
            "flex items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group",
            checklist[item.key] 
              ? "bg-amber-50 border-amber-200" 
              : "bg-stone-50 border-stone-100 hover:border-amber-400 hover:bg-white"
          )}
          onClick={() => onChange(item.key, !checklist[item.key])}
        >
          <span className={cn(
            "text-[10px] sm:text-[11px] font-black uppercase tracking-tight italic transition-colors",
            checklist[item.key] ? "text-amber-700" : "text-stone-600 group-hover:text-stone-950"
          )}>
            {item.label}
          </span>
          <div
            className={cn(
              "w-12 h-7 flex items-center rounded-full p-1.5 transition-all duration-500 shrink-0",
              checklist[item.key] ? "bg-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.3)]" : "bg-stone-200 group-hover:bg-stone-300"
            )}
          >
            <div
              className={cn(
                "bg-white w-4 h-4 rounded-full shadow-lg transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)",
                checklist[item.key] ? "translate-x-5" : "translate-x-0"
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
