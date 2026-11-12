import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeCustomerDrawer, addCustomerTag } from '../../store/slices/customersSlice';
import { openModal } from '../../store/slices/uiSlice';
import { CustomerStatusBadge, CustomerTierBadge } from '../common/Badge';
import { formatCurrency, formatDate, formatTimeAgo } from '../../utils/formatters';
import {
  X,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Calendar,
  IndianRupee,
  TrendingUp,
  Activity as ActivityIcon,
  Plus,
  PhoneCall,
  Video,
  FileText,
  Briefcase,
  CheckCircle2,
  Tag,
  Edit2,
} from 'lucide-react';
import { ActivityType } from '../../types/crm';

export const CustomerProfileDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const drawerOpen = useAppSelector((state) => state.customers.drawerOpen);
  const selectedCustomerId = useAppSelector((state) => state.customers.selectedCustomerId);
  const customers = useAppSelector((state) => state.customers.customers);
  const deals = useAppSelector((state) => state.deals.deals);
  const activities = useAppSelector((state) => state.activities.activities);

  const [newTagInput, setNewTagInput] = useState('');

  const customer = customers.find((c) => c.id === selectedCustomerId);

  if (!drawerOpen || !customer) return null;

  // Filter associated deals
  const customerDeals = deals.filter(
    (d) =>
      d.company.toLowerCase().includes(customer.name.toLowerCase()) ||
      customer.name.toLowerCase().includes(d.company.toLowerCase())
  );

  // Filter customer interaction timeline
  const customerActivities = activities.filter(
    (a) =>
      a.entityName.toLowerCase().includes(customer.name.toLowerCase()) ||
      customer.name.toLowerCase().includes(a.entityName.toLowerCase())
  );

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    dispatch(addCustomerTag({ id: customer.id, tag: newTagInput.trim() }));
    setNewTagInput('');
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'Call':
        return <PhoneCall className="w-3.5 h-3.5 text-blue-600" />;
      case 'Meeting':
        return <Video className="w-3.5 h-3.5 text-purple-600" />;
      case 'Email':
        return <Mail className="w-3.5 h-3.5 text-sky-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(closeCustomerDrawer())}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 overflow-y-auto">
        {/* Header */}
        <div className="p-6 bg-slate-900 dark:bg-slate-950 text-white relative border-b border-slate-800">
          <button
            onClick={() => dispatch(closeCustomerDrawer())}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <CustomerTierBadge tier={customer.tier} />
            <CustomerStatusBadge status={customer.status} />
            <span className="text-xs text-slate-400">
              Customer since {formatDate(customer.since)}
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">{customer.name}</h2>
          <p className="text-xs text-slate-300 mt-1">{customer.company} • {customer.industry}</p>

          {/* Quick Action Buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                dispatch(
                  openModal({
                    type: 'log-activity',
                    data: {
                      defaultEntity: {
                        type: 'Customer',
                        id: customer.id,
                        name: customer.name,
                      },
                    },
                  })
                )
              }
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Log Call</span>
            </button>
            <button
              onClick={() =>
                dispatch(
                  openModal({
                    type: 'new-task',
                    data: {
                      defaultEntity: {
                        type: 'Customer',
                        id: customer.id,
                        name: customer.name,
                      },
                    },
                  })
                )
              }
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
            <button
              onClick={() =>
                dispatch(openModal({ type: 'edit-customer', data: { customer } }))
              }
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer ml-auto"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Account</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Financials & Health KPI Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Lifetime Value
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">
                {formatCurrency(customer.lifetimeValue)}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Monthly MRR
              </span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
                {formatCurrency(customer.mrr)}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Health Score
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {customer.healthScore}%
                </span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      customer.healthScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${customer.healthScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Account Manager Details */}
          <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Contact & Account Metadata
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`mailto:${customer.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 truncate">
                  {customer.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`tel:${customer.phone}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  {customer.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href={customer.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 truncate underline"
                >
                  {customer.website}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{customer.employees} Employees</span>
              </div>
              <div className="sm:col-span-2 flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{customer.address}</span>
              </div>
            </div>

            {/* Account Manager Box */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 dark:text-slate-500">Assigned Account Manager:</span>
              <div className="flex items-center gap-2">
                {customer.accountManagerAvatar && (
                  <img
                    src={customer.accountManagerAvatar}
                    alt={customer.accountManager}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                )}
                <span className="text-xs font-bold text-slate-800 dark:text-white">
                  {customer.accountManager}
                </span>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
              Account Tags & Certifications
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {customer.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>{tag}</span>
                </span>
              ))}

              <form onSubmit={handleAddTag} className="inline-flex items-center">
                <input
                  type="text"
                  placeholder="+ Add tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="px-2 py-0.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none w-24"
                />
              </form>
            </div>
          </div>

          {/* Active Deals Section */}
          <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Associated Pipeline Deals</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{customerDeals.length} deals</span>
            </h3>

            {customerDeals.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No active deals in pipeline.</p>
            ) : (
              <div className="space-y-2">
                {customerDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{deal.title}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{deal.stage} • {deal.probability}% win prob</span>
                    </div>
                    <span className="font-black text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(deal.value)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interaction History Timeline */}
          <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Interaction History & Activities
              </h3>
              <button
                onClick={() =>
                  dispatch(
                    openModal({
                      type: 'log-activity',
                      data: {
                        defaultEntity: {
                          type: 'Customer',
                          id: customer.id,
                          name: customer.name,
                        },
                      },
                    })
                  )
                }
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Interaction</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {customerActivities.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  No interactions recorded yet. Click "Log Interaction" above.
                </div>
              ) : (
                customerActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getActivityIcon(act.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{act.title}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {formatTimeAgo(act.timestamp)}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{act.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                        <span>Logged by {act.performedBy}</span>
                        {act.outcome && <span>• {act.outcome}</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

