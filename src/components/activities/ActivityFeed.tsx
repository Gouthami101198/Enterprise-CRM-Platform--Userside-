import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  deleteActivity,
  setFilterType,
} from '../../store/slices/activitiesSlice';
import { openModal, addToast, setActiveTab } from '../../store/slices/uiSlice';
import { openCustomerDrawer } from '../../store/slices/customersSlice';
import { setSelectedDealId } from '../../store/slices/dealsSlice';
import { setSelectedLeadId } from '../../store/slices/leadsSlice';
import { formatTimeAgo, formatDate } from '../../utils/formatters';
import { ActivityType } from '../../types/crm';
import {
  Plus,
  Search,
  Phone,
  Video,
  Mail,
  FileText,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const dispatch = useAppDispatch();
  const activities = useAppSelector((state) => state.activities.activities);
  const filterType = useAppSelector((state) => state.activities.filterType);

  const [localSearch, setLocalSearch] = useState('');

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    const matchesType = filterType === 'All' || act.type === filterType;
    const query = localSearch.toLowerCase();
    const matchesSearch =
      act.title.toLowerCase().includes(query) ||
      act.description.toLowerCase().includes(query) ||
      act.entityName.toLowerCase().includes(query) ||
      act.performedBy.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  // Metrics
  const totalCalls = activities.filter((a) => a.type === 'Call').length;
  const totalMeetings = activities.filter((a) => a.type === 'Meeting').length;
  const totalEmails = activities.filter((a) => a.type === 'Email').length;

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'Call':
        return <Phone className="w-4 h-4 text-blue-600" />;
      case 'Meeting':
        return <Video className="w-4 h-4 text-purple-600" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-sky-600" />;
      case 'Deal Won':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete activity log "${title}"?`)) {
      dispatch(deleteActivity(id));
      dispatch(
        addToast({
          type: 'warning',
          title: 'Activity Deleted',
          message: `"${title}" has been removed.`,
        })
      );
    }
  };

  const handleEntityClick = (type: 'Lead' | 'Deal' | 'Customer' | 'Task', id: string) => {
    if (type === 'Customer') {
      dispatch(openCustomerDrawer(id));
      dispatch(setActiveTab('customers'));
    } else if (type === 'Deal') {
      dispatch(setSelectedDealId(id));
      dispatch(setActiveTab('pipeline'));
    } else if (type === 'Lead') {
      dispatch(setSelectedLeadId(id));
      dispatch(setActiveTab('leads'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight m-0">
            Activity Tracking & Interactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete audit trail of sales calls, meetings, emails, and client interactions
          </p>
        </div>

        <button
          onClick={() => dispatch(openModal({ type: 'log-activity' }))}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-indigo-300 dark:shadow-none transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Activity</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Calls Logged
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{totalCalls}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Meetings Held
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{totalMeetings}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Emails Tracked
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{totalEmails}</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity notes, accounts, participants..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          {(['All', 'Call', 'Meeting', 'Email', 'Note', 'Status Change'] as const).map((type) => (
            <button
              key={type}
              onClick={() => dispatch(setFilterType(type as any))}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterType === type
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {type === 'All' ? 'All Activities' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6">
        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {filteredActivities.length === 0 ? (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs">No activity logs found matching the filter.</p>
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-4 group">
                {/* Dot / Icon */}
                <div className="absolute -left-6 mt-1 p-1 rounded-full bg-white dark:bg-slate-900 ring-4 ring-white dark:ring-slate-900 shadow-xs">
                  <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-slate-700 transition">
                    {getActivityIcon(act.type)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex-1 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/90 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60 transition">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{act.title}</span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600">
                        {act.type}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {formatTimeAgo(act.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEntityClick(act.entityType, act.entityId)}
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md cursor-pointer"
                      >
                        <span>{act.entityType}: {act.entityName}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>

                      {act.outcome && (
                        <span className="text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-600 text-[11px] font-medium">
                          Outcome: {act.outcome}
                        </span>
                      )}

                      {act.duration && (
                        <span className="text-slate-400 dark:text-slate-500 text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{act.duration}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <span className="text-[11px]">By {act.performedBy}</span>
                      <button
                        onClick={() => handleDelete(act.id, act.title)}
                        title="Delete Log"
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

