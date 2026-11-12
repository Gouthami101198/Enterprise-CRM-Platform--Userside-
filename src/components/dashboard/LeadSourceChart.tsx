import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAppSelector } from '../../store';
import { LeadSource } from '../../types/crm';

const SOURCE_COLORS: Record<LeadSource, string> = {
  Website: '#4f46e5', // indigo-600
  Referral: '#10b981', // emerald-500
  LinkedIn: '#0ea5e9', // sky-500
  'Cold Outreach': '#f59e0b', // amber-500
  Webinar: '#8b5cf6', // purple-500
  'Google Ads': '#ec4899', // pink-500
  Partner: '#06b6d4', // cyan-500
};

interface LeadSourceChartProps {
  range?: 'Q4' | 'FY26' | 'All';
}

export const LeadSourceChart: React.FC<LeadSourceChartProps> = ({
  range = 'Q4',
}) => {
  const leads = useAppSelector((state) => state.leads.leads);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const isPersonal = workspaceScope === 'personal';
  const currentRepName = currentUser?.name || 'Vikram Malhotra';

  const scopedLeads = isPersonal
    ? leads.filter((l) => l.assignedTo === currentRepName || l.assignedTo === 'Vikram Malhotra')
    : leads;

  const getSourceData = () => {
    if (range === 'FY26') {
      const counts: Record<string, number> = isPersonal
        ? { Website: 6, Referral: 5, LinkedIn: 3, 'Cold Outreach': 2 }
        : { Website: 12, Referral: 9, LinkedIn: 6, 'Cold Outreach': 3, Webinar: 2 };
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      return Object.entries(counts).map(([name, count]) => ({
        name,
        value: count,
        percentage: Math.round((count / total) * 100),
        color: SOURCE_COLORS[name as LeadSource] || '#64748b',
      }));
    }

    if (range === 'All') {
      const counts: Record<string, number> = isPersonal
        ? { Website: 18, Referral: 14, LinkedIn: 9, 'Cold Outreach': 5, Webinar: 4 }
        : { Website: 38, Referral: 24, LinkedIn: 18, 'Cold Outreach': 10, Webinar: 8, 'Google Ads': 6 };
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      return Object.entries(counts).map(([name, count]) => ({
        name,
        value: count,
        percentage: Math.round((count / total) * 100),
        color: SOURCE_COLORS[name as LeadSource] || '#64748b',
      }));
    }

    // Default: Q4 active leads
    const sourceCounts: Record<string, number> = {};
    scopedLeads.forEach((l) => {
      sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
    });
    const total = scopedLeads.length || 1;
    return Object.entries(sourceCounts).map(([name, count]) => ({
      name,
      value: count,
      percentage: Math.round((count / total) * 100),
      color: SOURCE_COLORS[name as LeadSource] || '#64748b',
    }));
  };

  const data = getSourceData();
  const totalLeadsInView = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full transition-colors duration-200">
      <div className="mb-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {isPersonal ? 'My Lead Acquisition Channels' : 'Lead Acquisition by Channel'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {range === 'All'
            ? `All-time channel distribution (${totalLeadsInView} leads)`
            : range === 'FY26'
              ? `FY 2026 acquisition breakdown (${totalLeadsInView} leads)`
              : isPersonal
                ? `Channel breakdown for my ${scopedLeads.length} assigned leads`
                : 'Inbound and outbound source efficiency breakdown'}
        </p>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Donut Chart */}
        <div className="w-48 h-48 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-0.5 border border-slate-800">
                        <p className="font-bold text-slate-200">{item.name}</p>
                        <p className="text-indigo-300 font-semibold">
                          {item.value} leads ({item.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={data}
                innerRadius={52}
                outerRadius={76}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{leads.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Leads
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
                <span className="text-slate-400 dark:text-slate-500 text-[11px] w-8 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
