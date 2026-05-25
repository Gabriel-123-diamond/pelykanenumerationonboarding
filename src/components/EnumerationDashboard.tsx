import React, { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, Timestamp, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';
import type { Outlet, EvaluationMatrix } from '../types';
import { Store, Clock, Edit3, ChevronRight } from 'lucide-react';
import { Step1Profile } from './enumeration/Step1Profile';
import { Step2Intelligence } from './enumeration/Step2Intelligence';
import { Step3Evaluation } from './enumeration/Step3Evaluation';
import { Step4Review } from './enumeration/Step4Review';
import { cn } from '../lib/utils';

const initialEvaluation: EvaluationMatrix = {
  footTraffic: 3, breadSalesVolume: 3, paymentReliability: 3, routeFit: 3,
  storageHygiene: 3, productInterest: 3, preOrderReadiness: 3, growthPotential: 3,
};

const initialFormData: Partial<Outlet> = {
  name: '', type: 'Supermarket', address: '', landmark: '', town: '', gps: '',
  latitude: '', longitude: '',
  ownerName: '', contactPerson: '', phone: '', whatsapp: '', email: '', 
  openingTime: '08:00', closingTime: '21:00', currentSupplier: '', 
  avgDailySales: '', bestSellingSize: '', peakSalesTime: '', 
  currentBuyingPrice: '', currentSellingPrice: '', mainCustomerType: '',
  storageCondition: 'Good/Shelved', sellSnacksDrinks: false, preferredProducts: [],
  expectedDailyQuantity: '', preferredDeliveryTime: '', paymentMethod: ['Cash'],
  preOrderCycle: 'Evening', deliveryCycle: 'Morning', canPayBeforeDelivery: 'Yes',
  interestedInVilla: 'Yes',
  recommendedAction: 'Approve', supervisorReview: '', managementApproval: '',
};

export const EnumerationDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formData, setFormData] = useState<Partial<Outlet>>(initialFormData);
  const [evaluation, setEvaluation] = useState<EvaluationMatrix>(initialEvaluation);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [history, setHistory] = useState<Outlet[]>([]);
  const [editingOutletId, setEditingOutletId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    const q = query(
      collection(db, 'outlets'),
      where('fieldOfficerUid', '==', profile.uid),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Outlet[]);
    }, () => {
      // Fallback for missing index or other errors
      const fallbackQ = query(
        collection(db, 'outlets'),
        where('fieldOfficerUid', '==', profile.uid)
      );
      return onSnapshot(fallbackQ, (snap) => {
        setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Outlet[]);
      });
    });
  }, [profile]);

  const handleEdit = (outlet: Outlet) => {
    setEditingOutletId(outlet.id);
    setFormData(outlet);
    setEvaluation(outlet.evaluation || initialEvaluation);
    setPhotos([]);
    setStep(1);
    setActiveTab('new');
  };

  const resetForm = () => {
    setStep(1);
    setPhotos([]);
    setEvaluation(initialEvaluation);
    setFormData(initialFormData);
    setEditingOutletId(null);
  };

  const validatePhoneNumber = (num: string): boolean => {
    const cleanNum = num.replace(/[\s-]/g, '');
    if (cleanNum.startsWith('0')) return /^\d{11}$/.test(cleanNum);
    if (cleanNum.startsWith('+234')) return /^\+234\d{10}$/.test(cleanNum);
    return false;
  };

  const calculateScore = () => {
    const total = Object.values(evaluation).reduce((a, b) => a + b, 0);
    // 8 categories, 1=Best, 5=Bad. Total 8-40.
    // A: 8-12 (Very High Performance)
    // B: 13-20 (Stable/Good)
    // C: 21-28 (Growth Potential)
    // D: 29-40 (Low Viability)
    const recommendedClass: 'A' | 'B' | 'C' | 'D' | 'Watchlist' = 
      total <= 12 ? 'A' : 
      total <= 20 ? 'B' : 
      total <= 28 ? 'C' : 'D';
    
    return { total, recommendedClass };
  };

  const handleSubmit = async () => {
    if (!profile) return;
    const isPhoneValid = validatePhoneNumber(formData.phone || '');
    if (!isPhoneValid) { setPhoneError("Use format: 091... (11 digits) or +234..."); setStep(1); return; }
    
    setLoading(true);
    try {
      const { total, recommendedClass } = calculateScore();
      const newPhotoUrls = await Promise.all(photos.map(async (file) => {
        const storageRef = ref(storage, `outlets/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return getDownloadURL(snapshot.ref);
      }));

      const finalPhotoUrls = [...(formData.photoUrls || []), ...newPhotoUrls];
      const recommendedAction = formData.recommendedAction || (['A', 'B'].includes(recommendedClass) ? 'Approve' : 'Pilot');
      const status = (recommendedAction === 'Approve' || recommendedAction === 'Pilot') 
        ? 'pending_onboarding' 
        : 'enumerated';

      const payload = {
        ...formData, 
        evaluation, 
        totalScore: total, 
        recommendedClass, 
        recommendedAction,
        photoUrls: finalPhotoUrls,
        status,
        fieldOfficerName: profile.name,
        fieldOfficerUid: profile.uid,
        managementApproval: formData.managementApproval || '',
        dateVisited: editingOutletId ? formData.dateVisited : new Date().toISOString(),
        updatedAt: Timestamp.now(),
      };

      if (editingOutletId) {
        // Double check ownership in UI before update (rules will also enforce this)
        const outlet = history.find(o => o.id === editingOutletId);
        if (outlet && outlet.fieldOfficerUid !== profile.uid) {
           alert("Unauthorized: You can only edit your own captures.");
           resetForm();
           return;
        }
        await updateDoc(doc(db, 'outlets', editingOutletId), payload);
        alert("Outlet successfully updated!");
      } else {
        await addDoc(collection(db, 'outlets'), {
          ...payload,
          createdAt: Timestamp.now(),
        });
        alert("Outlet successfully enumerated!");
      }
      resetForm();
    } catch (err) { 
      console.error(err);
      alert("Failed to save outlet data."); 
    } finally { 
      setLoading(false); 
    }
  };

  const stats = {
    total: history.length,
    active: history.filter(o => o.status === 'active_customer').length,
    pending: history.filter(o => o.status === 'pending_onboarding' || o.status === 'enumerated').length
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-24">
      <header className="bg-stone-950 text-white pt-8 pb-4 px-6 sticky top-0 z-10 shadow-2xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-amber-600 p-3 rounded-2xl shadow-lg shadow-amber-900/20"><Store size={24} /></div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter italic">
                {editingOutletId ? 'Edit Enumeration' : activeTab === 'new' ? 'New Enumeration' : 'Enumeration History'}
              </h1>
              <p className="text-amber-500/50 text-[9px] font-black uppercase tracking-[0.3em]">
                {activeTab === 'new' ? `Step ${step} of 4 • Market Data` : `${history.length} Outlets Captured`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { setActiveTab('new'); if (!editingOutletId) resetForm(); }}
              className={cn(
                "p-3 rounded-xl transition-all",
                activeTab === 'new' ? "bg-amber-600 text-white" : "bg-stone-900 text-stone-500 hover:text-amber-500"
              )}
            >
              <Edit3 size={20} />
            </button>
            <button 
              onClick={() => { setActiveTab('history'); setEditingOutletId(null); }}
              className={cn(
                "p-3 rounded-xl transition-all",
                activeTab === 'history' ? "bg-amber-600 text-white" : "bg-stone-900 text-stone-500 hover:text-amber-500"
              )}
            >
              <Clock size={20} />
            </button>
          </div>
        </div>
        {activeTab === 'new' && (
          <div className="max-w-2xl mx-auto mt-6 h-1.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
            <div className="h-full bg-amber-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(217,119,6,0.5)]" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        )}
      </header>

      <main className="max-w-2xl mx-auto p-6 mt-6">
        <div className="grid grid-cols-3 gap-4 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-white p-5 rounded-[2rem] border border-amber-100 shadow-xl shadow-stone-200/50 flex flex-col items-center text-center">
            <p className="text-[7px] font-black text-stone-400 uppercase tracking-widest mb-1">Total Captured</p>
            <p className="text-xl font-black text-stone-900 italic leading-none">{stats.total}</p>
          </div>
          <div className="bg-white p-5 rounded-[2rem] border border-amber-100 shadow-xl shadow-stone-200/50 flex flex-col items-center text-center">
            <p className="text-[7px] font-black text-amber-600 uppercase tracking-widest mb-1">Live/Active</p>
            <p className="text-xl font-black text-amber-600 italic leading-none">{stats.active}</p>
          </div>
          <div className="bg-stone-900 p-5 rounded-[2rem] shadow-xl shadow-black/20 flex flex-col items-center text-center">
            <p className="text-[7px] font-black text-stone-500 uppercase tracking-widest mb-1">In Review</p>
            <p className="text-xl font-black text-white italic leading-none">{stats.pending}</p>
          </div>
        </div>

        {activeTab === 'new' ? (
          <>
            {step === 1 && <Step1Profile formData={formData} setFormData={setFormData} photos={photos} setPhotos={setPhotos} phoneError={phoneError} setPhoneError={setPhoneError} whatsappError={whatsappError} setWhatsappError={setWhatsappError} />}
            {step === 2 && <Step2Intelligence formData={formData} setFormData={setFormData} />}
            {step === 3 && <Step3Evaluation evaluation={evaluation} setEvaluation={setEvaluation} initialEvaluation={initialEvaluation} />}
            {step === 4 && <Step4Review recommendedClass={recommendedClass} total={total} handleSubmit={handleSubmit} loading={loading} />}

            <div className="mt-12 mb-20 flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-amber-100 shadow-xl shadow-stone-200/50">
              <button 
                onClick={() => {
                  if (step === 1 && editingOutletId) {
                    resetForm();
                    setActiveTab('history');
                  } else {
                    setStep(prev => Math.max(1, prev - 1));
                  }
                }} 
                disabled={(step === 1 && !editingOutletId) || loading} 
                className="px-8 py-3 font-black text-stone-400 uppercase tracking-widest text-[10px] disabled:opacity-0 transition-all hover:text-amber-600"
              >
                {step === 1 && editingOutletId ? "Cancel Edit" : "Back"}
              </button>
              <button 
                onClick={() => {
                  if (step === 1) {
                    if (!validatePhoneNumber(formData.phone || '')) { setPhoneError("Use format: 091... (11 digits) or +234..."); return; }
                    if (formData.whatsapp && !validatePhoneNumber(formData.whatsapp)) { setWhatsappError("Use format: 091... (11 digits) or +234..."); return; }
                  }
                  if (step === 4) {
                    handleSubmit();
                  } else {
                    setStep(prev => Math.min(4, prev + 1));
                  }
                }} 
                disabled={loading} 
                className="bg-stone-950 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-black/20 active:scale-95 disabled:opacity-30 transition-all hover:bg-amber-600"
              >
                {step === 4 ? (loading ? "Saving..." : "Submit Review") : "Continue"}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {history.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-amber-100 shadow-xl">
                <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-inner">
                  <Store size={32} className="text-stone-200" />
                </div>
                <h2 className="text-lg font-black text-stone-900 uppercase tracking-tighter italic mb-2">No Captures Yet</h2>
                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                  Start your first enumeration to see your field data synchronization here.
                </p>
              </div>
            ) : (
              history.map((outlet) => (
                <div key={outlet.id} className="bg-white rounded-[2.5rem] p-6 border border-amber-100 shadow-xl shadow-stone-200/50 flex items-center justify-between group hover:border-amber-400 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-amber-600 border border-stone-100 group-hover:bg-amber-600 group-hover:text-white transition-colors relative overflow-hidden">
                      {outlet.photoUrls?.[0] ? (
                        <img src={outlet.photoUrls[0]} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <Store size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-stone-900 uppercase tracking-tight italic leading-none">{outlet.name}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="bg-stone-900 text-amber-500 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-stone-800">Grade {outlet.recommendedClass}</span>
                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{outlet.town}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-4 hidden sm:block">
                      <p className="text-[8px] font-black text-stone-400 uppercase tracking-[0.2em]">Captured</p>
                      <p className="text-[10px] font-black text-stone-900 italic">{new Date(outlet.dateVisited).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => handleEdit(outlet)}
                      className="bg-stone-50 hover:bg-amber-50 text-stone-400 hover:text-amber-600 p-3 rounded-xl transition-all border border-stone-100 hover:border-amber-200"
                    >
                      <Edit3 size={18} />
                    </button>
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <ChevronRight size={18} className="text-stone-300" />
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
