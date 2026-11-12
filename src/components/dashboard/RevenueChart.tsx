import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useAppSelector } from '../../store';
import {
  revenueTrends6Months,
  revenueTrendsFullYear,
  revenueTrendsLifetime,
  personalRevenueTrends6Months,
  personalRevenueTrendsFullYear,
  personalRevenueTrendsLifetime,
} from '../../store/mockData';
import { formatCurrency, formatIndianShortCurrency } from '../../utils/formatters';
import { TrendingUp, Target, User, Users } from 'lucide-react';

interface RevenueChartProps {
  timeframeOverride?: '6M' | '1Y' | 'All';
  showFilter?: boolean;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  timeframeOverride,
  showFilter = true,
}) => {
  const [internalTimeframe, setInternalTimeframe] = useState<'6M' | '1Y' | 'All'>('6M');
  const timeframe = timeframeOverride || internalTimeframe;
  const setTimeframe = setInternalTimeframe;

  const theme = useAppSelector((state) => state.ui.theme);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const isDark = theme === 'dark';
  const isPersonal = workspaceScope === 'personal';

  // Dynamic dataset based on Personal vs Team mode and timeframe
  const getChartData = () => {
    if (isPersonal) {
      if (timeframe === 'All') return personalRevenueTrendsLifetime;
      return timeframe === '6M' ? personalRevenueTrends6Months : personalRevenueTrendsFullYear;
    } else {
      if (timeframe === 'All') return revenueTrendsLifetime;
      return timeframe === '6M' ? revenueTrends6Months : revenueTrendsFullYear;
    }
  };

  const chartData = getChartData();

  const totalPeriodRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalPeriodTarget = chartData.reduce((sum, item) => sum + item.target, 0);
  const quotaAttainment = Math.round((totalPeriodRevenue / totalPeriodTarget) * 100);

  const primaryColor = isPersonal ? '#d97706' : '#4f46e5';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full transition-colors duration-200">
      {/* Header with Title and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isPersonal ? 'My Revenue Performance vs Target' : 'Team Revenue Performance vs Target'}
            </h3>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              isPersonal
                ? 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60'
                : 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60'
            }`}>
              {quotaAttainment}% Quota Attained
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isPersonal
              ? (timeframe === 'All'
                  ? 'Personal all-time career revenue: FY23 - FY26'
                  : timeframe === '6M'
                    ? 'Personal 6-month pacing: Jun - Nov (Proj)'
                    : 'Personal full fiscal year: Jan - Dec (12M)')
              : (timeframe === 'All'
                  ? 'Consolidated company revenue: FY23 - FY26'
                  : timeframe === '6M'
                    ? 'Consolidated team performance: Jun - Nov (Projected)'
                    : 'Team full fiscal year: Jan - Dec (Full 12 Months)')}
          </p>
        </div>

        {/* Dynamic Switcher */}
        {showFilter && (
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto shrink-0">
            <button
              onClick={() => setTimeframe('6M')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${timeframe === '6M'
                  ? (isPersonal ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-bold' : 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold')
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setTimeframe('1Y')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${timeframe === '1Y'
                  ? (isPersonal ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-bold' : 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold')
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Full Year
            </button>
            {timeframe === 'All' && (
              <button
                onClick={() => setTimeframe('All')}
                className="px-3 py-1.5 rounded-lg transition-all cursor-pointer bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-bold"
              >
                Lifetime
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg shrink-0 ${isPersonal ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'}`}>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block tracking-wider">
              {timeframe === 'All'
                ? (isPersonal ? 'Lifetime Closed Rev' : 'Total Closed Rev')
                : timeframe === '6M'
                  ? (isPersonal ? 'My 6-Month Rev' : 'Team 6-Month Rev')
                  : (isPersonal ? 'My Annual Rev' : 'Team Annual Rev')}
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {formatCurrency(totalPeriodRevenue)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
            <Target className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block tracking-wider">
              {timeframe === 'All'
                ? (isPersonal ? 'Lifetime Quota' : 'Total Quota')
                : timeframe === '6M'
                  ? (isPersonal ? 'My 6-Month Quota' : 'Team 6-Month Quota')
                  : (isPersonal ? 'My Annual Quota' : 'Team Annual Quota')}
            </span>
            <span className="text-sm font-black text-slate-700 dark:text-slate-300">
              {formatCurrency(totalPeriodTarget)}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? '#475569' : '#94a3b8'} stopOpacity={0.25} />
                <stop offset="95%" stopColor={isDark ? '#475569' : '#94a3b8'} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} vertical={false} />
            <XAxis
              dataKey="month"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={timeframe === '1Y' ? 10 : 11}
              interval={0}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }}
            />
            <YAxis
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatIndianShortCurrency(v)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
                      <p className="font-bold text-slate-200">{label}</p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-amber-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                          {isPersonal ? 'My Revenue:' : 'Closed Revenue:'}
                        </span>
                        <span className="font-bold">
                          {formatCurrency(Number(payload[0]?.value))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-400" />
                          {isPersonal ? 'My Quota:' : 'Target Quota:'}
                        </span>
                        <span className="font-semibold text-slate-300">
                          {formatCurrency(Number(payload[1]?.value))}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name={isPersonal ? 'My Revenue' : 'Actual Revenue'}
              stroke={primaryColor}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="target"
              name={isPersonal ? 'My Quota' : 'Target Quota'}
              stroke={isDark ? '#64748b' : '#94a3b8'}
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorTarget)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
