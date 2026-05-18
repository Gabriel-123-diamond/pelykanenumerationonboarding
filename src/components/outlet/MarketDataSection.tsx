import React from 'react';
import { Store } from 'lucide-react';
import type { Outlet } from '../../types';

export const MarketDataSection: React.FC<{ outlet: Outlet }> = ({ outlet }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-8">
    <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.3em] flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center"><Store size={16} className="text-stone-400" /></div>
      Market Intelligence
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
      {[
        { label: 'Current Supplier', value: outlet.currentSupplier },
        { label: 'Avg Daily Sales', value: outlet.avgDailySales },
        { label: 'Best Seller', value: outlet.bestSellingSize },
        { label: 'Peak Sales Time', value: outlet.peakSalesTime },
        { label: 'Buying Price', value: outlet.currentBuyingPrice },
        { label: 'Selling Price', value: outlet.currentSellingPrice },
        { label: 'Customer Type', value: outlet.mainCustomerType },
        { label: 'Storage', value: outlet.storageCondition },
        { label: 'Villa Interest', value: outlet.interestedInVilla },
        { label: 'Snacks/Drinks', value: outlet.sellSnacksDrinks ? 'Yes' : 'No' },
      ].map((item, i) => (
        <div key={i}>
          <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1">{item.label}</p>
          <p className="text-xs font-black text-stone-900 uppercase italic">{item.value || '---'}</p>
        </div>
      ))}
    </div>
  </div>
);
