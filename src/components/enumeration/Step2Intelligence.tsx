import React from 'react';
import { BarChart3, ShoppingBag, Truck, CreditCard } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Outlet } from '../../types';

interface Step2Props {
  formData: Partial<Outlet>;
  setFormData: (data: Partial<Outlet>) => void;
}

const PRODUCTS = [
  'Round Bread',
  'Small Loaf',
  'Family Loaf',
  'Jumbo Loaf',
  'Short Loaf'
];

export const Step2Intelligence: React.FC<Step2Props> = ({ formData, setFormData }) => {
  const toggleProduct = (product: string) => {
    const current = formData.preferredProducts || [];
    const updated = current.includes(product)
      ? current.filter(p => p !== product)
      : [...current, product];
    setFormData({ ...formData, preferredProducts: updated });
  };

  const togglePaymentMethod = (method: string) => {
    const current = formData.paymentMethod || [];
    const updated = current.includes(method)
      ? current.filter(m => m !== method)
      : [...current, method];
    setFormData({ ...formData, paymentMethod: updated });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <section className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-amber-100/50">
        <h2 className="text-xs font-black text-stone-400 uppercase tracking-[0.18em] sm:tracking-[0.3em] mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <BarChart3 size={16} className="text-amber-600" />
          </div>
          Market Intelligence
        </h2>
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Interested in Meal Villa Bread?</label>
            <div className="grid grid-cols-3 gap-2">
              {['Yes', 'No', 'Maybe'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setFormData({ ...formData, interestedInVilla: opt as any })}
                  className={cn(
                    "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                    formData.interestedInVilla === opt ? "bg-amber-600 text-white border-amber-500 shadow-lg" : "bg-stone-50 text-stone-400 border-stone-100"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Current Bread Supplier</label>
            <input
              type="text"
              value={formData.currentSupplier || ''}
              onChange={(e) => setFormData({ ...formData, currentSupplier: e.target.value })}
              className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="For example, Bread Palace"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Average Daily Sales</label>
              <select
                value={formData.avgDailySales || ''}
                onChange={(e) => setFormData({ ...formData, avgDailySales: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
              >
                <option value="">Select Range</option>
                <option>0 - 10 Loaves</option>
                <option>11 - 30 Loaves</option>
                <option>31 - 50 Loaves</option>
                <option>51 - 100 Loaves</option>
                <option>100+ Loaves</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Best Selling Size</label>
              <select
                value={formData.bestSellingSize || ''}
                onChange={(e) => setFormData({ ...formData, bestSellingSize: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
              >
                <option value="">Select Size</option>
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Peak Sales Time</label>
              <select
                value={formData.peakSalesTime || ''}
                onChange={(e) => setFormData({ ...formData, peakSalesTime: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
              >
                <option value="">Select Time</option>
                <option>Early Morning (6:00 in the morning to 9:00 in the morning)</option>
                <option>Mid Morning (9:00 in the morning to 12:00 noon)</option>
                <option>Afternoon (12:00 noon to 4:00 in the afternoon)</option>
                <option>Evening (4:00 in the afternoon to 8:00 in the evening)</option>
                <option>Late Night (8:00 in the evening and later)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Main Customer Type</label>
              <select
                value={formData.mainCustomerType || ''}
                onChange={(e) => setFormData({ ...formData, mainCustomerType: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
              >
                <option value="">Select Type</option>
                <option>Commuters</option>
                <option>Families</option>
                <option>Students</option>
                <option>Workers</option>
                <option>General Public</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Buying / Selling Price (Naira, Optional)</label>
              <div className="flex gap-2">
                <div className="relative w-1/2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-amber-600">&#8358;</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.currentBuyingPrice || ''}
                    onChange={(e) => setFormData({ ...formData, currentBuyingPrice: e.target.value.replace(/[^\d,]/g, '') })}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-9 pr-3 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Buy"
                  />
                </div>
                <div className="relative w-1/2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-amber-600">&#8358;</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.currentSellingPrice || ''}
                    onChange={(e) => setFormData({ ...formData, currentSellingPrice: e.target.value.replace(/[^\d,]/g, '') })}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-9 pr-3 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Sell"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Storage Condition</label>
              <select
                value={formData.storageCondition}
                onChange={(e) => setFormData({ ...formData, storageCondition: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
              >
                <option>Excellent/Hygiene Showcase</option>
                <option>Good/Shelved</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 p-4 sm:p-6 bg-stone-50 rounded-[2rem] border border-stone-100 group cursor-pointer" onClick={() => setFormData({ ...formData, sellSnacksDrinks: !formData.sellSnacksDrinks })}>
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                formData.sellSnacksDrinks ? "bg-amber-600 text-white shadow-lg" : "bg-white text-stone-400 border border-stone-100"
              )}>
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-stone-900 uppercase tracking-widest">Snacks & Drinks</p>
                <p className="text-[9px] text-stone-400 font-bold uppercase mt-1">Does the outlet sell these items?</p>
              </div>
            </div>
            <div className={cn(
              "w-12 h-6 rounded-full p-1 transition-all duration-300",
              formData.sellSnacksDrinks ? "bg-amber-600" : "bg-stone-200"
            )}>
              <div className={cn(
                "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform",
                formData.sellSnacksDrinks ? "translate-x-6" : "translate-x-0"
              )} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-amber-100/50">
        <h2 className="text-xs font-black text-stone-400 uppercase tracking-[0.18em] sm:tracking-[0.3em] mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <Truck size={16} className="text-amber-600" />
          </div>
          Meal Villa Interest
        </h2>
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1 italic">Preferred Product Selection (Click all that applies)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRODUCTS.map(product => (
                <button
                  key={product}
                  onClick={() => toggleProduct(product)}
                  className={cn(
                    "px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-tighter border transition-all text-left flex items-center justify-between",
                    formData.preferredProducts?.includes(product)
                      ? "bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-900/20"
                      : "bg-stone-50 text-stone-600 border-stone-100 hover:border-amber-400"
                  )}
                >
                  {product}
                  {formData.preferredProducts?.includes(product) && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Expected Daily Quantity</label>
              <select
                value={formData.expectedDailyQuantity || ''}
                onChange={(e) => setFormData({ ...formData, expectedDailyQuantity: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
              >
                <option value="">Select Quantity</option>
                {['5-10', '10-20', '20-50', '50-100', '100+'].map(q => <option key={q} value={q}>{q} Loaves</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Preferred Delivery Time</label>
              <select
                value={formData.preferredDeliveryTime || ''}
                onChange={(e) => setFormData({ ...formData, preferredDeliveryTime: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
              >
                <option value="">Select Time</option>
                <option>Early Morning (6:00 in the morning)</option>
                <option>Morning (8:00 in the morning)</option>
                <option>Midday (12:00 noon)</option>
                <option>Afternoon (3:00 in the afternoon)</option>
                <option>Evening (6:00 in the evening)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-amber-100/50">
        <h2 className="text-xs font-black text-stone-400 uppercase tracking-[0.18em] sm:tracking-[0.3em] mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <CreditCard size={16} className="text-amber-600" />
          </div>
          Logistics & Terms
        </h2>
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Payment Method (Multi-select)</label>
              <div className="grid grid-cols-3 gap-2">
                {['Transfer', 'Cash', 'POS'].map(method => (
                  <button
                    key={method}
                    onClick={() => togglePaymentMethod(method)}
                    className={cn(
                      "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      formData.paymentMethod?.includes(method) ? "bg-stone-950 text-white border-stone-950 shadow-xl" : "bg-stone-50 text-stone-400 border-stone-100"
                    )}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Pre-Order Cycle</label>
              <div className="grid grid-cols-3 gap-2">
                {['Morning', 'Afternoon', 'Evening'].map(cycle => (
                  <button
                    key={cycle}
                    onClick={() => setFormData({ ...formData, preOrderCycle: cycle as any })}
                    className={cn(
                      "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      formData.preOrderCycle === cycle ? "bg-stone-950 text-white border-stone-950 shadow-xl" : "bg-stone-50 text-stone-400 border-stone-100"
                    )}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Delivery Cycle</label>
              <div className="grid grid-cols-3 gap-2">
                {['Morning', 'Afternoon', 'Evening'].map(cycle => (
                  <button
                    key={cycle}
                    onClick={() => setFormData({ ...formData, deliveryCycle: cycle as any })}
                    className={cn(
                      "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      formData.deliveryCycle === cycle ? "bg-stone-950 text-white border-stone-950 shadow-xl" : "bg-stone-50 text-stone-400 border-stone-100"
                    )}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Pay Before Delivery?</label>
              <select
                value={formData.canPayBeforeDelivery}
                onChange={(e) => setFormData({ ...formData, canPayBeforeDelivery: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none"
              >
                <option>Yes</option>
                <option>No</option>
                <option>Pay on delivery</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Credit Request (Naira, if any)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-black text-amber-600">&#8358;</span>
              <input
                type="text"
                inputMode="numeric"
                value={formData.creditRequestDetails || ''}
                onChange={(e) => setFormData({ ...formData, creditRequestDetails: e.target.value.replace(/[^\d,]/g, '') })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-10 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="50,000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Special Requirements</label>
            <textarea
              value={formData.specialRequirements || ''}
              onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
              className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 h-24 resize-none"
              placeholder="Any other logistics or operational notes..."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

