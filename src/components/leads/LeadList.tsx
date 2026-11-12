import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setFilterStatus,
  updateLeadStatus,
  deleteLead,
} from '../../store/slices/leadsSlice';
import { openModal, addToast } from '../../store/slices/uiSlice';
import { LeadCard } from './LeadCard';
import { LeadStatusBadge } from '../common/Badge';
import { formatCurrency, formatDate, getScoreColor } from '../../utils/formatters';
import { exportLeadsToExcel } from '../../utils/exportExcel';
import { LeadStatus } from '../../types/crm';
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
  Edit2,
  Trash2,
  Download,
  Users,
  Target,
  IndianRupee,
  Award,
  CalendarClock,
} from 'lucide-react';

export const LeadList: React.FC = () => {
  const dispatch = useAppDispatch();
  const leads = useAppSelector((state) => state.leads.leads);
  const filterStatus = useAppSelector((state) => state.leads.filterStatus);

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [localSearch, setLocalSearch] = useState('');
  const [sortBy, setSortBy] = useState<'value-desc' | 'score-desc' | 'newest'>('newest');

  // Filter leads
  const filteredLeads = leads
    .filter((lead) => {
      const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
      const query = localSearch.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.title.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'value-desc') return b.value - a.value;
      if (sortBy === 'score-desc') return b.score - a.score;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Calculate high-level metrics
  const totalLeads = leads.length;
  const qualifiedCount = leads.filter((l) => l.status === 'Qualified' || l.status === 'Proposal' || l.status === 'Negotiation').length;
  const totalPotential = leads.reduce((sum, l) => sum + (l.status !== 'Lost' ? l.value : 0), 0);
  const avgScore = leads.length > 0 ? Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length) : 0;

  const handleExportExcel = () => {
    try {
      exportLeadsToExcel(filteredLeads);
      dispatch(
        addToast({
          type: 'success',
          title: 'Exported Leads to Excel 📊',
          message: `${filteredLeads.length} leads exported to Excel workbook.`,
        })
      );
    } catch (err) {
      console.error('Failed to export leads', err);
      dispatch(
        addToast({
          type: 'error',
          title: 'Export Failed',
          message: 'Unable to export leads to Excel.',
        })
      );
    }
  };

  const handleInlineStatusChange = (id: string, status: LeadStatus) => {
    dispatch(updateLeadStatus({ id, status }));
    dispatch(
      addToast({
        type: 'info',
        title: 'Status Updated',
        message: `Lead status changed to ${status}.`,
      })
    );
  };

  const handleDeleteLead = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete lead ${name}?`)) {
      dispatch(deleteLead(id));
      dispatch(
        addToast({
          type: 'warning',
          title: 'Lead Deleted',
          message: `${name} has been removed.`,
        })
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight m-0">
            Lead Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Capture, qualify, and convert prospective enterprise opportunities
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => dispatch(openModal({ type: 'new-lead' }))}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-indigo-300 dark:shadow-none transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Mini KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Total Inbound
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{totalLeads}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Qualified Pipeline
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{qualifiedCount}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Potential Value
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(totalPotential)}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Avg Lead Score
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{avgScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search & Status Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter leads..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            {(['All', 'New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Converted', 'Lost'] as const).map((status) => (
              <button
                key={status}
                onClick={() => dispatch(setFilterStatus(status))}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Sort & View Mode Switcher */}
        <div className="flex items-center justify-between sm:justify-end gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 dark:border-slate-800">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="value-desc">Sort: Highest Deal Value</option>
            <option value="score-desc">Sort: Highest Lead Score</option>
          </select>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500 dark:text-slate-400'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500 dark:text-slate-400'
              }`}
              title="Cards Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering: Table or Grid */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No leads found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            No leads match your current filter or search criteria. Try modifying your filter or create a new lead.
          </p>
          <button
            onClick={() => dispatch(openModal({ type: 'new-lead' }))}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition cursor-pointer"
          >
            Create New Lead
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Lead Name & Company</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Deal Value</th>
                  <th className="py-3 px-4">Lead Score</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Assigned AE</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLeads.map((lead) => {
                  const scoreStyle = getScoreColor(lead.score);
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{lead.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {lead.title} at <span className="font-semibold text-slate-700 dark:text-slate-300">{lead.company}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{lead.email}</div>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleInlineStatusChange(lead.id, e.target.value as LeadStatus)
                          }
                          className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer outline-none focus:border-indigo-500"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Proposal">Proposal</option>
                          <option value="Negotiation">Negotiation</option>
                          <option value="Converted">Converted</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {formatCurrency(lead.value)}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}
                        >
                          {lead.score} / 100
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{lead.source}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {lead.assignedAvatar && (
                            <img
                              src={lead.assignedAvatar}
                              alt={lead.assignedTo}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                          )}
                          <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                            {lead.assignedTo}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              dispatch(
                                openModal({ type: 'lead-followup', data: { lead } })
                              )
                            }
                            title="Schedule Follow-up"
                            className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition cursor-pointer"
                          >
                            <CalendarClock className="w-4 h-4" />
                          </button>
                          {lead.status !== 'Converted' && (
                            <button
                              onClick={() =>
                                dispatch(
                                  openModal({ type: 'convert-lead', data: { lead } })
                                )
                              }
                              title="Convert to Customer & Deal"
                              className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition cursor-pointer"
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              dispatch(openModal({ type: 'edit-lead', data: { lead } }))
                            }
                            title="Edit Lead"
                            className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                            title="Delete Lead"
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

