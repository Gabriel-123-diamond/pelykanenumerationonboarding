import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import type { Outlet, UserProfile } from '../types';
import { LayoutDashboard, Store, CheckCircle, Clock, AlertTriangle, Users, Edit3, UserCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { OutletDetailModal } from './OutletDetailModal';
import { MetricCard } from './admin/MetricCard';
import { DistributionTab } from './admin/DistributionTab';
import { StaffDeskTab } from './admin/StaffDeskTab';
import { exportOutletsCsv, exportOutletsWord, exportStaffCsv, exportStaffWord } from '../lib/exportUtils';

export const AdminDashboard: React.FC = () => {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'outlets' | 'staff'>('outlets');
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [loading, setLoading] = useState(true);
  const [outletFilter, setOutletFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

  const getStaffMetrics = (staff: UserProfile) => {
    if (staff.role === 'onboarding') {
      const staffHistory = outlets.filter(o => o.activationDetails?.onboardingStaffUid === staff.uid);
      return { 
        count: staffHistory.length, 
        active: staffHistory.filter(o => o.status === 'active_customer').length, 
        pending: staffHistory.filter(o => o.status === 'rejected').length 
      };
    }
    const staffOutlets = outlets.filter(o => o.fieldOfficerName === staff.name);
    return { 
      count: staffOutlets.length, 
      active: staffOutlets.filter(o => o.status === 'active_customer').length, 
      pending: staffOutlets.filter(o => o.status !== 'active_customer' && o.status !== 'rejected').length 
    };
  };

  const pendingUsers = users.filter(u => !u.isApproved);
  const approvedUsers = users.filter(u => u.isApproved && u.role !== 'admin');
  
  const filteredOutlets = outlets.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(outletFilter.toLowerCase()) || o.town.toLowerCase().includes(outletFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesAgent = agentFilter === 'all' || o.fieldOfficerName === agentFilter;
    
    let matchesDate = true;
    if (startDate || endDate) {
      const visitDate = new Date(o.dateVisited);
      visitDate.setHours(0, 0, 0, 0);
      
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (visitDate < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (visitDate > end) matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesAgent && matchesDate;
  });

  const filteredStaff = approvedUsers.filter(u => 
    (u.name.toLowerCase().includes(staffFilter.toLowerCase()) || u.email.toLowerCase().includes(staffFilter.toLowerCase())) &&
    (staffRoleFilter === 'all' || u.role === staffRoleFilter)
  );

  const stats = {
    total: outlets.length, active: outlets.filter(o => o.status === 'active_customer').length,
    pending: outlets.filter(o => o.status === 'pending_onboarding').length,
    enumerated: outlets.filter(o => o.status === 'enumerated').length,
    pendingStaff: pendingUsers.length, totalStaff: approvedUsers.length,
    enumerationStaff: approvedUsers.filter(u => u.role === 'enumeration').length,
    onboardingStaff: approvedUsers.filter(u => u.role === 'onboarding').length
  };

  const uniqueAgents = Array.from(new Set(outlets.map(o => o.fieldOfficerName).filter(Boolean))).sort();

  if (loading) return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-6">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600/20 border-t-amber-600" />
      <p className="text-amber-600/50 text-[10px] font-black uppercase tracking-[0.18em] sm:tracking-[0.4em] text-center px-4">Synchronizing Control Center</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <header className="bg-stone-950 text-white py-8 sm:py-10 px-4 sm:px-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <div className="bg-amber-600 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl shrink-0"><LayoutDashboard size={28} /></div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tighter italic truncate">Bakery Control</h1>
              <p className="text-amber-500/60 text-[9px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.4em] mt-1">Meal Villa Management</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 w-full md:w-auto">
            <button onClick={() => setActiveTab('staff')} className={cn("px-4 sm:px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tight sm:tracking-widest transition-all flex items-center justify-center gap-2 sm:gap-3 border shadow-lg", activeTab === 'staff' ? "bg-amber-600 text-white border-amber-500" : "bg-stone-900 text-stone-400 border-stone-800")}>
              <Users size={16} /> Staff Desk {stats.pendingStaff > 0 && <span className="bg-white text-amber-600 px-2 py-0.5 rounded-full animate-bounce">{stats.pendingStaff}</span>}
            </button>
            <button onClick={() => setActiveTab('outlets')} className={cn("px-4 sm:px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tight sm:tracking-widest transition-all flex items-center justify-center gap-2 sm:gap-3 border shadow-lg", activeTab === 'outlets' ? "bg-amber-600 text-white border-amber-500" : "bg-stone-900 text-stone-400 border-stone-800")}>
              Distribution {stats.pending > 0 && <span className="bg-white text-amber-600 px-2 py-0.5 rounded-full animate-bounce">{stats.pending}</span>}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-12">
          {activeTab === 'outlets' ? (
            <>
              <MetricCard label="Total Outlets" value={stats.total} icon={Store} color="text-amber-700" bg="bg-amber-50" />
              <MetricCard label="Active Pipeline" value={stats.active} icon={CheckCircle} color="text-stone-700" bg="bg-stone-100" />
              <MetricCard label="Pending Review" value={stats.pending} icon={Clock} color="text-amber-800" bg="bg-orange-50" />
              <MetricCard label="New Lead" value={stats.enumerated} icon={AlertTriangle} color="text-stone-500" bg="bg-stone-50" />
            </>
          ) : (
            <>
              <MetricCard label="Total Staff" value={stats.totalStaff} icon={Users} color="text-amber-700" bg="bg-amber-50" />
              <MetricCard label="Waitlist" value={stats.pendingStaff} icon={Clock} color="text-stone-700" bg="bg-stone-100" />
              <MetricCard label="Enumerators" value={stats.enumerationStaff} icon={Edit3} color="text-amber-800" bg="bg-orange-50" />
              <MetricCard label="Onboarding" value={stats.onboardingStaff} icon={UserCheck} color="text-stone-500" bg="bg-stone-50" />
            </>
          )}
        </div>
        {activeTab === 'outlets' ? 
          <DistributionTab
            outlets={filteredOutlets}
            filter={outletFilter}
            setFilter={setOutletFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            agentFilter={agentFilter}
            setAgentFilter={setAgentFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            agents={uniqueAgents}
            setSelectedOutlet={setSelectedOutlet}
            onExportCsv={() => exportOutletsCsv(filteredOutlets, 'outlet-export')}
            onExportWord={() => exportOutletsWord(filteredOutlets, 'outlet-export')}
          /> :
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
            onExportCsv={() => exportStaffCsv(filteredStaff, getStaffMetrics, 'staff-export')}
            onExportWord={() => exportStaffWord(filteredStaff, getStaffMetrics, 'staff-export')}
          />
        }
      </main>
      {selectedOutlet && <OutletDetailModal outlet={selectedOutlet} onClose={() => setSelectedOutlet(null)} />}
    </div>
  );
};
