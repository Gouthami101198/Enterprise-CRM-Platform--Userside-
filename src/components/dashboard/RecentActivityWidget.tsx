import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setActiveTab, openModal } from '../../store/slices/uiSlice';
import { formatTimeAgo } from '../../utils/formatters';
import {
  Phone,
  Video,
  Mail,
  FileText,
  CheckCircle,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { ActivityType } from '../../types/crm';

export const RecentActivityWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const activities = useAppSelector((state) => state.activities.activities);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const isPersonal = workspaceScope === 'personal';
  const currentRepName = currentUser?.name || 'Vikram Malhotra';

  const scopedActivities = isPersonal
    ? activities.filter((a) => a.performedBy === currentRepName || a.performedBy === 'Vikram Malhotra')
    : activities;

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'Call':
        return <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'Meeting':
        return <Video className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case 'Email':
        return <Mail className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
      case 'Deal Won':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isPersonal ? 'My Recent Touchpoints' : 'Recent Customer Activity'}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isPersonal
                ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
            }`}>
              {scopedActivities.length} Logs
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isPersonal ? 'Client calls, meetings & notes logged by me' : 'Calls, meetings, emails & status changes'}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => dispatch(openModal({ type: 'log-activity' }))}
            className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Log Activity"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch(setActiveTab('activities'))}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {activities.slice(0, 5).map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 transition group"
          >
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:shadow-xs transition shrink-0">
              {getActivityIcon(activity.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {activity.title}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1 leading-snug">
                {activity.description}
              </p>

              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded">
                  {activity.entityName}
                </span>
                <span>•</span>
                <span>{activity.performedBy}</span>
                {activity.duration && (
                  <>
                    <span>•</span>
                    <span className="text-slate-400 dark:text-slate-500">{activity.duration}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
