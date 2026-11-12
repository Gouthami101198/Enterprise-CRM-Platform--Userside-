import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setActiveTab,
  setMobileMenuOpen,
  openModal,
  NavigationTab,
} from '../../store/slices/uiSlice';
import {
  LayoutDashboard,
  Users,
  Kanban,
  Building2,
  CheckSquare,
  Activity as ActivityIcon,
  X,
  Sparkles,
  BarChart3,
  Bell,
  Palette,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const mobileMenuOpen = useAppSelector((state) => state.ui.mobileMenuOpen);
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const leads = useAppSelector((state) => state.leads.leads);
  const deals = useAppSelector((state) => state.deals.deals);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const notifications = useAppSelector((state) => state.notifications.items);

  if (!mobileMenuOpen) return null;

  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const activeDealsCount = deals.filter(
    (d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost'
  ).length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: workspaceScope === 'personal' ? 'My Cockpit' : 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      badge: workspaceScope === 'personal' ? 'AE' : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 font-bold',
    },
    {
      id: 'leads' as NavigationTab,
      label: 'Lead Management',
      icon: <Users className="w-5 h-5 shrink-0" />,
      badge: newLeadsCount > 0 ? `${newLeadsCount} new` : null,
      badgeColor: 'bg-blue-500/20 text-blue-300 font-bold',
    },
    {
      id: 'pipeline' as NavigationTab,
      label: 'Sales Pipeline',
      icon: <Kanban className="w-5 h-5 shrink-0" />,
      badge: activeDealsCount > 0 ? `${activeDealsCount}` : null,
      badgeColor: 'bg-purple-500/20 text-purple-300 font-semibold',
    },
    {
      id: 'customers' as NavigationTab,
      label: 'Customer Profiles',
      icon: <Building2 className="w-5 h-5 shrink-0" />,
      badge: null,
    },
    {
      id: 'tasks' as NavigationTab,
      label: 'Task Management',
      icon: <CheckSquare className="w-5 h-5 shrink-0" />,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 font-bold',
    },
    {
      id: 'activities' as NavigationTab,
      label: 'Activity Tracking',
      icon: <ActivityIcon className="w-5 h-5 shrink-0" />,
      badge: null,
    },
    {
      id: 'analytics' as NavigationTab,
      label: 'Reports & Analytics',
      icon: <BarChart3 className="w-5 h-5 shrink-0" />,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 font-bold',
    },
    {
      id: 'notifications' as NavigationTab,
      label: 'Notifications',
      icon: <Bell className="w-5 h-5 shrink-0" />,
      badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : null,
      badgeColor: 'bg-rose-500 text-white font-black',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(setMobileMenuOpen(false))}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-slate-900 text-slate-300 flex flex-col h-full shadow-2xl z-10">
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">
              Vanguard<span className="text-amber-400">CRM</span>
            </span>
          </div>
          <button
            onClick={() => dispatch(setMobileMenuOpen(false))}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  dispatch(setActiveTab(item.id));
                  dispatch(setMobileMenuOpen(false));
                }}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition cursor-pointer ${isActive
                  ? 'bg-amber-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card */}
        <div
          onClick={() => {
            dispatch(openModal({ type: 'user-profile' }));
            dispatch(setMobileMenuOpen(false));
          }}
          className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between cursor-pointer hover:bg-slate-950/80 transition"
        >
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'Vikram Malhotra'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/40"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate">
                {currentUser?.name || 'Vikram Malhotra'}
              </span>
              <span className="text-xs text-slate-400 truncate">
                {currentUser?.role || 'Senior Enterprise AE'}
              </span>
            </div>
          </div>
          <Palette className="w-4 h-4 text-amber-400" />
        </div>
      </div>
    </div>
  );
};

