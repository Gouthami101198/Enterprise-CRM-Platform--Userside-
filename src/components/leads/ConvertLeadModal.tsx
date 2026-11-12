import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateLeadStatus } from '../../store/slices/leadsSlice';
import { addCustomer } from '../../store/slices/customersSlice';
import { addDeal } from '../../store/slices/dealsSlice';
import { addActivity } from '../../store/slices/activitiesSlice';
import { closeModal, addToast, setActiveTab } from '../../store/slices/uiSlice';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CustomerTier, DealStage } from '../../types/crm';
import { formatCurrency } from '../../utils/formatters';
import { Sparkles, ArrowRight, Building2, Briefcase } from 'lucide-react';

export const ConvertLeadModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const modalData = useAppSelector((state) => state.ui.modalData);

  const isOpen = activeModal === 'convert-lead';
  const lead = modalData?.lead;

  const [dealTitle, setDealTitle] = useState('');
  const [dealValue, setDealValue] = useState(0);
  const [dealStage, setDealStage] = useState<DealStage>('Qualification');
  const [customerTier, setCustomerTier] = useState<CustomerTier>('Enterprise');
  const [mrr, setMrr] = useState(0);

  useEffect(() => {
    if (lead) {
      setDealTitle(`${lead.company} Enterprise Expansion`);
      setDealValue(lead.value || 5000000);
      setMrr(Math.round((lead.value || 5000000) / 12));
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mark lead as Converted
    dispatch(updateLeadStatus({ id: lead.id, status: 'Converted' }));

    // 2. Create customer record
    dispatch(
      addCustomer({
        name: lead.company,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        industry: 'Technology & Enterprise',
        tier: customerTier,
        status: 'Onboarding',
        accountManager: lead.assignedTo,
        accountManagerAvatar: lead.assignedAvatar,
        lifetimeValue: dealValue,
        mrr: mrr,
        healthScore: 90,
        website: `https://${lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        address: 'Enterprise Headquarters',
        employees: '250+',
        since: new Date().toISOString().split('T')[0],
        notes: `Converted from lead: ${lead.name} (${lead.title}). ${lead.notes}`,
        tags: ['New Customer', customerTier, 'Lead Conversion'],
      })
    );

    // 3. Create deal in pipeline
    dispatch(
      addDeal({
        title: dealTitle,
        company: lead.company,
        contactName: lead.name,
        contactEmail: lead.email,
        value: dealValue,
        stage: dealStage,
        probability: dealStage === 'Proposal' ? 75 : 50,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        assignedTo: lead.assignedTo,
        assignedAvatar: lead.assignedAvatar,
        priority: 'High',
        notes: `Originating lead note: ${lead.notes}`,
        products: ['Core Enterprise Suite'],
      })
    );

    // 4. Log Activity
    dispatch(
      addActivity({
        type: 'Status Change',
        title: `Lead Converted: ${lead.name}`,
        description: `Successfully converted lead ${lead.name} (${lead.company}) into Customer profile and created deal "${dealTitle}" valued at ${formatCurrency(dealValue)}.`,
        entityType: 'Lead',
        entityId: lead.id,
        entityName: lead.company,
        performedBy: lead.assignedTo,
        performedAvatar: lead.assignedAvatar,
        outcome: 'Lead Converted',
      })
    );

    // 5. Toast notification
    dispatch(
      addToast({
        type: 'success',
        title: 'Lead Converted Successfully! 🎉',
        message: `${lead.company} is now an active Customer and a new Deal was created in your Sales Pipeline.`,
      })
    );

    dispatch(closeModal());
    dispatch(setActiveTab('pipeline'));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title="Convert Lead to Customer & Deal"
      subtitle="Seamlessly convert qualified leads into active customer accounts and pipeline deals"
      maxWidth="lg"
    >
      <form onSubmit={handleConvert} className="space-y-4">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/60 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Converting {lead.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lead.title} at <span className="font-semibold text-slate-700 dark:text-slate-300">{lead.company}</span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Pipeline Deal Details
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Deal Title
            </label>
            <input
              type="text"
              required
              value={dealTitle}
              onChange={(e) => setDealTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Deal Value (₹)
              </label>
              <input
                type="number"
                min="0"
                step="50000"
                value={dealValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDealValue(val);
                  setMrr(Math.round(val / 12));
                }}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Initial Pipeline Stage
              </label>
              <select
                value={dealStage}
                onChange={(e) => setDealStage(e.target.value as DealStage)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
              >
                <option value="Discovery">Discovery</option>
                <option value="Qualification">Qualification</option>
                <option value="Proposal">Proposal</option>
              </select>
            </div>
          </div>

          <div className="border-b border-slate-100 dark:border-slate-800 pb-2 pt-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Customer Account Details
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Customer Tier
              </label>
              <select
                value={customerTier}
                onChange={(e) => setCustomerTier(e.target.value as CustomerTier)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Mid-Market">Mid-Market</option>
                <option value="Startup">Startup</option>
                <option value="SMB">SMB</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Estimated MRR (₹)
              </label>
              <input
                type="number"
                min="0"
                value={mrr}
                onChange={(e) => setMrr(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch(closeModal())}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Convert & Open Pipeline
          </Button>
        </div>
      </form>
    </Modal>
  );
};

