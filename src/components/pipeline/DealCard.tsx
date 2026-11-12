import React, { useState } from 'react';
import { Deal, DealStage } from '../../types/crm';
import { PriorityBadge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAppDispatch } from '../../store';
import { updateDealStage, deleteDeal } from '../../store/slices/dealsSlice';
import { addActivity } from '../../store/slices/activitiesSlice';
import { openModal, addToast } from '../../store/slices/uiSlice';
import {
  Calendar,
  Building,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Trophy,
  XCircle,
} from 'lucide-react';

interface DealCardProps {
  deal: Deal;
}

const STAGES: DealStage[] = [
  'Discovery',
  'Qualification',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentStageIndex = STAGES.indexOf(deal.stage);

  const handleMoveStage = (newStage: DealStage) => {
    dispatch(updateDealStage({ id: deal.id, stage: newStage }));

    // Log activity
    dispatch(
      addActivity({
        type: newStage === 'Closed Won' ? 'Deal Won' : 'Status Change',
        title: `Deal Moved to ${newStage}`,
        description: `Deal "${deal.title}" was moved from ${deal.stage} to ${newStage}.`,
        entityType: 'Deal',
        entityId: deal.id,
        entityName: deal.title,
        performedBy: deal.assignedTo,
        performedAvatar: deal.assignedAvatar,
        outcome: `Stage: ${newStage}`,
      })
    );

    dispatch(
      addToast({
        type: newStage === 'Closed Won' ? 'success' : 'info',
        title: newStage === 'Closed Won' ? 'Deal Won! 🏆' : 'Deal Stage Updated',
        message: `"${deal.title}" moved to ${newStage}.`,
      })
    );
  };

  const handleDelete = () => {
    if (window.confirm(`Delete deal "${deal.title}"?`)) {
      dispatch(deleteDeal(deal.id));
      dispatch(
        addToast({
          type: 'warning',
          title: 'Deal Deleted',
          message: `"${deal.title}" has been deleted.`,
        })
      );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-150 flex flex-col justify-between group">
      <div>
        {/* Top bar */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate leading-snug">
              {deal.title}
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              <Building className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{deal.company}</span>
            </div>
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-30"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    dispatch(openModal({ type: 'edit-deal', data: { deal } }));
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Deal</span>
                </button>
                {deal.stage !== 'Closed Won' && (
                  <button
                    onClick={() => {
                      handleMoveStage('Closed Won');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Mark as Won</span>
                  </button>
                )}
                {deal.stage !== 'Closed Lost' && (
                  <button
                    onClick={() => {
                      handleMoveStage('Closed Lost');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Mark as Lost</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDelete();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer border-t border-slate-100 dark:border-slate-700"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Value & Probability */}
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(deal.value)}
          </span>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {deal.probability}% win prob
          </span>
        </div>

        {/* Probability Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              deal.stage === 'Closed Won'
                ? 'bg-emerald-500'
                : deal.stage === 'Closed Lost'
                ? 'bg-rose-500'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${deal.probability}%` }}
          />
        </div>

        {/* Priority & Close Date */}
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <PriorityBadge priority={deal.priority} />
          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 font-medium">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{formatDate(deal.expectedCloseDate)}</span>
          </div>
        </div>
      </div>

      {/* Footer controls: quick stage mover */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {deal.assignedAvatar && (
            <img
              src={deal.assignedAvatar}
              alt={deal.assignedTo}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              title={deal.assignedTo}
            />
          )}
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[80px]">
            {deal.assignedTo.split(' ')[0]}
          </span>
        </div>

        {/* Quick Prev / Next stage arrow buttons */}
        <div className="flex items-center gap-1">
          {currentStageIndex > 0 && currentStageIndex < 4 && (
            <button
              onClick={() => handleMoveStage(STAGES[currentStageIndex - 1])}
              title={`Move back to ${STAGES[currentStageIndex - 1]}`}
              className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStageIndex < 3 && (
            <button
              onClick={() => handleMoveStage(STAGES[currentStageIndex + 1])}
              title={`Advance to ${STAGES[currentStageIndex + 1]}`}
              className="p-1 rounded-md text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer font-bold"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

