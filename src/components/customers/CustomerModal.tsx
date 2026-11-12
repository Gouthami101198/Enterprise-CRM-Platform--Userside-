import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addCustomer, updateCustomer } from '../../store/slices/customersSlice';
import { closeModal, addToast } from '../../store/slices/uiSlice';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Customer, CustomerStatus, CustomerTier } from '../../types/crm';
import { initialSalesReps } from '../../store/mockData';

export const CustomerModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const modalData = useAppSelector((state) => state.ui.modalData);

  const isEditing = activeModal === 'edit-customer';
  const isOpen = activeModal === 'new-customer' || activeModal === 'edit-customer';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    industry: 'Technology & Cloud',
    tier: 'Enterprise' as CustomerTier,
    status: 'Active' as CustomerStatus,
    accountManager: 'Priya Patel',
    lifetimeValue: 15000000,
    mrr: 1250000,
    healthScore: 92,
    website: 'https://tatadigital.com',
    address: 'Bandra-Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
    employees: '500+',
    since: new Date().toISOString().split('T')[0],
    notes: '',
    tagsString: 'Enterprise, GST Verified, Pan-India',
  });

  useEffect(() => {
    if (isEditing && modalData?.customer) {
      const c = modalData.customer;
      setFormData({
        name: c.name,
        company: c.company,
        email: c.email,
        phone: c.phone,
        industry: c.industry,
        tier: c.tier,
        status: c.status,
        accountManager: c.accountManager,
        lifetimeValue: c.lifetimeValue,
        mrr: c.mrr,
        healthScore: c.healthScore,
        website: c.website,
        address: c.address,
        employees: c.employees,
        since: c.since,
        notes: c.notes,
        tagsString: c.tags.join(', '),
      });
    } else {
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        industry: 'Technology & Cloud',
        tier: 'Enterprise',
        status: 'Active',
        accountManager: 'Priya Patel',
        lifetimeValue: 15000000,
        mrr: 1250000,
        healthScore: 92,
        website: 'https://tatadigital.com',
        address: 'Bandra-Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
        employees: '500+',
        since: new Date().toISOString().split('T')[0],
        notes: '',
        tagsString: 'Enterprise, GST Verified, Pan-India',
      });
    }
  }, [isEditing, modalData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim() || !formData.email.trim()) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Missing Required Fields',
          message: 'Please fill in Name, Company, and Email.',
        })
      );
      return;
    }

    const assignedRep = initialSalesReps.find((r) => r.name === formData.accountManager);
    const parsedTags = formData.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (isEditing && modalData?.customer) {
      const updatedCustomer: Customer = {
        ...modalData.customer,
        ...formData,
        accountManagerAvatar: assignedRep?.avatar,
        tags: parsedTags,
      };
      dispatch(updateCustomer(updatedCustomer));
      dispatch(
        addToast({
          type: 'success',
          title: 'Customer Updated',
          message: `${formData.company} profile has been updated.`,
        })
      );
    } else {
      dispatch(
        addCustomer({
          ...formData,
          accountManagerAvatar: assignedRep?.avatar,
          tags: parsedTags,
        })
      );
      dispatch(
        addToast({
          type: 'success',
          title: 'Customer Account Created',
          message: `${formData.company} has been added to accounts.`,
        })
      );
    }
    dispatch(closeModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title={isEditing ? 'Edit Customer Profile' : 'New Customer Account'}
      subtitle="Maintain enterprise accounts, contracts, and assigned managers"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Account / Brand Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tata Consultancy Services"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Legal Entity Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tata Digital Ltd"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Primary Contact Email *
            </label>
            <input
              type="email"
              required
              placeholder="corporate@tatadigital.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 22 6778 9999"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Industry Sector
            </label>
            <input
              type="text"
              placeholder="e.g. FinTech / SaaS / Healthcare"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Account Tier
            </label>
            <select
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value as CustomerTier })}
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
              Account Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as CustomerStatus })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
              <option value="At Risk">At Risk</option>
              <option value="Churned">Churned</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Account Manager
            </label>
            <select
              value={formData.accountManager}
              onChange={(e) => setFormData({ ...formData, accountManager: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              {initialSalesReps.map((rep) => (
                <option key={rep.id} value={rep.name}>
                  {rep.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Lifetime Value (LTV ₹)
            </label>
            <input
              type="number"
              min="0"
              step="50000"
              value={formData.lifetimeValue}
              onChange={(e) => setFormData({ ...formData, lifetimeValue: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              MRR (₹)
            </label>
            <input
              type="number"
              min="0"
              step="10000"
              value={formData.mrr}
              onChange={(e) => setFormData({ ...formData, mrr: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Customer Health Score (0 - 100): <span className="text-indigo-600 dark:text-indigo-400 font-bold">{formData.healthScore}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.healthScore}
              onChange={(e) => setFormData({ ...formData, healthScore: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer mt-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Website URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="e.g. Enterprise, High NPS, Multi-Year, Beta Tester"
            value={formData.tagsString}
            onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Account Executive Notes
          </label>
          <textarea
            rows={3}
            placeholder="Account health overview, contract review date, growth opportunities..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch(closeModal())}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Save Changes' : 'Create Account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

