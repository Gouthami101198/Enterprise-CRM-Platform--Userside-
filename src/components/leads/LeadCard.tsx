import React from 'react';
import { Lead, LeadStatus } from '../../types/crm';
import { LeadStatusBadge } from '../common/Badge';
import { formatCurrency, getScoreColor } from '../../utils/formatters';
import { useAppDispatch } from '../../store';
import { updateLeadStatus, deleteLead } from '../../store/slices/leadsSlice';
import { openModal, addToast } from '../../store/slices/uiSlice';
import {
  Mail,
  Phone,
  Building,
  MoreVertical,
  Sparkles,
  Edit2,
  Trash2,
  ArrowRightCircle,
  CalendarClock,
} from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const scoreStyle = getScoreColor(lead.score);

  const handleStatusChange = (newStatus: LeadStatus) => {
    dispatch(updateLeadStatus({ id: lead.id, status: newStatus }));
    dispatch(
      addToast({
        type: 'info',
        title: 'Lead Status Updated',
        message: `${lead.name} moved to ${newStatus}.`,
      })
    );
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete lead ${lead.name}?`)) {
      dispatch(deleteLead(lead.id));
      dispatch(
        addToast({
          type: 'warning',
          title: 'Lead Deleted',
          message: `${lead.name} has been removed.`,
        })
      );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group">
      <div>
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{lead.name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{lead.company}</span>
              {lead.title && <span className="truncate">• {lead.title}</span>}
            </div>
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-20"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    dispatch(openModal({ type: 'lead-followup', data: { lead } }));
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 cursor-pointer"
                >
                  <CalendarClock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Schedule Follow-up</span>
                </button>
                <button
                  onClick={() => {
                    dispatch(openModal({ type: 'edit-lead', data: { lead } }));
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => {
                    dispatch(openModal({ type: 'convert-lead', data: { lead } }));
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Convert to Customer</span>
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer border-t border-slate-100 dark:border-slate-700"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete Lead</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Value and Score Row */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Deal Potential
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {formatCurrency(lead.value)}
            </span>
          </div>

          <div
            className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}
            title={`Lead Score: ${lead.score}/100`}
          >
            <span className="w-2 h-2 rounded-full bg-current opacity-75" />
            <span>Score: {lead.score}</span>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="mt-4">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Stage / Status
          </label>
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
            className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition cursor-pointer"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Contact links */}
        <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate"
          >
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{lead.email}</span>
          </a>
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{lead.phone}</span>
            </a>
          )}
        </div>

        {/* Notes preview */}
        {lead.notes && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            {lead.notes}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {lead.assignedAvatar && (
            <img
              src={lead.assignedAvatar}
              alt={lead.assignedTo}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
            />
          )}
          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[100px]">
            {lead.assignedTo}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(openModal({ type: 'lead-followup', data: { lead } }))}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition cursor-pointer"
            title="Schedule Follow-up"
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Follow-up</span>
          </button>

          {lead.status !== 'Converted' ? (
            <button
              onClick={() => dispatch(openModal({ type: 'convert-lead', data: { lead } }))}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition cursor-pointer"
            >
              <span>Convert</span>
              <ArrowRightCircle className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-600">Converted</span>
          )}
        </div>
      </div>
    </div>
  );
};

