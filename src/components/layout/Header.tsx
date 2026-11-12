import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  toggleMobileMenu,
  openModal,
  setActiveTab,
  setGlobalSearch,
  addToast,
  setWorkspaceScope,
} from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { setSelectedLeadId } from '../../store/slices/leadsSlice';
import { setSelectedDealId } from '../../store/slices/dealsSlice';
import { openCustomerDrawer } from '../../store/slices/customersSlice';
import { markAsRead } from '../../store/slices/notificationsSlice';
import {
  Menu,
  Search,
  Plus,
  Bell,
  UserPlus,
  Briefcase,
  CheckSquare,
  PhoneCall,
  Download,
  Users,
  Building2,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Palette,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency, formatTimeAgo } from '../../utils/formatters';
import { exportCRMToExcel } from '../../utils/exportExcel';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const globalSearch = useAppSelector((state) => state.ui.globalSearch);
  const theme = useAppSelector((state) => state.ui.theme);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const leads = useAppSelector((state) => state.leads.leads);
  const deals = useAppSelector((state) => state.deals.deals);
  const customers = useAppSelector((state) => state.customers.customers);
  const notifications = useAppSelector((state) => state.notifications.items);

  const [searchFocused, setSearchFocused] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) {
        setQuickAddOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered results for global search dropdown
  const query = globalSearch.trim().toLowerCase();
  const matchedLeads = query
    ? leads
        .filter(
          (l) =>
            l.name.toLowerCase().includes(query) ||
            l.company.toLowerCase().includes(query) ||
            l.email.toLowerCase().includes(query)
        )
        .slice(0, 3)
    : [];

  const matchedDeals = query
    ? deals
        .filter(
          (d) =>
            d.title.toLowerCase().includes(query) ||
            d.company.toLowerCase().includes(query)
        )
        .slice(0, 3)
    : [];

  const matchedCustomers = query
    ? customers
        .filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.company.toLowerCase().includes(query) ||
            c.industry.toLowerCase().includes(query)
        )
        .slice(0, 3)
    : [];

  const hasSearchResults =
    query.length > 0 &&
    (matchedLeads.length > 0 || matchedDeals.length > 0 || matchedCustomers.length > 0);

  const handleExportData = () => {
    try {
      exportCRMToExcel(leads, deals, customers);
      dispatch(
        addToast({
          type: 'success',
          title: 'Excel Export Completed 📊',
          message: 'Saved multi-sheet workbook (.xlsx) with Leads, Deals, and Customers.',
        })
      );
    } catch (err) {
      console.error('Failed to export Excel file', err);
      dispatch(
        addToast({
          type: 'error',
          title: 'Export Failed',
          message: 'Unable to generate Excel spreadsheet.',
        })
      );
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(
      addToast({
        type: 'info',
        title: 'Signed Out',
        message: 'You have been signed out of your session.',
      })
    );
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => dispatch(toggleMobileMenu())}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative w-full">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leads, deals, customers, companies..."
              value={globalSearch}
              onChange={(e) => dispatch(setGlobalSearch(e.target.value))}
              onFocus={() => setSearchFocused(true)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100/80 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-sm text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
            {globalSearch && (
              <button
                onClick={() => dispatch(setGlobalSearch(''))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-200/60 dark:bg-slate-700 rounded px-1.5 py-0.5 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchFocused && hasSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 max-h-96 overflow-y-auto">
              {matchedLeads.length > 0 && (
                <div className="px-3 py-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" /> Leads
                  </div>
                  {matchedLeads.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => {
                        dispatch(setSelectedLeadId(lead.id));
                        dispatch(setActiveTab('leads'));
                        setSearchFocused(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{lead.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 ml-2">({lead.company})</span>
                      </div>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(lead.value)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {matchedDeals.length > 0 && (
                <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-purple-500" /> Deals
                  </div>
                  {matchedDeals.map((deal) => (
                    <button
                      key={deal.id}
                      onClick={() => {
                        dispatch(setSelectedDealId(deal.id));
                        dispatch(setActiveTab('pipeline'));
                        setSearchFocused(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{deal.title}</span>
                        <span className="text-slate-400 ml-2">{deal.stage}</span>
                      </div>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(deal.value)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {matchedCustomers.length > 0 && (
                <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500" /> Customers
                  </div>
                  {matchedCustomers.map((cust) => (
                    <button
                      key={cust.id}
                      onClick={() => {
                        dispatch(openCustomerDrawer(cust.id));
                        dispatch(setActiveTab('customers'));
                        setSearchFocused(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{cust.name}</span>
                        <span className="text-slate-400 ml-2">{cust.industry}</span>
                      </div>
                      <span className="text-slate-500 dark:text-slate-400">{cust.tier}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Workspace Scope Switcher Pill: Personal (My Cockpit) vs Team */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 sm:p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs font-semibold">
          <button
            onClick={() => dispatch(setWorkspaceScope('personal'))}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              workspaceScope === 'personal'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Personal Workspace: My Cockpit, assigned leads & deals"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>My Cockpit</span>
          </button>
          <button
            onClick={() => dispatch(setWorkspaceScope('team'))}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              workspaceScope === 'team'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Team Workspace: Executive dashboard and all reps"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team</span>
          </button>
        </div>

        {/* Live sync badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-full text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Cloud Sync</span>
        </div>

        {/* Export Excel Workbook Button */}
        <button
          onClick={handleExportData}
          title="Download CRM Data (.xlsx Excel Workbook)"
          className="hidden sm:inline-flex p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">CRM Notifications</span>
                <button
                  onClick={() => {
                    dispatch(setActiveTab('notifications'));
                    setNotificationsOpen(false);
                  }}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      dispatch(markAsRead(notif.id));
                      if (notif.linkTab) {
                        dispatch(setActiveTab(notif.linkTab as any));
                      }
                      setNotificationsOpen(false);
                    }}
                    className={`p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition cursor-pointer ${
                      !notif.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{notif.title}</p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block font-medium">
                      {formatTimeAgo(notif.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => {
                    dispatch(setActiveTab('notifications'));
                    setNotificationsOpen(false);
                  }}
                  className="w-full py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  Open Notification Center
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Add Dropdown */}
        <div ref={quickAddRef} className="relative">
          <button
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-200 dark:shadow-none transition cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-200" />
          </button>

          {quickAddOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
              <button
                onClick={() => {
                  dispatch(openModal({ type: 'new-lead' }));
                  setQuickAddOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2.5 transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-blue-500" />
                <span>New Lead</span>
              </button>
              <button
                onClick={() => {
                  dispatch(openModal({ type: 'new-deal' }));
                  setQuickAddOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2.5 transition cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-purple-500" />
                <span>New Deal</span>
              </button>
              <button
                onClick={() => {
                  dispatch(openModal({ type: 'new-customer' }));
                  setQuickAddOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2.5 transition cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-emerald-500" />
                <span>New Customer</span>
              </button>
              <button
                onClick={() => {
                  dispatch(openModal({ type: 'new-task' }));
                  setQuickAddOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2.5 transition cursor-pointer"
              >
                <CheckSquare className="w-4 h-4 text-amber-500" />
                <span>New Task</span>
              </button>
              <button
                onClick={() => {
                  dispatch(openModal({ type: 'log-activity' }));
                  setQuickAddOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2.5 transition cursor-pointer border-t border-slate-100 dark:border-slate-800"
              >
                <PhoneCall className="w-4 h-4 text-rose-500" />
                <span>Log Activity</span>
              </button>
            </div>
          )}
        </div>

        {/* Current User Profile Dropdown & Settings */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'Vikram Malhotra'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50">
              <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black text-slate-900 dark:text-white block truncate">
                  {currentUser?.name || 'Vikram Malhotra'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                  {currentUser?.email || 'vikram.m@vanguardcrm.in'}
                </span>
                <span className="mt-1 inline-block text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                  {currentUser?.role || 'Senior Enterprise AE'}
                </span>
              </div>

              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    dispatch(openModal({ type: 'user-profile' }));
                    setProfileOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-500" />
                    <span>Profile & Settings</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                    Edit
                  </span>
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setProfileOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2 transition cursor-pointer border-t border-slate-100 dark:border-slate-800 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
