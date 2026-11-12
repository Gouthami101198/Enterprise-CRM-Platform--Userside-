import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconBg?: string;
  subtitle?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  iconBg = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
  subtitle,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full select-none ${
        onClick ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700' : ''
      }`}
    >
      {/* Top Row: Title & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase truncate"
          title={title}
        >
          {title}
        </span>
        <div className={`p-1.5 rounded-lg ${iconBg} shadow-2xs shrink-0 flex items-center justify-center`}>
          {icon}
        </div>
      </div>

      {/* Middle Row: Primary Metric Value (Refined, perfectly proportional font size) */}
      <div className="my-1.5 min-w-0">
        <span
          className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block truncate"
          title={String(value)}
        >
          {value}
        </span>
      </div>

      {/* Bottom Row: Trend Badge & Subtitle aligned cleanly */}
      <div className="flex items-center gap-1.5 flex-wrap text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
              isPositive
                ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60 dark:border dark:border-emerald-800/60'
                : 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/60 dark:border dark:border-rose-800/60'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 shrink-0" />
            ) : (
              <TrendingDown className="w-3 h-3 shrink-0" />
            )}
            <span>{change}</span>
          </span>
        )}
        {subtitle && (
          <span
            className="text-slate-400 dark:text-slate-500 font-medium truncate flex-1 min-w-[60px]"
            title={subtitle}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
