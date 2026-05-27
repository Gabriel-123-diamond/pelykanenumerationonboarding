import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, Timestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import type { Outlet } from '../types';
import { LayoutDashboard, Clock, CheckCircle, ListChecks, Store, XCircle } from 'lucide-react';
import { OnboardingCard } from './onboarding/OnboardingCard';
import { cn } from '../lib/utils';

export const OnboardingDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [history, setHistory] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOutletId, setSelectedOutletId] = useState<string>('');

  useEffect(() => {
    const q = query(collection(db, 'outlets'), where('status', '==', 'pending_onboarding'));
    const unsubscribeQueue = onSnapshot(q, (snapshot) => {
      const pendingOutlets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Outlet[];
      setOutlets(pendingOutlets);
      setLoading(false);
    });

    return () => unsubscribeQueue();
  }, []);

  const selectedOutlet = outlets.find(o => o.id === selectedOutletId);

  const handleUpdateOutlet = async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'outlets', id), {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleFinalize = async (id: string) => {
    if (!profile) return;
    try {
      await updateDoc(doc(db, 'outlets', id), {
        status: 'active_customer',
        'activationDetails.date': new Date().toISOString(),
        'activationDetails.onboardingStaffUid': profile.uid,
        'activationDetails.onboardingStaffName': profile.name,
        updatedAt: Timestamp.now()
      });
      alert("Outlet successfully activated!");
    } catch (err) {
      console.error("Finalization failed:", err);
      alert("Failed to finalize onboarding.");
    }
  };

  const handleDecline = async (id: string) => {
    if (!profile) return;
    try {
      await updateDoc(doc(db, 'outlets', id), {
        status: 'rejected',
        'activationDetails.date': new Date().toISOString(),
        'activationDetails.onboardingStaffUid': profile.uid,
        'activationDetails.onboardingStaffName': profile.name,
        updatedAt: Timestamp.now()
      });
      alert("Outlet application declined.");
    } catch (err) {
      console.error("Decline failed:", err);
      alert("Failed to decline outlet.");
    }
  };

  useEffect(() => {
    if (!profile) return;
    const q = query(
      collection(db, 'outlets'), 
      where('status', 'in', ['active_customer', 'rejected']),
      where('activationDetails.onboardingStaffUid', '==', profile.uid),
      orderBy('updatedAt', 'desc')
    );
    const unsubscribeHistory = onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Outlet[]);
    }, () => {
      // Fallback
      const fallbackQ = query(
        collection(db, 'outlets'), 
        where('status', 'in', ['active_customer', 'rejected']),
        where('activationDetails.onboardingStaffUid', '==', profile.uid)
      );
      return onSnapshot(fallbackQ, (snapshot) => {
        setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Outlet[]);
      });
    });

    return () => unsubscribeHistory();
  }, [profile]);

  if (loading) return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-6">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600/20 border-t-amber-600" />
      <p className="text-amber-600/50 text-[10px] font-black uppercase tracking-[0.18em] sm:tracking-[0.4em] text-center px-4">Initializing Onboarding Pipeline</p>
    </div>
  );

  const activatedCount = history.filter(o => o.status === 'active_customer').length;
  const rejectedCount = history.filter(o => o.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <header className="bg-stone-950 text-white py-8 sm:py-12 px-4 sm:px-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-6 md:gap-8">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <div className="bg-amber-600 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl shrink-0"><LayoutDashboard size={28} /></div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tighter italic truncate">
                {activeTab === 'queue' ? 'Onboarding Control' : 'Activation History'}
              </h1>
              <p className="text-amber-500/60 text-[8px] sm:text-[10px] font-black tracking-[0.18em] sm:tracking-[0.4em] mt-1">
                {activeTab === 'queue' ? 'Verification & Pipeline Management' : `Performance Overview • ${activatedCount} Activations`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="grid grid-cols-2 sm:flex bg-stone-900 p-1.5 rounded-2xl border border-stone-800 w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('queue')}
                className={cn(
                  "px-3 sm:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-tight sm:tracking-widest transition-all flex items-center justify-center gap-2",
                  activeTab === 'queue' ? "bg-amber-600 text-white shadow-lg" : "text-stone-500 hover:text-stone-300"
                )}
              >
                <ListChecks size={16} /> Pending Queue
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={cn(
                  "px-3 sm:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-tight sm:tracking-widest transition-all flex items-center justify-center gap-2",
                  activeTab === 'history' ? "bg-amber-600 text-white shadow-lg" : "text-stone-500 hover:text-stone-300"
                )}
              >
                <Clock size={16} /> My History
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-10 sm:mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-amber-100 shadow-xl shadow-stone-200/50 flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner"><ListChecks size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">In Queue</p>
              <p className="text-3xl font-black text-stone-900 italic leading-none">{outlets.length}</p>
            </div>
          </div>
          <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-amber-100 shadow-xl shadow-stone-200/50 flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-600 shadow-inner"><CheckCircle size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Activated</p>
              <p className="text-3xl font-black text-stone-900 italic leading-none">{activatedCount}</p>
            </div>
          </div>
          <div className="bg-stone-950 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-black/20 flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner border border-white/5"><XCircle size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Declined</p>
              <p className="text-3xl font-black text-white italic leading-none">{rejectedCount}</p>
            </div>
          </div>
        </div>

        {activeTab === 'queue' ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {outlets.length === 0 ? (
              <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-24 text-center border border-amber-100 shadow-xl">
                <div className="w-24 h-24 bg-stone-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-stone-100 shadow-inner">
                  <Clock size={40} className="text-stone-200" />
                </div>
                <h2 className="text-xl font-black text-stone-900 uppercase tracking-tighter italic mb-4">Pipeline Clear</h2>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                  Waiting for field data. Open the <span className="text-amber-600">Pending Queue</span> to initialize the dynamic onboarding and verification protocol.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-amber-100 shadow-xl max-w-2xl mx-auto">
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1 mb-3 block italic">Select Target Outlet for Onboarding</label>
                  <div className="relative group">
                    <select
                      value={selectedOutletId}
                      onChange={(e) => setSelectedOutletId(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-5 pr-12 sm:px-6 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none shadow-inner cursor-pointer"
                    >
                      <option value="">Choose from {outlets.length} Pending Outlets...</option>
                      {outlets.map(outlet => (
                        <option key={outlet.id} value={outlet.id}>{outlet.name} - {outlet.town} (Grade {outlet.recommendedClass})</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600 group-hover:scale-110 transition-transform">
                      <Store size={20} />
                    </div>
                  </div>
                </div>

                {selectedOutlet ? (
                  <OnboardingCard 
                    key={selectedOutlet.id} 
                    outlet={selectedOutlet} 
                    onUpdate={handleUpdateOutlet} 
                    onFinalize={(id) => {
                      handleFinalize(id);
                      setSelectedOutletId('');
                    }}
                    onDecline={(id) => {
                      handleDecline(id);
                      setSelectedOutletId('');
                    }}
                  />
                ) : (
                  <div className="bg-amber-50/50 border-2 border-dashed border-amber-100 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-20 text-center animate-pulse">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-50">
                      <ListChecks size={24} className="text-amber-400" />
                    </div>
                    <p className="text-[11px] font-black text-amber-900/40 uppercase tracking-[0.3em]">Selection Required to Initialize Protocol</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {history.length === 0 ? (
              <div className="col-span-full bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-24 text-center border border-amber-100 shadow-xl">
                <div className="w-24 h-24 bg-stone-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-stone-100 shadow-inner">
                  <CheckCircle size={40} className="text-stone-200" />
                </div>
                <h2 className="text-xl font-black text-stone-900 uppercase tracking-tighter italic mb-4">No Activations</h2>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                  You haven't activated any outlets yet. Complete the <span className="text-amber-600">Onboarding Checklist</span> for pending outlets to see them here.
                </p>
              </div>
            ) : (
              history.map((outlet) => (
                <div key={outlet.id} className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 border border-amber-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><CheckCircle size={120} /></div>
                  <div className="flex items-center gap-5 mb-8 relative z-10">
                    <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Store size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-stone-900 uppercase tracking-tight italic leading-none">{outlet.name}</h3>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-2">{outlet.town}</p>
                    </div>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center p-4 bg-stone-50 rounded-2xl border border-stone-100">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Activated On</span>
                      <span className="text-xs font-black text-stone-900 italic">
                        {outlet.activationDetails?.date ? new Date(outlet.activationDetails.date).toLocaleDateString() : '---'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-stone-50 rounded-2xl border border-stone-100">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Outlet Grade</span>
                      <span className="bg-stone-900 text-amber-500 text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-widest">Grade {outlet.recommendedClass}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};
