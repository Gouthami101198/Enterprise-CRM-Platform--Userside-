import React from 'react';
import { LeadStatus, DealStage, PriorityLevel, CustomerStatus, CustomerTier } from '../../types/crm';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lead' | 'deal' | 'priority' | 'customer' | 'tier' | 'neutral' | 'custom';
  colorClass?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  colorClass,
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${
        colorClass || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
      } ${className}`}
    >
      {children}
    </span>
  );
};

export const LeadStatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  let colorClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  switch (status) {
    case 'New':
      colorClass = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60';
      break;
    case 'Contacted':
      colorClass = 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60';
      break;
    case 'Qualified':
      colorClass = 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60';
      break;
    case 'Proposal':
      colorClass = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60';
      break;
    case 'Negotiation':
      colorClass = 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60';
      break;
    case 'Converted':
      colorClass = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60';
      break;
    case 'Lost':
      colorClass = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60';
      break;
  }
  return <Badge colorClass={colorClass}>{status}</Badge>;
};

export const DealStageBadge: React.FC<{ stage: DealStage }> = ({ stage }) => {
  let colorClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  switch (stage) {
    case 'Discovery':
      colorClass = 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60';
      break;
    case 'Qualification':
      colorClass = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60';
      break;
    case 'Proposal':
      colorClass = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60';
      break;
    case 'Negotiation':
      colorClass = 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60';
      break;
    case 'Closed Won':
      colorClass = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60';
      break;
    case 'Closed Lost':
      colorClass = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60';
      break;
  }
  return <Badge colorClass={colorClass}>{stage}</Badge>;
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  let colorClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  switch (priority) {
    case 'Urgent':
      colorClass = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60 font-bold';
      break;
    case 'High':
      colorClass = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60';
      break;
    case 'Medium':
      colorClass = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60';
      break;
    case 'Low':
      colorClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
      break;
  }
  return (
    <Badge colorClass={colorClass}>
      {priority === 'Urgent' && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 mr-1.5 animate-pulse" />}
      {priority}
    </Badge>
  );
};

export const CustomerStatusBadge: React.FC<{ status: CustomerStatus }> = ({ status }) => {
  let colorClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  switch (status) {
    case 'Active':
      colorClass = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60';
      break;
    case 'Onboarding':
      colorClass = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60';
      break;
    case 'At Risk':
      colorClass = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60 font-semibold';
      break;
    case 'Churned':
      colorClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700';
      break;
  }
  return <Badge colorClass={colorClass}>{status}</Badge>;
};

export const CustomerTierBadge: React.FC<{ tier: CustomerTier }> = ({ tier }) => {
  let colorClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  switch (tier) {
    case 'Enterprise':
      colorClass = 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 font-semibold';
      break;
    case 'Mid-Market':
      colorClass = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60';
      break;
    case 'Startup':
      colorClass = 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60';
      break;
    case 'SMB':
      colorClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
      break;
  }
  return <Badge colorClass={colorClass}>{tier}</Badge>;
};
