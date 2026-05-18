import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import type { Outlet, UserProfile } from '../types';
import { LayoutDashboard, Store, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { OutletDetailModal } from './OutletDetailModal';
import { MetricCard } from './admin/MetricCard';
import { DistributionTab } from './admin/DistributionTab';
import { StaffDeskTab } from './admin/StaffDeskTab';

export const AdminDashboard: React.FC = () => {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'outlets' | 'staff'>('outlets');
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [loading, setLoading] = useState(true);
  const [outletFilter, setOutletFilter] = useState('');
  const [staffFilter, setStaffFilter] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'outlets'), orderBy('createdAt', 'desc')), 
      (snap) => { setOutlets(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Outlet[]); setLoading(false); },
      () => setLoading(false));
    const userUnsubscribe = onSnapshot(query(collection(db, 'users')), 
      (snap) => setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })) as UserProfile[]));
    return () => { unsubscribe(); userUnsubscribe(); };
  }, []);

  const handleApproveUser = async (uid: string) => {
    try { await updateDoc(doc(db, 'users', uid), { isApproved: true, updatedAt: new Date().toISOString() }); }
    catch { alert("Failed to approve user."); }
  };

  const getStaffMetrics = (name: string) => {
    const staffOutlets = outlets.filter(o => o.fieldOfficerName === name);
    return { count: staffOutlets.length, active: staffOutlets.filter(o => o.status === 'active_customer').length, pending: staffOutlets.filter(o => o.status !== 'active_customer').length };
  };

  const pendingUsers = users.filter(u => !u.isApproved);
  const approvedUsers = users.filter(u => u.isApproved && u.role !== 'admin');
  const filteredOutlets = outlets.filter(o => (o.name.toLowerCase().includes(outletFilter.toLowerCase()) || o.town.toLowerCase().includes(outletFilter.toLowerCase())) && (statusFilter === 'all' || o.status === statusFilter));
  const filteredStaff = approvedUsers.filter(u => 
    (u.name.toLowerCase().includes(staffFilter.toLowerCase()) || u.email.toLowerCase().includes(staffFilter.toLowerCase())) &&
    (staffRoleFilter === 'all' || u.role === staffRoleFilter)
  );

  const stats = {
    total: outlets.length, active: outlets.filter(o => o.status === 'active_customer').length,
    pending: outlets.filter(o => o.status === 'pending_onboarding').length,
    enumerated: outlets.filter(o => o.status === 'enumerated').length,
    pendingStaff: pendingUsers.length, totalStaff: approvedUsers.length
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-6">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600/20 border-t-amber-600" />
      <p className="text-amber-600/50 text-[10px] font-black uppercase tracking-[0.4em]">Synchronizing Control Center</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <header className="bg-stone-950 text-white py-10 px-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div className="bg-amber-600 p-4 rounded-3xl shadow-xl"><LayoutDashboard size={32} /></div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">Bakery Control</h1>
              <p className="text-amber-500/60 text-[10px] font-black tracking-[0.4em] mt-1">Meal Villa Management</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('staff')} className={cn("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 border shadow-lg", activeTab === 'staff' ? "bg-amber-600 text-white border-amber-500" : "bg-stone-900 text-stone-400 border-stone-800")}>
              <Users size={16} /> Staff Desk {stats.pendingStaff > 0 && <span className="bg-white text-amber-600 px-2 py-0.5 rounded-full animate-bounce">{stats.pendingStaff}</span>}
            </button>
            <button onClick={() => setActiveTab('outlets')} className={cn("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-lg", activeTab === 'outlets' ? "bg-amber-600 text-white border-amber-500" : "bg-stone-900 text-stone-400 border-stone-800")}>Distribution</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <MetricCard label="Total Outlets" value={stats.total} icon={Store} color="text-amber-700" bg="bg-amber-50" />
          <MetricCard label="Active Pipeline" value={stats.active} icon={CheckCircle} color="text-stone-700" bg="bg-stone-100" />
          <MetricCard label="Pending Review" value={stats.pending} icon={Clock} color="text-amber-800" bg="bg-orange-50" />
          <MetricCard label="New Lead" value={stats.enumerated} icon={AlertTriangle} color="text-stone-500" bg="bg-stone-50" />
        </div>
        {activeTab === 'outlets' ? 
          <DistributionTab outlets={filteredOutlets} filter={outletFilter} setFilter={setOutletFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} setSelectedOutlet={setSelectedOutlet} /> :
          <StaffDeskTab 
            pendingUsers={pendingUsers} 
            filteredStaff={filteredStaff} 
            staffFilter={staffFilter} 
            setStaffFilter={setStaffFilter} 
            staffRoleFilter={staffRoleFilter}
            setStaffRoleFilter={setStaffRoleFilter}
            totalStaff={stats.totalStaff} 
            handleApproveUser={handleApproveUser} 
            getStaffMetrics={getStaffMetrics} 
          />
        }
      </main>
      {selectedOutlet && <OutletDetailModal outlet={selectedOutlet} onClose={() => setSelectedOutlet(null)} />}
    </div>
  );
};
