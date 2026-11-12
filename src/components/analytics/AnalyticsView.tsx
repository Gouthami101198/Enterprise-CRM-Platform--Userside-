import React, { useState } from 'react';
import { useAppSelector } from '../../store';
import { RevenueChart } from '../dashboard/RevenueChart';
import { StageDistributionChart } from '../dashboard/StageDistributionChart';
import { LeadSourceChart } from '../dashboard/LeadSourceChart';
import { RepPerformanceChart } from '../dashboard/RepPerformanceChart';
import { StatCard } from '../common/StatCard';
import { formatCurrency } from '../../utils/formatters';
import {
  TrendingUp,
  Percent,
  Trophy,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [dateRange, setDateRange] = useState<'Q4' | 'FY26' | 'All'>('Q4');
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const isPersonal = workspaceScope === 'personal';

  // Dynamic range datasets for Q4, FY26, and Lifetime
  const metricsData = {
    Q4: {
      quotaAttainment: '83%',
      quotaChange: '+18.4%',
      quotaSubtitle: isPersonal ? '₹6.20 Cr / ₹7.50 Cr Q4 Quota' : '₹15.85 Cr / ₹18.00 Cr Q4 Team Quota',
      conversionRate: '13%',
      conversionChange: '+5.2%',
      conversionSubtitle: isPersonal ? '1 converted of 2 leads' : '1 converted of 8 leads',
      dealsRevenue: formatCurrency(isPersonal ? 41500000 : 41500000),
      dealsRevenueChange: '+24.1%',
      dealsSubtitle: isPersonal ? '1 deal closed won in Q4' : '2 deals closed won in Q4',
      taskRate: '17%',
      taskChange: '+12.0%',
      taskSubtitle: isPersonal ? '1 of 2 tasks completed in Q4' : '1 of 6 tasks completed in Q4',
      funnelRows: [
        { stage: 'Discovery', count: isPersonal ? 1 : 4, val: isPersonal ? 12000000 : 24500000, prob: '25%', time: '12 days', status: 'Optimal' },
        { stage: 'Qualification', count: isPersonal ? 1 : 5, val: isPersonal ? 8500000 : 38000000, prob: '45%', time: '18 days', status: 'Pacing Well' },
        { stage: 'Proposal', count: isPersonal ? 1 : 3, val: isPersonal ? 18000000 : 49000000, prob: '70%', time: '14 days', status: 'High Intent' },
        { stage: 'Negotiation', count: isPersonal ? 1 : 2, val: isPersonal ? 25000000 : 62000000, prob: '90%', time: '9 days', status: 'Legal Review' },
        { stage: 'Closed Won', count: isPersonal ? 1 : 2, val: isPersonal ? 41500000 : 41500000, prob: '100%', time: '28 days', status: 'Executed' },
      ],
    },
    FY26: {
      quotaAttainment: '94%',
      quotaChange: '+26.8%',
      quotaSubtitle: isPersonal ? '₹21.15 Cr / ₹22.50 Cr Annual Quota' : '₹56.40 Cr / ₹60.00 Cr Annual Team Quota',
      conversionRate: '34%',
      conversionChange: '+14.5%',
      conversionSubtitle: isPersonal ? '6 converted of 16 leads' : '11 converted of 32 leads',
      dealsRevenue: formatCurrency(isPersonal ? 98000000 : 188000000),
      dealsRevenueChange: '+38.5%',
      dealsSubtitle: isPersonal ? '4 deals closed won in FY26' : '8 deals closed won in FY26',
      taskRate: '78%',
      taskChange: '+31.2%',
      taskSubtitle: isPersonal ? '12 of 15 tasks completed in FY26' : '28 of 36 tasks completed in FY26',
      funnelRows: [
        { stage: 'Discovery', count: isPersonal ? 4 : 14, val: isPersonal ? 34000000 : 87500000, prob: '25%', time: '14 days', status: 'Optimal' },
        { stage: 'Qualification', count: isPersonal ? 5 : 16, val: isPersonal ? 48000000 : 125000000, prob: '45%', time: '19 days', status: 'Pacing Well' },
        { stage: 'Proposal', count: isPersonal ? 3 : 11, val: isPersonal ? 62000000 : 158000000, prob: '70%', time: '16 days', status: 'High Intent' },
        { stage: 'Negotiation', count: isPersonal ? 2 : 7, val: isPersonal ? 75000000 : 192000000, prob: '90%', time: '11 days', status: 'Legal Review' },
        { stage: 'Closed Won', count: isPersonal ? 4 : 8, val: isPersonal ? 98000000 : 188000000, prob: '100%', time: '26 days', status: 'Executed' },
      ],
    },
    All: {
      quotaAttainment: '112%',
      quotaChange: '+34.2%',
      quotaSubtitle: isPersonal ? '₹54.60 Cr / ₹48.75 Cr Career Quota' : '₹142.50 Cr / ₹125.00 Cr Enterprise Quota',
      conversionRate: '42%',
      conversionChange: '+21.0%',
      conversionSubtitle: isPersonal ? '18 converted of 42 leads' : '38 converted of 90 leads',
      dealsRevenue: formatCurrency(isPersonal ? 245000000 : 462500000),
      dealsRevenueChange: '+52.4%',
      dealsSubtitle: isPersonal ? '12 deals closed won lifetime' : '22 deals closed won lifetime',
      taskRate: '91%',
      taskChange: '+45.0%',
      taskSubtitle: isPersonal ? '44 of 48 tasks completed lifetime' : '98 of 108 tasks completed lifetime',
      funnelRows: [
        { stage: 'Discovery', count: isPersonal ? 12 : 42, val: isPersonal ? 89000000 : 265000000, prob: '25%', time: '15 days', status: 'Optimal' },
        { stage: 'Qualification', count: isPersonal ? 14 : 48, val: isPersonal ? 115000000 : 368000000, prob: '45%', time: '21 days', status: 'Pacing Well' },
        { stage: 'Proposal', count: isPersonal ? 9 : 32, val: isPersonal ? 142000000 : 412000000, prob: '70%', time: '17 days', status: 'High Intent' },
        { stage: 'Negotiation', count: isPersonal ? 6 : 19, val: isPersonal ? 168000000 : 389000000, prob: '90%', time: '12 days', status: 'Legal Review' },
        { stage: 'Closed Won', count: isPersonal ? 12 : 22, val: isPersonal ? 245000000 : 462500000, prob: '100%', time: '27 days', status: 'Executed' },
      ],
    },
  };

  const currentMetrics = metricsData[dateRange];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Executive Business Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Reports & Performance Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time pipeline analytics, quota attainment, lead conversions, and task completion velocity
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200/60 dark:border-slate-700/60">
          {(['Q4', 'FY26', 'All'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${dateRange === range
                  ? 'bg-amber-600 text-white font-bold shadow-sm shadow-amber-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
            >
              {range === 'Q4' ? 'Q4 (Current)' : range === 'FY26' ? 'FY 2026' : 'Lifetime'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Personal Quota Attainment"
          value={currentMetrics.quotaAttainment}
          change={currentMetrics.quotaChange}
          isPositive={true}
          subtitle={currentMetrics.quotaSubtitle}
          icon={<Trophy className="w-4 h-4" />}
          iconBg="bg-amber-500/10 text-amber-500"
        />

        <StatCard
          title="Lead Conversion Rate"
          value={currentMetrics.conversionRate}
          change={currentMetrics.conversionChange}
          isPositive={true}
          subtitle={currentMetrics.conversionSubtitle}
          icon={<Percent className="w-4 h-4" />}
          iconBg="bg-emerald-500/10 text-emerald-500"
        />

        <StatCard
          title="Completed Deals Revenue"
          value={currentMetrics.dealsRevenue}
          change={currentMetrics.dealsRevenueChange}
          isPositive={true}
          subtitle={currentMetrics.dealsSubtitle}
          icon={<TrendingUp className="w-4 h-4" />}
          iconBg="bg-purple-500/10 text-purple-500"
        />

        <StatCard
          title="Task Execution Rate"
          value={currentMetrics.taskRate}
          change={currentMetrics.taskChange}
          isPositive={true}
          subtitle={currentMetrics.taskSubtitle}
          icon={<CheckCircle2 className="w-4 h-4" />}
          iconBg="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Charts Grid Row 1: Revenue Performance & Stage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart
            timeframeOverride={dateRange === 'All' ? 'All' : dateRange === 'FY26' ? '1Y' : '6M'}
            showFilter={false}
          />
        </div>
        <div>
          <StageDistributionChart range={dateRange} />
        </div>
      </div>

      {/* Charts Grid Row 2: Lead Acquisition Donut & AE Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <LeadSourceChart range={dateRange} />
        </div>
        <div className="lg:col-span-2">
          <RepPerformanceChart range={dateRange} />
        </div>
      </div>

      {/* Conversion Funnel Table Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sales Stage Velocity & Funnel Health
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Deal progression times, weighted win probabilities, and total stage volumes ({dateRange === 'Q4' ? 'Q4 Current' : dateRange === 'FY26' ? 'FY 2026' : 'Lifetime'})
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
            Healthy Velocity
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-y border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Pipeline Stage</th>
                <th className="py-3 px-4">Deals Count</th>
                <th className="py-3 px-4">Stage Total Value (₹)</th>
                <th className="py-3 px-4">Probability</th>
                <th className="py-3 px-4">Avg Cycle Time</th>
                <th className="py-3 px-4">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentMetrics.funnelRows.map((row) => (
                <tr key={row.stage} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{row.stage}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{row.count} deals</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{formatCurrency(row.val)}</td>
                  <td className="py-3 px-4 text-amber-600 dark:text-amber-400 font-bold">{row.prob}</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{row.time}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
