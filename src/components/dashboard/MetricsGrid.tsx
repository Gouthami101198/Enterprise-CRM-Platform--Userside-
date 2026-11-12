import React from 'react';
import { useAppSelector } from '../../store';
import { StatCard } from '../common/StatCard';
import { formatCurrency } from '../../utils/formatters';
import {
  IndianRupee,
  Trophy,
  Users,
  Percent,
} from 'lucide-react';

export const MetricsGrid: React.FC = () => {
  const deals = useAppSelector((state) => state.deals.deals);
  const leads = useAppSelector((state) => state.leads.leads);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const isPersonal = workspaceScope === 'personal';
  const currentRepName = currentUser?.name || 'Vikram Malhotra';

  // Scope deals
  const scopedDeals = isPersonal
    ? deals.filter((d) => d.assignedTo === currentRepName || d.assignedTo === 'Vikram Malhotra' || d.assignedTo === 'Priya Patel')
    : deals;

  // Scope leads
  const scopedLeads = isPersonal
    ? leads.filter((l) => l.assignedTo === currentRepName || l.assignedTo === 'Vikram Malhotra' || l.assignedTo === 'Priya Patel')
    : leads;

  // Calculate metrics based on current scope
  const totalPipeline = scopedDeals
    .filter((d) => d.stage !== 'Closed Lost')
    .reduce((sum, d) => sum + d.value, 0);

  const closedWonRevenue = scopedDeals
    .filter((d) => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.value, 0);

  const closedDeals = scopedDeals.filter((d) => d.stage === 'Closed Won' || d.stage === 'Closed Lost');
  const wonDeals = scopedDeals.filter((d) => d.stage === 'Closed Won');
  const winRate = closedDeals.length > 0 ? Math.round((wonDeals.length / closedDeals.length) * 100) : (isPersonal ? 100 : 67);

  const activeLeads = scopedLeads.filter((l) => l.status !== 'Converted' && l.status !== 'Lost').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <StatCard
        title={isPersonal ? 'Pipeline Value' : 'Total Pipeline'}
        value={formatCurrency(totalPipeline)}
        change={isPersonal ? '+19.5%' : '+14.2%'}
        isPositive={true}
        subtitle={isPersonal ? `${scopedDeals.length} active deals in pipeline` : 'Across all active stages'}
        icon={<IndianRupee className="w-4 h-4" />}
        iconBg={isPersonal ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-950/80 dark:text-amber-400' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400'}
      />

      <StatCard
        title={isPersonal ? 'Closed Won' : 'Closed Revenue'}
        value={formatCurrency(closedWonRevenue)}
        change={isPersonal ? '+28.4%' : '+22.5%'}
        isPositive={true}
        subtitle={isPersonal ? '83% of ₹7.50 Cr quota' : 'Won this fiscal year'}
        icon={<Trophy className="w-4 h-4" />}
        iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400"
      />

      <StatCard
        title="Win Rate"
        value={`${winRate}%`}
        change={isPersonal ? '+7.8%' : '+4.1%'}
        isPositive={true}
        subtitle={isPersonal ? 'Personal closing ratio' : 'Won vs lost deals'}
        icon={<Percent className="w-4 h-4" />}
        iconBg="bg-cyan-50 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400"
      />

      <StatCard
        title={isPersonal ? 'Assigned Leads' : 'Active Leads'}
        value={activeLeads}
        change={isPersonal ? '+25%' : '+18%'}
        isPositive={true}
        subtitle={isPersonal ? 'In active qualification' : 'In pipeline queue'}
        icon={<Users className="w-4 h-4" />}
        iconBg="bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400"
      />
    </div>
  );
};
