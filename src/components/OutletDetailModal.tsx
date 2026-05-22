import React, { useState } from 'react';
import { X, MapPin, User, Calendar, Phone, MessageSquare, Clock, Navigation, Zap, Briefcase, FileText, Camera, ShieldCheck, TrendingUp, Info, Star } from 'lucide-react';
import type { Outlet } from '../types';
import { cn } from '../lib/utils';

export const OutletDetailModal: React.FC<{ outlet: Outlet; onClose: () => void }> = ({ outlet, onClose }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const isApproved = outlet.managementApproval === 'Approve' || outlet.managementApproval === 'Full Approval (Grade A/B)';
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl bg-[#FDFCFB] rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-700 max-h-[92vh] flex flex-col border border-white/20">
        
        {/* Top Status Bar */}
        <div className={cn(
          "h-1.5 w-full shrink-0",
          outlet.recommendedClass === 'A' ? "bg-amber-500" :
          outlet.recommendedClass === 'B' ? "bg-amber-600/80" :
          outlet.recommendedClass === 'C' ? "bg-orange-500" : "bg-stone-400"
        )} />

        <header className="px-8 py-6 md:px-12 md:py-10 bg-white border-b border-stone-100 flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-6 md:gap-10">
            <div className="relative group">
              <div 
                className="bg-stone-950 w-20 h-20 md:w-28 md:h-28 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 overflow-hidden relative border-4 border-white cursor-pointer"
                onClick={() => outlet.photoUrls?.[0] && setPreviewImage(outlet.photoUrls[0])}
              >
                {outlet.photoUrls?.[0] ? (
                  <img src={outlet.photoUrls[0]} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="italic font-black text-4xl md:text-5xl tracking-tighter text-amber-500">{outlet.name[0]}</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-4 border-[#FDFCFB] z-10 rotate-12">
                <Zap size={18} fill="currentColor" />
              </div>
            </div>

            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-3xl md:text-5xl font-black text-stone-950 uppercase tracking-tighter italic leading-none">{outlet.name}</h2>
                <span className="bg-stone-950 text-amber-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-stone-800 shadow-xl">Grade {outlet.recommendedClass}</span>
              </div>
              <div className="flex items-center gap-6 text-stone-400 font-bold uppercase tracking-widest text-[10px]">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-6 h-6 rounded-lg bg-stone-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors"><MapPin size={12} /></div>
                  <span className="group-hover:text-stone-900 transition-colors">{outlet.town}</span>
                </div>
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-6 h-6 rounded-lg bg-stone-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors"><Briefcase size={12} /></div>
                  <span className="group-hover:text-stone-900 transition-colors">{outlet.type}</span>
                </div>
                <div className="hidden md:flex items-center gap-2 group cursor-pointer">
                  <div className="w-6 h-6 rounded-lg bg-stone-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors"><Calendar size={12} /></div>
                  <span className="group-hover:text-stone-900 transition-colors">{new Date(outlet.dateVisited).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-5 bg-stone-50 hover:bg-stone-950 hover:text-white rounded-[2rem] transition-all duration-300 shadow-sm active:scale-95 group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar bg-stone-50/20">
          
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                <User size={20} className="text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Proprietor</p>
              <p className="text-lg font-black text-stone-950 uppercase italic tracking-tight truncate">{outlet.ownerName}</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                <Phone size={20} className="text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Primary Line</p>
              <p className="text-lg font-black text-stone-950 uppercase italic tracking-tight">{outlet.phone}</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
              <div className="w-12 h-12 bg-stone-950 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp size={20} className="text-amber-500" />
              </div>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Aggregate Score</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-stone-950 italic">{outlet.totalScore || 0}</p>
                <p className="text-[10px] font-black text-amber-600 uppercase italic">Points</p>
              </div>
            </div>
            <div className={cn(
              "p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between border-2",
              isApproved ? "bg-amber-500 text-white border-amber-400" : "bg-stone-100 text-stone-400 border-stone-200 shadow-none opacity-60"
            )}>
              <div className="flex items-center justify-between">
                <ShieldCheck size={28} />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] bg-white/20 px-3 py-1 rounded-full">System Verified</span>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-70">Verdict</p>
                <p className="text-lg font-black uppercase italic tracking-tighter leading-none">{outlet.managementApproval || 'Review Pending'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Data Sections */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Market Intelligence */}
              <section className="bg-white rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-stone-50 flex items-center justify-between">
                  <h3 className="text-xs font-black text-stone-950 uppercase tracking-[0.3em] flex items-center gap-4 italic">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                      <Zap size={18} />
                    </div>
                    Market Intelligence
                  </h3>
                  <div className="px-5 py-2 bg-stone-50 rounded-full border border-stone-100 text-[9px] font-black text-stone-400 uppercase tracking-widest">Dataset v2.4</div>
                </div>
                <div className="p-10 grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-12">
                  {[
                    { label: 'Current Supplier', value: outlet.currentSupplier, icon: <Briefcase size={12} /> },
                    { label: 'Daily Sales Flow', value: outlet.avgDailySales, icon: <TrendingUp size={12} /> },
                    { label: 'Top Performer', value: outlet.bestSellingSize, icon: <Zap size={12} /> },
                    { label: 'Prime Window', value: outlet.peakSalesTime, icon: <Clock size={12} /> },
                    { label: 'Inbound Cost', value: `₦${outlet.currentBuyingPrice}`, icon: <Info size={12} /> },
                    { label: 'Market Yield', value: `₦${outlet.currentSellingPrice}`, icon: <TrendingUp size={12} /> },
                    { label: 'Audience Core', value: outlet.mainCustomerType, icon: <User size={12} /> },
                    { label: 'Asset Storage', value: outlet.storageCondition, icon: <ShieldCheck size={12} /> },
                    { label: 'Villa Alignment', value: outlet.interestedInVilla, icon: <Star size={12} /> },
                  ].map((item, i) => (
                    <div key={i} className="group">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-amber-500">{item.icon}</div>
                        <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">{item.label}</p>
                      </div>
                      <p className="text-sm font-black text-stone-900 uppercase italic tracking-tight group-hover:text-amber-600 transition-colors">{item.value || '---'}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Supply & Logistics */}
              <section className="bg-stone-950 rounded-[3rem] shadow-2xl overflow-hidden relative border border-white/5">
                <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 text-white">
                  <Navigation size={180} />
                </div>
                <div className="p-10 md:p-12 relative z-10">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-amber-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl italic font-black text-2xl">L</div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Supply Logistics</h3>
                      <p className="text-amber-500/50 text-[9px] font-black uppercase tracking-[0.4em] mt-3 italic">Execution Parameters</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors group">
                        <p className="text-[8px] font-black text-stone-500 uppercase tracking-widest mb-3">Target Volume</p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-black text-white italic tracking-tighter">{outlet.expectedDailyQuantity} <span className="text-sm text-stone-500 not-italic">Loaves/Day</span></p>
                          <Zap size={20} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors group">
                        <p className="text-[8px] font-black text-stone-500 uppercase tracking-widest mb-3">Settlement Term</p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-black text-amber-500 italic tracking-tighter uppercase">
                            {Array.isArray(outlet.paymentMethod) ? outlet.paymentMethod.join(' / ') : outlet.paymentMethod}
                          </p>
                          <ShieldCheck size={20} className="text-white/20" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                        <p className="text-[8px] font-black text-stone-500 uppercase tracking-widest mb-3 italic">Product Portfolio</p>
                        <div className="flex flex-wrap gap-2">
                          {outlet.preferredProducts?.map(p => (
                            <span key={p} className="bg-amber-600 text-[8px] font-black px-3 py-1.5 rounded-lg text-white uppercase tracking-tight shadow-lg">{p}</span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[7px] font-black text-stone-500 uppercase tracking-widest mb-2">Order Cycle</p>
                          <p className="text-xs font-black text-white italic uppercase">{outlet.preOrderCycle}</p>
                        </div>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[7px] font-black text-stone-500 uppercase tracking-widest mb-2">Delivery Cycle</p>
                          <p className="text-xs font-black text-white italic uppercase">{outlet.deliveryCycle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Field Evidence */}
              <section className="space-y-6">
                <h3 className="text-xs font-black text-stone-950 uppercase tracking-[0.3em] flex items-center gap-4 italic ml-2">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-amber-600">
                    <Camera size={14} />
                  </div>
                  Field Evidence
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {outlet.photoUrls?.map((url, i) => (
                    <div 
                      key={i} 
                      onClick={() => setPreviewImage(url)}
                      className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg border-4 border-white cursor-pointer transition-all hover:scale-105 hover:rotate-2 duration-500"
                    >
                      <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="" />
                      <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-stone-900 shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        <Zap size={14} fill="currentColor" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Status & Metadata */}
            <div className="lg:col-span-4 space-y-10">
              
              {/* Profile Deep Dive */}
              <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm space-y-10">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner"><Navigation size={18} /></div>
                    <h4 className="text-[11px] font-black text-stone-950 uppercase tracking-[0.2em] italic">Geo Profile</h4>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center group cursor-pointer">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Town/Area</span>
                      <span className="text-xs font-black text-stone-950 italic uppercase group-hover:text-amber-600 transition-colors">{outlet.town}</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-pointer">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Landmark</span>
                      <span className="text-xs font-black text-stone-950 italic uppercase group-hover:text-amber-600 transition-colors truncate ml-4">{outlet.landmark}</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-pointer">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Latitude</span>
                      <span className="text-xs font-black text-amber-600 italic group-hover:underline">{outlet.latitude || outlet.gps?.split(',')[0] || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-pointer">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Longitude</span>
                      <span className="text-xs font-black text-amber-600 italic group-hover:underline">{outlet.longitude || outlet.gps?.split(',')[1] || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-stone-50" />

                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner"><MessageSquare size={18} /></div>
                    <h4 className="text-[11px] font-black text-stone-950 uppercase tracking-[0.2em] italic">Digital Reach</h4>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center group cursor-pointer">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">WhatsApp</span>
                      <span className="text-xs font-black text-stone-950 italic uppercase group-hover:text-amber-600 transition-colors">{outlet.whatsapp || '---'}</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-pointer">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Email Node</span>
                      <span className="text-xs font-black text-stone-950 italic group-hover:text-amber-600 transition-colors truncate ml-4">{outlet.email || '---'}</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-stone-50" />

                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner"><Clock size={18} /></div>
                    <h4 className="text-[11px] font-black text-stone-950 uppercase tracking-[0.2em] italic">Access Hours</h4>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center group cursor-pointer">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Opens</span>
                      <span className="text-xs font-black text-stone-950 italic uppercase group-hover:text-amber-600 transition-colors">{outlet.openingTime}</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-pointer">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Closes</span>
                      <span className="text-xs font-black text-stone-950 italic uppercase group-hover:text-amber-600 transition-colors">{outlet.closingTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assessment Notes */}
              <div className="bg-stone-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl" />
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500 border border-white/5"><FileText size={18} /></div>
                  <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em] italic">Field Analysis</h4>
                </div>
                <div className="space-y-8">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <p className="text-[8px] font-black text-stone-500 uppercase tracking-widest">Agent Observation</p>
                    <p className="text-sm font-bold text-stone-300 leading-relaxed italic italic">"{outlet.supervisorReview || "High viability outlet with strategic placement."}"</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <p className="text-[8px] font-black text-stone-500 uppercase tracking-widest">Operational Credit Details</p>
                    <p className="text-sm font-bold text-stone-300 italic tracking-tight uppercase leading-relaxed">{outlet.creditRequestDetails || "Standard Prepaid Account"}</p>
                  </div>
                </div>
              </div>

              {/* Onboarding Details (Conditional) */}
              {outlet.status === 'active_customer' && (
                <div className="bg-amber-500 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden rotate-2 border-4 border-white">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-8 italic flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Deployment Intel
                  </h4>
                  <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                    <div>
                      <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">Route Node</p>
                      <p className="text-sm font-black text-white uppercase italic tracking-tighter truncate">{outlet.route}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">First Drop</p>
                      <p className="text-sm font-black text-white uppercase italic tracking-tighter">{outlet.firstSupplyDate}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">Credit Limit</p>
                      <p className="text-xl font-black text-stone-950 uppercase italic tracking-tighter">₦ {outlet.approvedCreditLimit}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">Onboarding Rep</p>
                      <p className="text-sm font-black text-white uppercase italic tracking-tighter truncate">{outlet.activationDetails?.representativeName}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer Sync Status */}
        <footer className="px-12 py-6 bg-white border-t border-stone-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">Synched Local Node: {outlet.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-stone-400 text-[9px] font-black uppercase tracking-widest">
            <span>Powered by Pelykan OS</span>
            <div className="w-1 h-1 rounded-full bg-stone-200" />
            <span>Terminal 0.0.1</span>
          </div>
        </footer>

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
