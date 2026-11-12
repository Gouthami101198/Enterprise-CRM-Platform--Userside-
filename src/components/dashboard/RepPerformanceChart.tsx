import React from 'react';
import { initialSalesReps } from '../../store/mockData';
import { formatCurrency } from '../../utils/formatters';
import { useAppSelector } from '../../store';
import { Trophy, Target, Zap, Clock, TrendingUp } from 'lucide-react';

interface RepPerformanceChartProps {
  range?: 'Q4' | 'FY26' | 'All';
}

export const RepPerformanceChart: React.FC<RepPerformanceChartProps> = ({
  range = 'Q4',
}) => {
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const isPersonal = workspaceScope === 'personal';

  const myQuota = range === 'All'
    ? 487500000
    : range === 'FY26'
      ? 225000000
      : (currentUser?.quota || 75000000);

  const myClosedWon = range === 'All'
    ? 546000000
    : range === 'FY26'
      ? 211500000
      : (currentUser?.closedWonAmount || 62000000);

  const myPercent = Math.min(100, Math.round((myClosedWon / myQuota) * 100));

  const cycleDays = range === 'All' ? '15 Days' : range === 'FY26' ? '16 Days' : '18 Days';
  const winRate = range === 'All' ? '88%' : range === 'FY26' ? '84%' : '80%';
  const label = range === 'All' ? 'Lifetime Career Progress' : range === 'FY26' ? 'FY26 Annual Quota Progress' : 'Q4 Quota Milestone';

  if (isPersonal) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">My Quota Pacing & Velocity</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Personal quota attainment & milestone progress
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full">
            {myPercent}% Attained
          </span>
        </div>

        {/* Big Personal Progress Bar */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>{label}</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(myClosedWon)} / {formatCurrency(myQuota)}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${myPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {myClosedWon >= myQuota ? (
              <span className="text-emerald-500 font-bold">Quota target achieved! Supercharged accelerator payout active.</span>
            ) : (
              <>Remaining to 100%: <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(myQuota - myClosedWon)}</span>. Deals in pipeline expected to exceed milestone.</>
            )}
          </p>
        </div>

        {/* 3 Quick Personal Performance Badges */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Cycle</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">{cycleDays}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Win Rate</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{winRate}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              {range === 'All' ? 'Career Incentive' : range === 'FY26' ? 'FY26 Commission' : 'Q4 Incentive'}
            </span>
            <span className="text-sm font-black text-amber-600 dark:text-amber-400">
              {range === 'All' ? '₹1.64 Cr' : range === 'FY26' ? '₹63.4 L' : '₹18.6 L'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Sales Leaderboard</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quota pacing and closed volume per AE</p>
        </div>
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
          Q4 Pacing
        </span>
      </div>

      <div className="space-y-4">
        {initialSalesReps.map((rep) => {
          const percent = Math.min(100, Math.round((rep.revenue / rep.target) * 100));
          return (
            <div key={rep.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={rep.avatar}
                    alt={rep.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{rep.name}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1.5">
                      ({rep.dealsCount} deals)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(rep.revenue)}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-1">
                    / {formatCurrency(rep.target)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex items-center">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percent >= 90
                      ? 'bg-emerald-500'
                      : percent >= 75
                      ? 'bg-indigo-600'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500">
                <span>Quota Attainment</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
