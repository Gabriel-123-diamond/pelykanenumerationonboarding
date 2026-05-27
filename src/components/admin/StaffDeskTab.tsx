import React from 'react';
import { Download, FileText, Users, ShieldCheck, Loader2 } from 'lucide-react';
import type { UserProfile } from '../../types';

interface StaffDeskTabProps {
  pendingUsers: UserProfile[];
  filteredStaff: UserProfile[];
  staffFilter: string;
  setStaffFilter: (val: string) => void;
  staffRoleFilter: string;
  setStaffRoleFilter: (val: string) => void;
  totalStaff: number;
  handleApproveUser: (uid: string) => void;
  getStaffMetrics: (staff: UserProfile) => { count: number, active: number, pending: number };
  onExportCsv: () => void;
  onExportWord: () => void;
  isExportingCsv?: boolean;
  isExportingWord?: boolean;
}

export const StaffDeskTab: React.FC<StaffDeskTabProps> = ({
  pendingUsers, filteredStaff, staffFilter, setStaffFilter, staffRoleFilter, setStaffRoleFilter, totalStaff, handleApproveUser, getStaffMetrics, onExportCsv, onExportWord, isExportingCsv, isExportingWord
}) => (
  <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
    {pendingUsers.length > 0 && (
      <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl shadow-stone-200/50 border border-amber-100 overflow-hidden">
        <div className="p-5 sm:p-10 border-b border-amber-50 flex flex-col sm:flex-row sm:items-center justify-between bg-stone-50/30 gap-4">
          <div>
            <h2 className="text-xl font-black text-stone-950 uppercase tracking-tighter italic">Approval Queue</h2>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-1">Pending staff authorization requests</p>
          </div>
          <span className="bg-amber-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase animate-pulse">{pendingUsers.length} Requests</span>
        </div>
        <div className="p-5 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingUsers.map((user) => (
            <div key={user.uid} className="bg-stone-50/50 rounded-[2rem] p-5 sm:p-6 border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-amber-400 hover:bg-white transition-all duration-300 shadow-sm">
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-50 group-hover:rotate-6 transition-transform">
                  <Users size={28} />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-stone-900 text-sm uppercase tracking-tight italic">{user.name}</p>
                  <p className="text-[10px] text-stone-400 font-bold mb-2">{user.email}</p>
                  <span className="bg-stone-900 text-amber-500 text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-[0.2em]">{user.role}</span>
                </div>
              </div>
              <button onClick={() => handleApproveUser(user.uid)} className="bg-amber-600 hover:bg-stone-950 text-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3">
                <ShieldCheck size={16} /> Authorize
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl shadow-stone-200/50 border border-amber-100 overflow-hidden">
      <div className="p-5 sm:p-10 border-b border-amber-50 flex flex-col md:flex-row md:items-center justify-between bg-stone-50/30 gap-6">
        <div>
          <h2 className="text-xl font-black text-stone-950 uppercase tracking-tighter italic">Personnel Registry</h2>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-1">Authorized distribution network staff</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input 
            type="text" placeholder="Search staff..." value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-amber-500 outline-none w-full sm:w-48 shadow-sm"
          />
          <select 
            value={staffRoleFilter} onChange={(e) => setStaffRoleFilter(e.target.value)}
            className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm"
          >
            <option value="all">All Roles</option>
            <option value="enumeration">Enumeration</option>
            <option value="onboarding">Onboarding</option>
          </select>
          <div className="bg-stone-900 text-amber-500 text-[10px] font-black px-4 py-2 rounded-xl uppercase shadow-lg border border-stone-800">{totalStaff} Total Staff</div>
          <button 
            onClick={onExportCsv} 
            disabled={isExportingCsv}
            className="bg-stone-900 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase flex items-center gap-2 shadow-lg border border-stone-800 hover:bg-amber-600 transition-colors leading-tight disabled:opacity-50"
          >
            {isExportingCsv ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {isExportingCsv ? "Generating..." : "Excel or Google Sheets"}
          </button>
          <button 
            onClick={onExportWord} 
            disabled={isExportingWord}
            className="bg-white text-stone-700 text-[10px] font-black px-4 py-2 rounded-xl uppercase flex items-center gap-2 shadow-sm border border-amber-100 hover:border-amber-300 transition-colors leading-tight disabled:opacity-50"
          >
            {isExportingWord ? <Loader2 size={14} className="animate-spin text-amber-600" /> : <FileText size={14} />}
            {isExportingWord ? "Generating..." : "Word or Google Docs"}
          </button>
        </div>
      </div>
      <div className="p-5 sm:p-10">
        {filteredStaff.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-inner">
              <Users size={32} className="text-stone-200" />
            </div>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-loose">No staff found matching search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredStaff.map((staff) => {
              const metrics = getStaffMetrics(staff);
              const progressPercent = metrics.count > 0 ? (metrics.active / metrics.count) * 100 : 0;
              return (
                <div key={staff.uid} className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 border border-amber-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Users size={120} /></div>
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                      <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner group-hover:bg-amber-600 group-hover:text-white transition-colors duration-500"><Users size={28} /></div>
                      <div className="min-w-0">
                        <h3 className="font-black text-stone-900 text-base sm:text-lg uppercase tracking-tight italic leading-none truncate">{staff.name}</h3>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-2 truncate">{staff.email}</p>
                        <span className="inline-block mt-3 bg-stone-900 text-amber-500 text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-[0.2em]">{staff.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 relative z-10">
                    <div className="bg-stone-50 p-3 sm:p-4 rounded-2xl border border-stone-100">
                      <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1">
                        {staff.role === 'onboarding' ? 'Completed' : 'Total'}
                      </p>
                      <p className="text-xl font-black text-stone-900 italic">{metrics.count}</p>
                    </div>
                    <div className="bg-amber-50/50 p-3 sm:p-4 rounded-2xl border border-amber-100">
                      <p className="text-[8px] font-black text-amber-700 uppercase tracking-widest mb-1">
                        {staff.role === 'onboarding' ? 'Activated' : 'Active'}
                      </p>
                      <p className="text-xl font-black text-amber-600 italic">{metrics.active}</p>
                    </div>
                    <div className="bg-stone-950 p-3 sm:p-4 rounded-2xl">
                      <p className="text-[8px] font-black text-stone-500 uppercase tracking-widest mb-1">
                        {staff.role === 'onboarding' ? 'Rejected' : 'Pending'}
                      </p>
                      <p className="text-xl font-black text-white italic">{metrics.pending}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest italic">
                        {staff.role === 'onboarding' ? 'Activation Ratio' : 'Activation Success Rate'}
                      </p>
                      <p className="text-[10px] font-black text-amber-600 italic">{progressPercent.toFixed(0)}%</p>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200 shadow-inner">
                      <div className="h-full bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.3)] transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  </div>
);
