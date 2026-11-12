import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addDeal, updateDeal } from '../../store/slices/dealsSlice';
import { addActivity } from '../../store/slices/activitiesSlice';
import { closeModal, addToast } from '../../store/slices/uiSlice';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Deal, DealStage, PriorityLevel } from '../../types/crm';
import { initialSalesReps } from '../../store/mockData';
import { formatCurrency } from '../../utils/formatters';

export const DealModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const modalData = useAppSelector((state) => state.ui.modalData);

  const isEditing = activeModal === 'edit-deal';
  const isOpen = activeModal === 'new-deal' || activeModal === 'edit-deal';

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    contactName: '',
    contactEmail: '',
    value: 7500000,
    stage: 'Discovery' as DealStage,
    probability: 25,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    assignedTo: 'Priya Patel',
    priority: 'High' as PriorityLevel,
    notes: '',
  });

  useEffect(() => {
    if (isEditing && modalData?.deal) {
      const d = modalData.deal;
      setFormData({
        title: d.title,
        company: d.company,
        contactName: d.contactName,
        contactEmail: d.contactEmail,
        value: d.value,
        stage: d.stage,
        probability: d.probability,
        expectedCloseDate: d.expectedCloseDate,
        assignedTo: d.assignedTo,
        priority: d.priority,
        notes: d.notes || '',
      });
    } else {
      setFormData({
        title: '',
        company: '',
        contactName: '',
        contactEmail: '',
        value: 7500000,
        stage: 'Discovery',
        probability: 25,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        assignedTo: 'Priya Patel',
        priority: 'High',
        notes: '',
      });
    }
  }, [isEditing, modalData, isOpen]);

  const handleStageChange = (newStage: DealStage) => {
    let defaultProb = 25;
    if (newStage === 'Qualification') defaultProb = 50;
    if (newStage === 'Proposal') defaultProb = 75;
    if (newStage === 'Negotiation') defaultProb = 90;
    if (newStage === 'Closed Won') defaultProb = 100;
    if (newStage === 'Closed Lost') defaultProb = 0;

    setFormData({
      ...formData,
      stage: newStage,
      probability: defaultProb,
    });
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.company.trim()) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Missing Required Fields',
          message: 'Please provide Deal Title and Company.',
        })
      );
      return;
    }

    const assignedRep = initialSalesReps.find((r) => r.name === formData.assignedTo);

    if (isEditing && modalData?.deal) {
      const updatedDeal: Deal = {
        ...modalData.deal,
        ...formData,
        assignedAvatar: assignedRep?.avatar,
      };
      dispatch(updateDeal(updatedDeal));
      dispatch(
        addToast({
          type: 'success',
          title: 'Deal Updated',
          message: `${formData.title} has been updated.`,
        })
      );
    } else {
      dispatch(
        addDeal({
          ...formData,
          assignedAvatar: assignedRep?.avatar,
          products: ['Enterprise CRM Suite'],
        })
      );

      // Log activity
      dispatch(
        addActivity({
          type: 'Status Change',
          title: `New Deal Created: ${formData.title}`,
          description: `Created new deal valued at ${formatCurrency(formData.value)} for ${formData.company}.`,
          entityType: 'Deal',
          entityId: `deal-${Date.now()}`,
          entityName: formData.title,
          performedBy: formData.assignedTo,
          performedAvatar: assignedRep?.avatar,
          outcome: 'Deal Created',
        })
      );

      dispatch(
        addToast({
          type: 'success',
          title: 'Deal Created',
          message: `${formData.title} added to sales pipeline.`,
        })
      );
    }
    dispatch(closeModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title={isEditing ? 'Edit Sales Deal' : 'Create New Deal'}
      subtitle="Configure stage, expected close value, and probability"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Deal Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Reliance Jio Enterprise Cloud Rollout"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Company *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Reliance Jio Platforms"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Deal Value (₹) *
            </label>
            <input
              type="number"
              min="0"
              step="50000"
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Sales Stage
            </label>
            <select
              value={formData.stage}
              onChange={(e) => handleStageChange(e.target.value as DealStage)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              <option value="Discovery">Discovery</option>
              <option value="Qualification">Qualification</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Win Probability: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{formData.probability}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer mt-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Key Contact Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rajesh Kulkarni"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Key Contact Email
            </label>
            <input
              type="email"
              placeholder="rajesh.k@jioplatforms.in"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Expected Close Date
            </label>
            <input
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Priority Level
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as PriorityLevel })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Assigned Account Executive
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
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Deal Notes & Strategic Context
          </label>
          <textarea
            rows={3}
            placeholder="Contract terms, champion info, blockers, competing bids..."
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
            {isEditing ? 'Save Changes' : 'Create Deal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

