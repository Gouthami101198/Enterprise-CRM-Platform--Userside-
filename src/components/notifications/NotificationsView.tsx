import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  setNotificationFilter,
} from '../../store/slices/notificationsSlice';
import { setActiveTab, NavigationTab } from '../../store/slices/uiSlice';
import { formatTimeAgo } from '../../utils/formatters';
import { NotificationType } from '../../types/crm';
import {
  Bell,
  CheckCheck,
  Trash2,
  Users,
  Clock,
  Video,
  Briefcase,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.items);
  const filter = useAppSelector((state) => state.notifications.filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'lead_assigned':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'task_reminder':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'meeting_alert':
        return <Video className="w-4 h-4 text-purple-500" />;
      case 'deal_update':
        return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case 'system':
      default:
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
    }
  };

  const handleActionClick = (linkTab?: string, id?: string) => {
    if (id) {
      dispatch(markAsRead(id));
    }
    if (linkTab) {
      dispatch(setActiveTab(linkTab as NavigationTab));
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification Center</h2>
              {unreadCount > 0 && (
                <span className="text-xs font-bold text-white bg-rose-600 px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time lead assignments, task deadlines, meetings, and pipeline alerts
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-700 transition cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'lead_assigned', label: 'Lead Assignments' },
          { id: 'task_reminder', label: 'Task Reminders' },
          { id: 'meeting_alert', label: 'Meetings' },
          { id: 'deal_update', label: 'Pipeline Deals' },
          { id: 'system', label: 'System & Quota' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch(setNotificationFilter(tab.id as any))}
            className={`px-3 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              filter === tab.id
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800">
            <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Notifications</h4>
            <p className="text-xs text-slate-400 mt-1">You are completely caught up on this channel!</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.read
                  ? 'bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 opacity-80'
                  : 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800/80 shadow-xs ring-1 ring-indigo-500/10'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 block font-medium">
                    {formatTimeAgo(notif.timestamp)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {notif.linkTab && (
                  <button
                    onClick={() => handleActionClick(notif.linkTab, notif.id)}
                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="Open Record"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                {!notif.read && (
                  <button
                    onClick={() => dispatch(markAsRead(notif.id))}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    title="Mark as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => dispatch(deleteNotification(notif.id))}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

