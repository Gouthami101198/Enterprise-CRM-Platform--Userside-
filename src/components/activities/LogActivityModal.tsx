import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addActivity } from '../../store/slices/activitiesSlice';
import { closeModal, addToast } from '../../store/slices/uiSlice';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ActivityType } from '../../types/crm';
import { initialSalesReps } from '../../store/mockData';

export const LogActivityModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const modalData = useAppSelector((state) => state.ui.modalData);
  const leads = useAppSelector((state) => state.leads.leads);
  const deals = useAppSelector((state) => state.deals.deals);
  const customers = useAppSelector((state) => state.customers.customers);

  const isOpen = activeModal === 'log-activity';

  const [formData, setFormData] = useState({
    type: 'Call' as ActivityType,
    title: '',
    description: '',
    entityType: 'Customer' as 'Lead' | 'Deal' | 'Customer',
    entityId: '',
    entityName: '',
    performedBy: 'Priya Patel',
    outcome: 'Connected',
    duration: '30 mins',
  });

  useEffect(() => {
    if (modalData?.defaultEntity) {
      const def = modalData.defaultEntity;
      setFormData((prev) => ({
        ...prev,
        entityType: def.type,
        entityId: def.id,
        entityName: def.name,
        title: `${prev.type} with ${def.name}`,
      }));
    } else if (customers.length > 0) {
      setFormData((prev) => ({
        ...prev,
        entityType: 'Customer',
        entityId: customers[0].id,
        entityName: customers[0].name,
        title: `${prev.type} with ${customers[0].name}`,
      }));
    }
  }, [modalData, customers, isOpen]);

  if (!isOpen) return null;

  const handleEntitySelect = (type: 'Lead' | 'Deal' | 'Customer', id: string) => {
    let name = '';
    if (type === 'Lead') {
      const l = leads.find((item) => item.id === id);
      name = l ? `${l.name} (${l.company})` : '';
    } else if (type === 'Deal') {
      const d = deals.find((item) => item.id === id);
      name = d ? d.title : '';
    } else if (type === 'Customer') {
      const c = customers.find((item) => item.id === id);
      name = c ? c.name : '';
    }
    setFormData({
      ...formData,
      entityType: type,
      entityId: id,
      entityName: name,
      title: `${formData.type} with ${name}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.entityId) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Missing Information',
          message: 'Please provide activity title and select an associated record.',
        })
      );
      return;
    }

    const assignedRep = initialSalesReps.find((r) => r.name === formData.performedBy);

    dispatch(
      addActivity({
        type: formData.type,
        title: formData.title,
        description: formData.description || 'Logged customer interaction.',
        entityType: formData.entityType,
        entityId: formData.entityId,
        entityName: formData.entityName,
        performedBy: formData.performedBy,
        performedAvatar: assignedRep?.avatar,
        outcome: formData.outcome,
        duration: formData.type === 'Call' || formData.type === 'Meeting' ? formData.duration : undefined,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Activity Logged',
        message: `${formData.type} logged for ${formData.entityName}.`,
      })
    );

    dispatch(closeModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title="Log Customer Activity"
      subtitle="Track calls, meetings, email exchanges, and client touchpoints"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Activity Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => {
                const t = e.target.value as ActivityType;
                setFormData({
                  ...formData,
                  type: t,
                  title: `${t} with ${formData.entityName || 'Client'}`,
                });
              }}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              <option value="Call">Phone Call</option>
              <option value="Meeting">Video / In-Person Meeting</option>
              <option value="Email">Email Exchange</option>
              <option value="Note">Internal Note</option>
              <option value="Status Change">Status Update</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Outcome
            </label>
            <select
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              <option value="Connected">Connected / Successful</option>
              <option value="Voicemail">Left Voicemail</option>
              <option value="Completed">Completed</option>
              <option value="Contract Sent">Contract Sent</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Follow-up Needed">Follow-up Needed</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Activity Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Security review and quota discussion"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Record Type
            </label>
            <select
              value={formData.entityType}
              onChange={(e) => {
                const type = e.target.value as 'Customer' | 'Deal' | 'Lead';
                setFormData({ ...formData, entityType: type, entityId: '', entityName: '' });
              }}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              <option value="Customer">Customer Account</option>
              <option value="Deal">Pipeline Deal</option>
              <option value="Lead">Lead</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Select Record *
            </label>
            <select
              value={formData.entityId}
              required
              onChange={(e) => handleEntitySelect(formData.entityType, e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              <option value="">Select...</option>
              {formData.entityType === 'Customer' &&
                customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              {formData.entityType === 'Deal' &&
                deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              {formData.entityType === 'Lead' &&
                leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.company})
                  </option>
                ))}
            </select>
          </div>

          {(formData.type === 'Call' || formData.type === 'Meeting') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
              >
                <option value="15 mins">15 mins</option>
                <option value="30 mins">30 mins</option>
                <option value="45 mins">45 mins</option>
                <option value="60 mins">60 mins</option>
                <option value="90 mins">90 mins</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Logged By
            </label>
            <select
              value={formData.performedBy}
              onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              {initialSalesReps.map((rep) => (
                <option key={rep.id} value={rep.name}>
                  {rep.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Summary & Discussion Notes
          </label>
          <textarea
            rows={3}
            placeholder="Key discussion points, customer feedback, next steps decided..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            Save Activity Log
          </Button>
        </div>
      </form>
    </Modal>
  );
};

