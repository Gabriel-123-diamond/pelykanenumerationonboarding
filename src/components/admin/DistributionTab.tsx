import React from 'react';
import { Download, FileText, Store } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Outlet } from '../../types';

interface DistributionTabProps {
  outlets: Outlet[];
  filter: string;
  setFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  agentFilter: string;
  setAgentFilter: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  agents: string[];
  setSelectedOutlet: (outlet: Outlet) => void;
  onExportCsv: () => void;
  onExportWord: () => void;
}

export const DistributionTab: React.FC<DistributionTabProps> = ({
  outlets, filter, setFilter, statusFilter, setStatusFilter, agentFilter, setAgentFilter, startDate, setStartDate, endDate, setEndDate, agents, setSelectedOutlet, onExportCsv, onExportWord
}) => (
  <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl shadow-stone-200/50 border border-amber-100 overflow-hidden animate-in fade-in duration-700">
    <div className="p-5 sm:p-10 border-b border-amber-50 bg-stone-50/30 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-stone-950 uppercase tracking-tighter italic">Distribution Pipeline</h2>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-1">Real-time market synchronization</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={onExportCsv} className="bg-stone-900 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase flex items-center gap-2 shadow-lg border border-stone-800 hover:bg-amber-600 transition-colors leading-tight">
            <Download size={14} /> Excel or Google Sheets
          </button>
          <button onClick={onExportWord} className="bg-white text-stone-700 text-[10px] font-black px-4 py-2 rounded-xl uppercase flex items-center gap-2 shadow-sm border border-amber-100 hover:border-amber-300 transition-colors leading-tight">
            <FileText size={14} /> Word or Google Docs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="space-y-1.5">
          <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest ml-1">Search Outlets</label>
          <input 
            type="text" placeholder="Name or Town..." value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-amber-500 outline-none w-full shadow-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest ml-1">Status</label>
          <select 
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm w-full"
          >
            <option value="all">All Status</option>
            <option value="enumerated">Enumerated</option>
            <option value="pending_onboarding">Pending Onboarding</option>
            <option value="active_customer">Active Customer</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest ml-1">Field Agent</label>
          <select 
            value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}
            className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm w-full"
          >
            <option value="all">All Agents</option>
            {agents.map(agent => <option key={agent} value={agent}>{agent}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest ml-1">Start Date</label>
          <input 
            type="date" value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-amber-500 outline-none w-full shadow-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest ml-1">End Date</label>
          <input 
            type="date" value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-amber-500 outline-none w-full shadow-sm"
          />
        </div>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-stone-50/50">
            <th className="p-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Outlet Detail</th>
            <th className="p-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Classification</th>
            <th className="p-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Interest</th>
            <th className="p-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Status</th>
            <th className="p-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Agent</th>
            <th className="p-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Synchronized</th>
            <th className="p-6"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-50">
          {outlets.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 sm:p-20 text-center">
                <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-inner">
                  <Store size={32} className="text-stone-200" />
                </div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">No outlets found matching criteria.</p>
              </td>
            </tr>
          ) : (
            outlets.map((outlet) => (
              <tr key={outlet.id} className="hover:bg-amber-50/30 transition-colors group">
                <td className="p-6">
                  <p className="font-black text-stone-900 text-sm uppercase tracking-tight italic">{outlet.name}</p>
                  <p className="text-xs text-stone-400 font-bold">{outlet.town}</p>
                </td>
                <td className="p-6">
                  <span className="bg-stone-900 text-amber-500 text-[10px] font-black px-3 py-1 rounded-lg border border-stone-800">
                    GRADE {outlet.recommendedClass || 'Not Available'}
                  </span>
                </td>
                <td className="p-6">
                  <span className={cn(
                    "text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-tighter border",
                    outlet.interestedInVilla === 'Yes' ? "bg-amber-50 text-amber-700 border-amber-200" :
                    outlet.interestedInVilla === 'Maybe' ? "bg-orange-50 text-orange-700 border-orange-100" :
                    "bg-stone-50 text-stone-400 border-stone-100"
                  )}>
                    {outlet.interestedInVilla || '---'}
                  </span>
                </td>
                <td className="p-6">
                  <span className={cn(
                    "text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border",
                    outlet.status === 'active_customer' ? "bg-amber-50 text-amber-700 border-amber-200" :
                    outlet.status === 'pending_onboarding' ? "bg-orange-50 text-orange-700 border-orange-200" :
                    "bg-stone-50 text-stone-600 border-stone-200"
                  )}>
                    {outlet.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-6 text-xs font-black text-stone-700 uppercase tracking-tight">{outlet.fieldOfficerName}</td>
                <td className="p-6 text-[11px] text-stone-400 font-bold">
                  {outlet.updatedAt?.toDate?.() ? outlet.updatedAt.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '---'}
                </td>
                <td className="p-6">
                  <button onClick={() => setSelectedOutlet(outlet)} className="text-amber-600 font-black text-[10px] uppercase tracking-widest hover:text-stone-950 transition-colors underline underline-offset-4">Open File</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
