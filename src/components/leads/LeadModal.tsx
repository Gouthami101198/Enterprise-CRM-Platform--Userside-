import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addLead, updateLead } from '../../store/slices/leadsSlice';
import { closeModal, addToast } from '../../store/slices/uiSlice';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Lead, LeadSource, LeadStatus } from '../../types/crm';
import { initialSalesReps } from '../../store/mockData';

export const LeadModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const modalData = useAppSelector((state) => state.ui.modalData);

  const isEditing = activeModal === 'edit-lead';
  const isOpen = activeModal === 'new-lead' || activeModal === 'edit-lead';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    value: 5000000,
    status: 'New' as LeadStatus,
    source: 'Website' as LeadSource,
    score: 65,
    assignedTo: 'Priya Patel',
    notes: '',
  });

  useEffect(() => {
    if (isEditing && modalData?.lead) {
      const l = modalData.lead;
      setFormData({
        name: l.name,
        email: l.email,
        phone: l.phone,
        company: l.company,
        title: l.title,
        value: l.value,
        status: l.status,
        source: l.source,
        score: l.score,
        assignedTo: l.assignedTo,
        notes: l.notes,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        value: 5000000,
        status: 'New',
        source: 'Website',
        score: 65,
        assignedTo: 'Priya Patel',
        notes: '',
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

    const assignedRep = initialSalesReps.find((r) => r.name === formData.assignedTo);

    if (isEditing && modalData?.lead) {
      const updatedLead: Lead = {
        ...modalData.lead,
        ...formData,
        assignedAvatar: assignedRep?.avatar,
      };
      dispatch(updateLead(updatedLead));
      dispatch(
        addToast({
          type: 'success',
          title: 'Lead Updated',
          message: `${formData.name} at ${formData.company} has been updated.`,
        })
      );
    } else {
      dispatch(
        addLead({
          ...formData,
          assignedAvatar: assignedRep?.avatar,
        })
      );
      dispatch(
        addToast({
          type: 'success',
          title: 'Lead Created',
          message: `${formData.name} added to pipeline.`,
        })
      );
    }
    dispatch(closeModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title={isEditing ? 'Edit Lead Profile' : 'Create New Lead'}
      subtitle="Enter contact details and qualification metrics"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vikramaditya Singhania"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Company Name *
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
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="name@company.com"
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
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. Head of Enterprise Tech"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Estimated Deal Value (₹)
            </label>
            <input
              type="number"
              min="0"
              step="50000"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Lead Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Acquisition Source
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Cold Outreach">Cold Outreach</option>
              <option value="Webinar">Webinar</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Partner">Partner</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Assigned Sales Rep
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              {initialSalesReps.map((rep) => (
                <option key={rep.id} value={rep.name}>
                  {rep.name} ({rep.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Lead Score (0 - 100): <span className="font-bold text-indigo-600 dark:text-indigo-400">{formData.score}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer mt-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Qualification Notes & Requirements
          </label>
          <textarea
            rows={3}
            placeholder="Key pain points, seat volume, technical stack, decision timeline..."
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
            {isEditing ? 'Save Changes' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

