import React, { useState } from 'react';
import { Store, User, MapPin, Calendar, CheckCircle2, Camera, X, XCircle } from 'lucide-react';
import type { Outlet } from '../../types';
import { Verification } from '../Verification';
import { cn } from '../../lib/utils';

interface OnboardingCardProps {
  outlet: Outlet;
  onUpdate: (id: string, data: any) => void;
  onFinalize: (id: string) => void;
  onDecline?: (id: string) => void;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({ outlet, onUpdate, onFinalize, onDecline }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const isFormComplete = () => {
    const checklist = outlet.onboardingChecklist;
    const isChecklistComplete = checklist && 
      Object.values(checklist).every(val => val === true) && 
      Object.keys(checklist).length === 13;
    
    return !!(
      isChecklistComplete &&
      outlet.route?.trim() &&
      outlet.firstSupplyDate &&
      outlet.approvedCreditLimit?.trim() &&
      outlet.physicalDocumentSigned
    );
  };

  return (
    <div className="bg-white rounded-[3rem] p-10 border border-amber-100 shadow-xl hover:shadow-2xl transition-all duration-500 group">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-amber-600 rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform">
                <Store size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tighter italic leading-none">{outlet.name}</h3>
                <div className="flex items-center gap-3 mt-3">
                  <span className="bg-stone-900 text-amber-500 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-stone-800">Grade {outlet.recommendedClass}</span>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12} className="text-amber-600" />{outlet.town}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Field Evidence Photos */}
          {outlet.photoUrls && outlet.photoUrls.length > 0 && (
            <div className="space-y-4">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Camera size={14} className="text-amber-600" /> Field Evidence
              </p>
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {outlet.photoUrls.map((url, i) => (
                  <div 
                    key={i} 
                    onClick={() => setPreviewImage(url)}
                    className="shrink-0 w-32 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img src={url} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
              <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2 italic ml-1">Classification Override</p>
              <select 
                value={outlet.recommendedClass} 
                onChange={(e) => onUpdate(outlet.id, { recommendedClass: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm"
              >
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
                <option value="D">Grade D</option>
                <option value="Watchlist">Watchlist</option>
              </select>
            </div>
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
              <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1">Proprietor</p>
              <p className="text-xs font-black text-stone-700 uppercase italic flex items-center gap-2 truncate">
                <User size={14} className="text-amber-600" />{outlet.ownerName}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100"><p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1">Manager</p><p className="text-xs font-black text-stone-700 uppercase italic truncate">{outlet.contactPerson}</p></div>
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100"><p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1">Field Capture</p><p className="text-xs font-black text-stone-700 uppercase italic flex items-center gap-2"><Calendar size={14} className="text-amber-600" />{outlet.dateVisited ? new Date(outlet.dateVisited).toLocaleDateString() : '---'}</p></div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 ml-1">Logistics Assignment</p>
            <input type="text" placeholder="Assign Delivery Route..." value={outlet.route || ''} onChange={(e) => onUpdate(outlet.id, { route: e.target.value })} className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">First Supply Date</p>
              <input type="date" value={outlet.firstSupplyDate || ''} onChange={(e) => onUpdate(outlet.id, { firstSupplyDate: e.target.value })} className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Approved Credit Limit</p>
              <input type="text" placeholder="e.g. 50,000" value={outlet.approvedCreditLimit || ''} onChange={(e) => onUpdate(outlet.id, { approvedCreditLimit: e.target.value })} className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-stone-50 rounded-[2rem] border border-stone-100 group cursor-pointer" onClick={() => onUpdate(outlet.id, { physicalDocumentSigned: !outlet.physicalDocumentSigned })}>
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                outlet.physicalDocumentSigned ? "bg-amber-600 text-white shadow-lg" : "bg-white text-stone-400 border border-stone-100"
              )}>
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-stone-900 uppercase tracking-widest">Physical Signature</p>
                <p className="text-[9px] text-stone-400 font-bold uppercase mt-1">Has the document been signed?</p>
              </div>
            </div>
            <div className={cn(
              "w-12 h-6 rounded-full p-1 transition-all duration-300",
              outlet.physicalDocumentSigned ? "bg-amber-600" : "bg-stone-200"
            )}>
              <div className={cn(
                "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform",
                outlet.physicalDocumentSigned ? "translate-x-6" : "translate-x-0"
              )} />
            </div>
          </div>
        </div>
        <div className="flex-1 bg-stone-50/50 rounded-[2.5rem] p-8 border border-amber-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12"><CheckCircle2 size={120} /></div>
          <h4 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.2em] mb-8 italic flex items-center gap-2 relative z-10"><div className="w-1.5 h-1.5 rounded-full bg-amber-600" />Verification</h4>
          <Verification checklist={outlet.onboardingChecklist || { detailsVerified: false, contactConfirmed: false, classApproved: false, routeAssigned: false, productListExplained: false, priceListExplained: false, cutoffTimeExplained: false, paymentRuleExplained: false, creditStatusConfirmed: false, deliveryTimeAgreed: false, returnPolicyExplained: false, complaintChannelShared: false, addedToActiveList: false }} onChange={(key, val) => {
            const newChecklist = { ...(outlet.onboardingChecklist || {}), [key]: val };
            onUpdate(outlet.id, { onboardingChecklist: newChecklist });
          }} />
          
          <div className="mt-10 space-y-4">
            <button 
              onClick={() => onFinalize(outlet.id)} 
              disabled={!isFormComplete()}
              className="w-full bg-stone-950 hover:bg-amber-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 relative z-10 disabled:opacity-30 disabled:hover:bg-stone-950 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={16} />
              {isFormComplete() ? "Activate Customer" : "Fill all fields to Activate"}
            </button>
            {onDecline && (
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to decline this customer? This action cannot be undone.")) {
                    onDecline(outlet.id);
                  }
                }}
                className="w-full bg-white hover:bg-red-50 text-red-500 border border-red-100 hover:border-red-200 py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all active:scale-95 flex items-center justify-center gap-3 relative z-10"
              >
                <XCircle size={16} /> Decline Customer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Overlay */}
      {previewImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-xl cursor-zoom-out" onClick={() => setPreviewImage(null)} />
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center pointer-events-none">
            <img src={previewImage} className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl pointer-events-auto" alt="" />
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all pointer-events-auto"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
