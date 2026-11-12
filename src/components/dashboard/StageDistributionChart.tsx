import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useAppSelector } from '../../store';
import { DealStage } from '../../types/crm';
import { formatCurrency, formatIndianShortCurrency } from '../../utils/formatters';

const STAGE_COLORS: Record<DealStage, string> = {
  Discovery: '#0284c7', // sky-600
  Qualification: '#2563eb', // blue-600
  Proposal: '#d97706', // amber-600
  Negotiation: '#9333ea', // purple-600
  'Closed Won': '#059669', // emerald-600
  'Closed Lost': '#e11d48', // rose-600
};

const STAGE_DISPLAY_NAMES: Record<DealStage, string> = {
  Discovery: 'Discovery',
  Qualification: 'Qualify',
  Proposal: 'Proposal',
  Negotiation: 'Negotiate',
  'Closed Won': 'Won',
  'Closed Lost': 'Lost',
};

interface StageDistributionChartProps {
  range?: 'Q4' | 'FY26' | 'All';
}

export const StageDistributionChart: React.FC<StageDistributionChartProps> = ({
  range = 'Q4',
}) => {
  const deals = useAppSelector((state) => state.deals.deals);
  const theme = useAppSelector((state) => state.ui.theme);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const isDark = theme === 'dark';
  const isPersonal = workspaceScope === 'personal';
  const currentRepName = currentUser?.name || 'Vikram Malhotra';

  const scopedDeals = isPersonal
    ? deals.filter((d) => d.assignedTo === currentRepName || d.assignedTo === 'Vikram Malhotra')
    : deals;

  const stages: DealStage[] = [
    'Discovery',
    'Qualification',
    'Proposal',
    'Negotiation',
    'Closed Won',
  ];

  // Dynamic distribution by timeframe range
  const getStageData = () => {
    if (range === 'FY26') {
      const fyData: Record<DealStage, { count: number; val: number }> = isPersonal
        ? {
            Discovery: { count: 6, val: 38000000 },
            Qualification: { count: 7, val: 54000000 },
            Proposal: { count: 5, val: 68000000 },
            Negotiation: { count: 3, val: 82000000 },
            'Closed Won': { count: 5, val: 98000000 },
            'Closed Lost': { count: 1, val: 12000000 },
          }
        : {
            Discovery: { count: 14, val: 87500000 },
            Qualification: { count: 16, val: 125000000 },
            Proposal: { count: 11, val: 158000000 },
            Negotiation: { count: 7, val: 192000000 },
            'Closed Won': { count: 8, val: 188000000 },
            'Closed Lost': { count: 4, val: 45000000 },
          };
      return stages.map((stage) => ({
        stage,
        shortLabel: STAGE_DISPLAY_NAMES[stage],
        count: fyData[stage]?.count || 0,
        value: fyData[stage]?.val || 0,
        color: STAGE_COLORS[stage],
      }));
    }

    if (range === 'All') {
      const lifeData: Record<DealStage, { count: number; val: number }> = isPersonal
        ? {
            Discovery: { count: 18, val: 115000000 },
            Qualification: { count: 21, val: 162000000 },
            Proposal: { count: 15, val: 185000000 },
            Negotiation: { count: 9, val: 198000000 },
            'Closed Won': { count: 14, val: 245000000 },
            'Closed Lost': { count: 3, val: 32000000 },
          }
        : {
            Discovery: { count: 42, val: 265000000 },
            Qualification: { count: 48, val: 368000000 },
            Proposal: { count: 32, val: 412000000 },
            Negotiation: { count: 19, val: 389000000 },
            'Closed Won': { count: 22, val: 462500000 },
            'Closed Lost': { count: 9, val: 95000000 },
          };
      return stages.map((stage) => ({
        stage,
        shortLabel: STAGE_DISPLAY_NAMES[stage],
        count: lifeData[stage]?.count || 0,
        value: lifeData[stage]?.val || 0,
        color: STAGE_COLORS[stage],
      }));
    }

    // Default: Q4 active deals
    return stages.map((stage) => {
      const stageDeals = scopedDeals.filter((d) => d.stage === stage);
      const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
      return {
        stage,
        shortLabel: STAGE_DISPLAY_NAMES[stage],
        count: stageDeals.length,
        value: totalValue,
        color: STAGE_COLORS[stage],
      };
    });
  };

  const data = getStageData();
  const totalDealsInView = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full transition-colors duration-200">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isPersonal ? 'My Deals by Stage' : 'Pipeline Value by Stage'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {range === 'All'
              ? (isPersonal ? 'Career cumulative deal progression' : 'All-time enterprise deal progression')
              : range === 'FY26'
                ? (isPersonal ? 'FY 2026 personal volume across stages' : 'FY 2026 enterprise volume across stages')
                : (isPersonal ? 'Personal active deal volume' : 'Active deal volume across progression stages')}
          </p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
          isPersonal
            ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80'
            : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950'
        }`}>
          {totalDealsInView} {range === 'Q4' ? 'Active Deals' : 'Deals'}
        </span>
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} vertical={false} />
            <XAxis
              dataKey="shortLabel"
              stroke={isDark ? '#94a3b8' : '#64748b'}
              fontSize={11}
              fontWeight={600}
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
              cursor={{ fill: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.6)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                      <p className="font-bold text-slate-200">{item.stage}</p>
                      <p className="text-indigo-300 font-semibold">
                        Pipeline Value: {formatCurrency(item.value)}
                      </p>
                      <p className="text-slate-400">Total Deals: {item.count}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
