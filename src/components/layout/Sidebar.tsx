import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setActiveTab,
  toggleSidebar,
  openModal,
  NavigationTab,
} from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import {
  LayoutDashboard,
  Users,
  Kanban,
  Building2,
  CheckSquare,
  Activity as ActivityIcon,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  LogOut,
  BarChart3,
  Bell,
  Palette,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const theme = useAppSelector((state) => state.ui.theme);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const leads = useAppSelector((state) => state.leads.leads);
  const deals = useAppSelector((state) => state.deals.deals);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const notifications = useAppSelector((state) => state.notifications.items);

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
    <aside
      className={`hidden md:flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out shrink-0 select-none z-30 ${sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => dispatch(setActiveTab('dashboard'))}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-base tracking-tight leading-tight">
                Vanguard<span className="text-amber-400">CRM</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Enterprise Platform
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!sidebarCollapsed && (
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Workspace</span>
            <span className="text-[10px] text-amber-400 font-normal">
              {workspaceScope === 'personal' ? 'Personal' : 'Team'}
            </span>
          </div>
        )}

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => dispatch(setActiveTab(item.id))}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer group ${isActive
                ? 'bg-amber-600/90 text-white shadow-md shadow-amber-600/20 font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                } ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>

              {!sidebarCollapsed && item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Enterprise Security Banner */}
      {!sidebarCollapsed && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ISO 27001 & RBI Compliant</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Bank-grade 256-bit AES encryption across Indian enterprise records.
          </p>
        </div>
      )}

      {/* User Session Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'}`}>
          <div
            className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-85 transition"
            onClick={() => dispatch(openModal({ type: 'user-profile' }))}
            title="Open Profile & Settings"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'Vikram Malhotra'}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/40"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-bold text-white truncate">
                  {currentUser?.name || 'Vikram Malhotra'}
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  {currentUser?.role || 'Senior Enterprise AE'}
                </span>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => dispatch(openModal({ type: 'user-profile' }))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition cursor-pointer"
                title="Profile & Settings"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => dispatch(logout())}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
