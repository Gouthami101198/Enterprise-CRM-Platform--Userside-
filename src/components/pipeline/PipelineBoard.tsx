import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setFilterRep,
  updateDealStage,
  deleteDeal,
} from '../../store/slices/dealsSlice';
import { openModal, addToast } from '../../store/slices/uiSlice';
import { DealCard } from './DealCard';
import { DealStageBadge, PriorityBadge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Deal, DealStage } from '../../types/crm';
import { initialSalesReps } from '../../store/mockData';
import {
  Plus,
  Search,
  Kanban,
  List,
  Filter,
  IndianRupee,
  TrendingUp,
  Briefcase,
  Trophy,
  Edit2,
  Trash2,
} from 'lucide-react';

const STAGES: { id: DealStage; label: string; headerColor: string; dotColor: string }[] = [
  {
    id: 'Discovery',
    label: 'Discovery',
    headerColor: 'border-t-sky-500 bg-sky-50/40 dark:bg-sky-950/20',
    dotColor: 'bg-sky-500',
  },
  {
    id: 'Qualification',
    label: 'Qualification',
    headerColor: 'border-t-blue-500 bg-blue-50/40 dark:bg-blue-950/20',
    dotColor: 'bg-blue-500',
  },
  {
    id: 'Proposal',
    label: 'Proposal',
    headerColor: 'border-t-amber-500 bg-amber-50/40 dark:bg-amber-950/20',
    dotColor: 'bg-amber-500',
  },
  {
    id: 'Negotiation',
    label: 'Negotiation',
    headerColor: 'border-t-purple-500 bg-purple-50/40 dark:bg-purple-950/20',
    dotColor: 'bg-purple-500',
  },
  {
    id: 'Closed Won',
    label: 'Closed Won',
    headerColor: 'border-t-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20',
    dotColor: 'bg-emerald-500',
  },
  {
    id: 'Closed Lost',
    label: 'Closed Lost',
    headerColor: 'border-t-rose-400 bg-rose-50/40 dark:bg-rose-950/20',
    dotColor: 'bg-rose-500',
  },
];

export const PipelineBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const deals = useAppSelector((state) => state.deals.deals);
  const filterRep = useAppSelector((state) => state.deals.filterRep);

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [localSearch, setLocalSearch] = useState('');

  // Filter deals
  const filteredDeals = deals.filter((deal) => {
    const matchesRep = filterRep === 'All' || deal.assignedTo === filterRep;
    const query = localSearch.toLowerCase();
    const matchesSearch =
      deal.title.toLowerCase().includes(query) ||
      deal.company.toLowerCase().includes(query) ||
      deal.contactName.toLowerCase().includes(query);
    return matchesRep && matchesSearch;
  });

  // Calculate high-level pipeline stats
  const activePipelineDeals = filteredDeals.filter(
    (d) => d.stage !== 'Closed Lost'
  );
  const totalPipelineValue = activePipelineDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedPipelineValue = activePipelineDeals.reduce(
    (sum, d) => sum + (d.value * d.probability) / 100,
    0
  );
  const wonValue = filteredDeals
    .filter((d) => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.value, 0);

  const handleInlineStageChange = (id: string, stage: DealStage) => {
    dispatch(updateDealStage({ id, stage }));
    dispatch(
      addToast({
        type: stage === 'Closed Won' ? 'success' : 'info',
        title: 'Deal Stage Updated',
        message: `Deal moved to ${stage}.`,
      })
    );
  };

  const handleDeleteDeal = (id: string, title: string) => {
    if (window.confirm(`Delete deal "${title}"?`)) {
      dispatch(deleteDeal(id));
      dispatch(
        addToast({
          type: 'warning',
          title: 'Deal Deleted',
          message: `"${title}" removed from pipeline.`,
        })
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight m-0">
            Sales Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual stage progression, deal probability forecasting & pipeline tracking
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => dispatch(openModal({ type: 'new-deal' }))}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-indigo-300 dark:shadow-none transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      {/* Pipeline Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Active Pipeline Value
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {formatCurrency(totalPipelineValue)}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
              {activePipelineDeals.length} active opportunities
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Weighted Forecast
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {formatCurrency(weightedPipelineValue)}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
              Based on probability weighting
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Closed Won Revenue
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(wonValue)}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
              Executed annual revenue
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search & Rep Filter */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deals, company..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={filterRep}
              onChange={(e) => dispatch(setFilterRep(e.target.value))}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Sales Representatives</option>
              {initialSalesReps.map((rep) => (
                <option key={rep.id} value={rep.name}>
                  {rep.name} ({rep.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
                }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
                }`}
            >
              <List className="w-4 h-4" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Pipeline Display: Kanban Board or Table */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1240px]">
            {STAGES.map((stage) => {
              const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
              const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

              return (
                <div
                  key={stage.id}
                  className="flex-1 min-w-[280px] max-w-[320px] bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col max-h-[750px]"
                >
                  {/* Stage Header */}
                  <div
                    className={`p-3.5 rounded-t-2xl border-t-4 border-b border-slate-200/80 dark:border-slate-800 ${stage.headerColor}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
                        <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                          {stage.label}
                        </h3>
                      </div>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/90 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
                        {stageDeals.length}
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(stageTotal)}
                    </div>
                  </div>

                  {/* Deals column */}
                  <div className="p-3 space-y-3 overflow-y-auto flex-1">
                    {stageDeals.length === 0 ? (
                      <div className="h-32 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-3">
                        <span className="text-xs font-semibold">No deals</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          Drag or move deals here
                        </span>
                      </div>
                    ) : (
                      stageDeals.map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Deal Title & Company</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Deal Value</th>
                  <th className="py-3 px-4">Probability</th>
                  <th className="py-3 px-4">Expected Close</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Rep</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{deal.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{deal.company}</div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={deal.stage}
                        onChange={(e) =>
                          handleInlineStageChange(deal.id, e.target.value as DealStage)
                        }
                        className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer outline-none focus:border-indigo-500"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                      {formatCurrency(deal.value)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{deal.probability}%</span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {formatDate(deal.expectedCloseDate)}
                    </td>

                    <td className="py-3 px-4">
                      <PriorityBadge priority={deal.priority} />
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {deal.assignedAvatar && (
                          <img
                            src={deal.assignedAvatar}
                            alt={deal.assignedTo}
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                        )}
                        <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                          {deal.assignedTo}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() =>
                            dispatch(openModal({ type: 'edit-deal', data: { deal } }))
                          }
                          title="Edit Deal"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDeal(deal.id, deal.title)}
                          title="Delete Deal"
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

