import React from 'react';
import { MetricsGrid } from './MetricsGrid';
import { RevenueChart } from './RevenueChart';
import { StageDistributionChart } from './StageDistributionChart';
import { LeadSourceChart } from './LeadSourceChart';
import { RepPerformanceChart } from './RepPerformanceChart';
import { RecentActivityWidget } from './RecentActivityWidget';
import { UrgentTasksWidget } from './UrgentTasksWidget';
import { useAppDispatch, useAppSelector } from '../../store';
import { openModal, setWorkspaceScope, setActiveTab } from '../../store/slices/uiSlice';
import {
  Sparkles,
  UserPlus,
  Briefcase,
  CheckSquare,
  PhoneCall,
  Calendar,
  User,
  Users,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const currentDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const isPersonal = workspaceScope === 'personal';

  return (
    <div className="space-y-6">
      {/* Welcome & Scope Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-stone-900 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentDate}</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">
                {isPersonal ? 'AE Cockpit Mode' : 'Executive Overview'}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white m-0">
              {isPersonal
                ? `Welcome back, ${currentUser?.name || 'Vikram Malhotra'} 👋`
                : 'Enterprise Sales Performance 👋'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {isPersonal ? (
                <>
                  Attained <span className="font-bold text-emerald-400">₹6.20 Cr (83%)</span> of your ₹7.50 Cr quota across <span className="font-semibold text-white">3 active deals</span>.
                </>
              ) : (
                <>
                  Consolidated performance across strategic accounts: <span className="font-bold text-emerald-400">₹4.15 Cr</span> won revenue.
                </>
              )}
            </p>
          </div>

          {/* Scope Switcher & Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            {/* Direct Scope Toggle Pill */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs font-semibold">
              <button
                onClick={() => dispatch(setWorkspaceScope('personal'))}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${isPersonal
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Cockpit</span>
              </button>
              <button
                onClick={() => dispatch(setWorkspaceScope('team'))}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${!isPersonal
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Team View</span>
              </button>
            </div>

            {/* Quick Actions */}
            <button
              onClick={() => dispatch(openModal({ type: 'new-lead' }))}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-amber-500/20"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Lead</span>
            </button>
            <button
              onClick={() => dispatch(openModal({ type: 'new-deal' }))}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer border border-white/10"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-300" />
              <span>New Deal</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <MetricsGrid />

      {/* Primary Analytics Grid: Revenue Performance & Stage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <StageDistributionChart />
        </div>
      </div>

      {/* Secondary Analytics Grid: Channel Breakdown & AE Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <LeadSourceChart />
        </div>
        <div className="lg:col-span-2">
          <RepPerformanceChart />
        </div>
      </div>

      {/* Operational Widgets: Urgent Tasks & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UrgentTasksWidget />
        <RecentActivityWidget />
      </div>
    </div>
  );
};

