import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  openCustomerDrawer,
  deleteCustomer,
  setFilterStatus,
  setFilterTier,
} from '../../store/slices/customersSlice';
import { openModal, addToast } from '../../store/slices/uiSlice';
import { CustomerStatusBadge, CustomerTierBadge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CustomerStatus, CustomerTier } from '../../types/crm';
import {
  Plus,
  Search,
  Filter,
  Building2,
  IndianRupee,
  HeartPulse,
  AlertTriangle,
  ArrowRight,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export const CustomerList: React.FC = () => {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.customers.customers);
  const filterStatus = useAppSelector((state) => state.customers.filterStatus);
  const filterTier = useAppSelector((state) => state.customers.filterTier);

  const [localSearch, setLocalSearch] = useState('');

  // Filtered customers
  const filteredCustomers = customers.filter((cust) => {
    const matchesStatus = filterStatus === 'All' || cust.status === filterStatus;
    const matchesTier = filterTier === 'All' || cust.tier === filterTier;
    const query = localSearch.toLowerCase();
    const matchesSearch =
      cust.name.toLowerCase().includes(query) ||
      cust.company.toLowerCase().includes(query) ||
      cust.industry.toLowerCase().includes(query) ||
      cust.accountManager.toLowerCase().includes(query);
    return matchesStatus && matchesTier && matchesSearch;
  });

  // High level metrics
  const totalLTV = customers.reduce((sum, c) => sum + c.lifetimeValue, 0);
  const totalMRR = customers.reduce((sum, c) => sum + c.mrr, 0);
  const avgHealth = customers.length > 0
    ? Math.round(customers.reduce((sum, c) => sum + c.healthScore, 0) / customers.length)
    : 0;
  const atRiskCount = customers.filter((c) => c.status === 'At Risk').length;

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete customer account "${name}"?`)) {
      dispatch(deleteCustomer(id));
      dispatch(
        addToast({
          type: 'warning',
          title: 'Account Removed',
          message: `Customer account "${name}" has been deleted.`,
        })
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0">
            Customer Profiles & Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enterprise portfolio management, relationship health scores, and interaction timelines
          </p>
        </div>

        <button
          onClick={() => dispatch(openModal({ type: 'new-customer' }))}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-indigo-300 dark:shadow-none transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Customer</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Active Accounts
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{customers.length}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Monthly MRR
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(totalMRR)}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Portfolio Health
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{avgHealth}%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              At Risk Accounts
            </span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400">{atRiskCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts by company, contact, manager..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            {(['All', 'Active', 'Onboarding', 'At Risk', 'Churned'] as const).map((status) => (
              <button
                key={status}
                onClick={() => dispatch(setFilterStatus(status))}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Tier Dropdown */}
          <select
            value={filterTier}
            onChange={(e) => dispatch(setFilterTier(e.target.value as CustomerTier | 'All'))}
            className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Tiers</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Mid-Market">Mid-Market</option>
            <option value="Startup">Startup</option>
            <option value="SMB">SMB</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Account / Company</th>
                <th className="py-3 px-4">Tier & Status</th>
                <th className="py-3 px-4">Health Score</th>
                <th className="py-3 px-4">Monthly MRR</th>
                <th className="py-3 px-4">Lifetime LTV</th>
                <th className="py-3 px-4">Account Manager</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 dark:text-slate-500">
                    No customers match the current filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => dispatch(openCustomerDrawer(cust.id))}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition flex items-center gap-1.5">
                        <span>{cust.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500" />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{cust.industry}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{cust.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <CustomerTierBadge tier={cust.tier} />
                        <CustomerStatusBadge status={cust.status} />
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{cust.healthScore}%</span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              cust.healthScore >= 80
                                ? 'bg-emerald-500'
                                : cust.healthScore >= 60
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${cust.healthScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-black text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(cust.mrr)}
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                      {formatCurrency(cust.lifetimeValue)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {cust.accountManagerAvatar && (
                          <img
                            src={cust.accountManagerAvatar}
                            alt={cust.accountManager}
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                        )}
                        <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                          {cust.accountManager}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => dispatch(openCustomerDrawer(cust.id))}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition cursor-pointer"
                        >
                          360 Profile
                        </button>
                        <button
                          onClick={() =>
                            dispatch(openModal({ type: 'edit-customer', data: { customer: cust } }))
                          }
                          title="Edit Customer"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cust.id, cust.name)}
                          title="Delete Customer"
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

