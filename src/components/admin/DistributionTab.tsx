import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Store, Search, ChevronDown, Check, X, Users, Loader2 } from 'lucide-react';
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
  isExportingCsv?: boolean;
  isExportingWord?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const DistributionTab: React.FC<DistributionTabProps> = ({
  outlets, filter, setFilter, statusFilter, setStatusFilter, agentFilter, setAgentFilter, startDate, setStartDate, endDate, setEndDate, agents, setSelectedOutlet, onExportCsv, onExportWord, isExportingCsv, isExportingWord, onLoadMore, hasMore
}) => {
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [agentSearchQuery, setAgentSearchQuery] = useState('');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAgentDialogOpen(false);
    };
    if (isAgentDialogOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isAgentDialogOpen]);

  const filteredAgentsList = agents.filter(agent => 
    agent.toLowerCase().includes(agentSearchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl shadow-stone-200/50 border border-amber-100 overflow-hidden animate-in fade-in duration-700">
      <div className="p-5 sm:p-10 border-b border-amber-50 bg-stone-50/30 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-black text-stone-950 uppercase tracking-tighter italic">Distribution Pipeline</h2>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-1">Real-time market synchronization</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={onExportCsv} 
              disabled={isExportingCsv}
              className="bg-stone-900 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase flex items-center gap-2 shadow-lg border border-stone-800 hover:bg-amber-600 transition-all leading-tight disabled:opacity-50 active:scale-95"
            >
              {isExportingCsv ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              {isExportingCsv ? "Generating..." : "Excel or Google Sheets"}
            </button>
            <button 
              onClick={onExportWord} 
              disabled={isExportingWord}
              className="bg-white text-stone-700 text-[10px] font-black px-4 py-2 rounded-xl uppercase flex items-center gap-2 shadow-sm border border-amber-100 hover:border-amber-300 transition-all leading-tight disabled:opacity-50 active:scale-95"
            >
              {isExportingWord ? <Loader2 size={14} className="animate-spin text-amber-600" /> : <FileText size={14} />}
              {isExportingWord ? "Generating..." : "Word or Google Docs"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest ml-1 flex justify-between">
              Search Outlets
              {filter && <button onClick={() => setFilter('')} className="text-amber-600 hover:text-stone-950">Clear</button>}
            </label>
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
              className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm w-full cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="enumerated">Enumerated</option>
              <option value="pending_onboarding">Pending Onboarding</option>
              <option value="active_customer">Active Customer</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest ml-1">Field Agent</label>
            <button
              onClick={() => setIsAgentDialogOpen(true)}
              className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm w-full flex items-center justify-between text-left h-[38px] hover:border-amber-400 transition-all active:scale-95"
            >
              <span className="truncate">{agentFilter === 'all' ? 'All Agents' : agentFilter}</span>
              <div className="flex items-center gap-2">
                {agentFilter !== 'all' && <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />}
                <Users size={14} className="text-stone-400" />
              </div>
            </button>

            {/* Agent Selection Dialog */}
            {isAgentDialogOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div 
                  className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
                  onClick={() => setIsAgentDialogOpen(false)} 
                />
                <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[80vh]">
                  {/* Dialog Header */}
                  <div className="p-8 pb-4 border-b border-stone-50 flex items-center justify-between bg-stone-50/30">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 uppercase tracking-tighter italic flex items-center gap-3">
                        <Users size={18} className="text-amber-600" />
                        Agent Selection
                      </h3>
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mt-1">Filter distribution by field officer</p>
                    </div>
                    <button 
                      onClick={() => setIsAgentDialogOpen(false)} 
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-400 hover:text-stone-950 hover:bg-stone-100 transition-all shadow-sm border border-stone-100 active:scale-90"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="p-8 py-6 border-b border-stone-50">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-600 transition-colors" size={16} />
                      <input 
                        type="text"
                        placeholder="SEARCH FIELD AGENTS..."
                        value={agentSearchQuery}
                        onChange={(e) => setAgentSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-12 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                      />
                      {agentSearchQuery && (
                        <button 
                          onClick={() => setAgentSearchQuery('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-all active:scale-90"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4 px-2">
                      <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">
                        {filteredAgentsList.length} of {agents.length} agents found
                      </p>
                      {agentFilter !== 'all' && (
                        <button 
                          onClick={() => { setAgentFilter('all'); setIsAgentDialogOpen(false); }}
                          className="text-[8px] font-black text-amber-600 uppercase tracking-widest hover:underline active:scale-95"
                        >
                          Reset Filter
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Scrollable Agent List */}
                  <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-amber-200">
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => { setAgentFilter('all'); setIsAgentDialogOpen(false); setAgentSearchQuery(''); }}
                        className={cn(
                          "w-full text-left px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between group transition-all duration-300 active:scale-[0.98]",
                          agentFilter === 'all' ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20" : "bg-stone-50 text-stone-600 border border-transparent hover:border-amber-400 hover:bg-amber-50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("w-2 h-2 rounded-full", agentFilter === 'all' ? "bg-white animate-pulse" : "bg-stone-300")} />
                          Show All Agents
                        </div>
                        {agentFilter === 'all' && <Check size={16} />}
                      </button>

                      <div className="h-4" /> {/* Spacer */}

                      {filteredAgentsList.map(agent => (
                        <button
                          key={agent}
                          onClick={() => { setAgentFilter(agent); setIsAgentDialogOpen(false); setAgentSearchQuery(''); }}
                          className={cn(
                            "w-full text-left px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between group transition-all duration-300 active:scale-[0.98]",
                            agentFilter === agent ? "bg-stone-950 text-white shadow-xl" : "bg-stone-50 text-stone-600 border border-transparent hover:border-amber-400 hover:bg-amber-50"
                          )}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={cn("w-2 h-2 rounded-full shrink-0", agentFilter === agent ? "bg-amber-500 animate-pulse" : "bg-stone-200 group-hover:bg-amber-400")} />
                            <span className="truncate">{agent}</span>
                          </div>
                          {agentFilter === agent && <Check size={16} className="text-amber-500" />}
                        </button>
                      ))}

                      {filteredAgentsList.length === 0 && (
                        <div className="py-20 text-center bg-stone-50 rounded-[2rem] border border-dashed border-stone-200">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-stone-200 border border-stone-100 shadow-sm">
                            <Search size={24} />
                          </div>
                          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">No matching agents found</p>
                          <button 
                            onClick={() => setAgentSearchQuery('')}
                            className="mt-4 text-[9px] font-black text-amber-600 uppercase tracking-widest hover:underline active:scale-95"
                          >
                            Clear search query
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dialog Footer */}
                  <div className="p-8 pt-4 bg-stone-50/50 border-t border-stone-50">
                    <button 
                      onClick={() => setIsAgentDialogOpen(false)}
                      className="w-full py-4 rounded-2xl bg-stone-950 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-xl active:scale-95"
                    >
                      Close Selection
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest ml-1 flex justify-between">
              Start Date
              {startDate && <button onClick={() => setStartDate('')} className="text-amber-600 hover:text-stone-950">Clear</button>}
            </label>
            <input 
              type="date" value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-amber-500 outline-none w-full shadow-sm cursor-pointer"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest ml-1 flex justify-between">
              End Date
              {endDate && <button onClick={() => setEndDate('')} className="text-amber-600 hover:text-stone-950">Clear</button>}
            </label>
            <input 
              type="date" value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-amber-500 outline-none w-full shadow-sm cursor-pointer"
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
                    "text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-tighter italic border",
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
                <td className="p-6 text-right">
                  <button onClick={() => setSelectedOutlet(outlet)} className="text-amber-600 font-black text-[10px] uppercase tracking-widest hover:text-stone-950 transition-all underline underline-offset-4 active:scale-95">Open File</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    
    {hasMore && (
      <div className="p-10 border-t border-amber-50 bg-stone-50/20 text-center">
        <button 
          onClick={onLoadMore}
          className="bg-white text-stone-950 border border-stone-200 px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:border-amber-400 hover:text-amber-600 transition-all active:scale-95"
        >
          Load More Results
        </button>
      </div>
    )}
  </div>
);
