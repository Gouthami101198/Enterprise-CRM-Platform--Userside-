import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addTask, updateTask } from '../../store/slices/tasksSlice';
import { addActivity } from '../../store/slices/activitiesSlice';
import { closeModal, addToast } from '../../store/slices/uiSlice';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PriorityLevel, Task, TaskCategory, TaskStatus } from '../../types/crm';
import { initialSalesReps } from '../../store/mockData';

export const TaskModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const modalData = useAppSelector((state) => state.ui.modalData);
  const leads = useAppSelector((state) => state.leads.leads);
  const deals = useAppSelector((state) => state.deals.deals);
  const customers = useAppSelector((state) => state.customers.customers);

  const isEditing = activeModal === 'edit-task';
  const isOpen = activeModal === 'new-task' || activeModal === 'edit-task';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do' as TaskStatus,
    priority: 'High' as PriorityLevel,
    category: 'Follow-up' as TaskCategory,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedTo: 'Priya Patel',
    relatedType: 'Customer' as 'Lead' | 'Deal' | 'Customer' | 'None',
    relatedId: '',
    relatedName: '',
  });

  useEffect(() => {
    if (isEditing && modalData?.task) {
      const t = modalData.task;
      setFormData({
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        category: t.category,
        dueDate: t.dueDate,
        assignedTo: t.assignedTo,
        relatedType: t.relatedTo ? t.relatedTo.type : 'None',
        relatedId: t.relatedTo ? t.relatedTo.id : '',
        relatedName: t.relatedTo ? t.relatedTo.name : '',
      });
    } else if (modalData?.defaultEntity) {
      const ent = modalData.defaultEntity;
      setFormData({
        title: `Follow up with ${ent.name}`,
        description: `Review account status and discuss next steps.`,
        status: 'To Do',
        priority: 'High',
        category: 'Follow-up',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedTo: 'Priya Patel',
        relatedType: ent.type,
        relatedId: ent.id,
        relatedName: ent.name,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'High',
        category: 'Follow-up',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedTo: 'Priya Patel',
        relatedType: 'None',
        relatedId: '',
        relatedName: '',
      });
    }
  }, [isEditing, modalData, isOpen]);

  if (!isOpen) return null;

  const handleRelatedChange = (type: string, id: string) => {
    if (type === 'None') {
      setFormData({ ...formData, relatedType: 'None', relatedId: '', relatedName: '' });
      return;
    }
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
      relatedType: type as any,
      relatedId: id,
      relatedName: name,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Title Required',
          message: 'Please provide a title for this task.',
        })
      );
      return;
    }

    const assignedRep = initialSalesReps.find((r) => r.name === formData.assignedTo);
    const relatedTo =
      formData.relatedType !== 'None' && formData.relatedId
        ? {
            type: formData.relatedType as 'Lead' | 'Deal' | 'Customer',
            id: formData.relatedId,
            name: formData.relatedName,
          }
        : undefined;

    if (isEditing && modalData?.task) {
      const updatedTask: Task = {
        ...modalData.task,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate,
        assignedTo: formData.assignedTo,
        assignedAvatar: assignedRep?.avatar,
        relatedTo,
      };
      dispatch(updateTask(updatedTask));
      dispatch(
        addToast({
          type: 'success',
          title: 'Task Updated',
          message: `"${formData.title}" updated successfully.`,
        })
      );
    } else {
      dispatch(
        addTask({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          category: formData.category,
          dueDate: formData.dueDate,
          assignedTo: formData.assignedTo,
          assignedAvatar: assignedRep?.avatar,
          relatedTo,
        })
      );
      dispatch(
        addToast({
          type: 'success',
          title: 'Task Created',
          message: `"${formData.title}" has been assigned to ${formData.assignedTo}.`,
        })
      );
    }
    dispatch(closeModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title={isEditing ? 'Edit Task' : 'Create Sales Task'}
      subtitle="Schedule follow-ups, calls, reviews, and contract deadlines"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Task Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Send technical review proposal to Tata Digital"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              <option value="Call">Call</option>
              <option value="Meeting">Meeting</option>
              <option value="Email">Email</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Review">Review</option>
              <option value="Contract">Contract</option>
            </select>
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
              <option value="Urgent">Urgent (Immediate action)</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Due Date / Deadline
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none transition"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Assigned Sales AE
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

        {/* Relate to Lead, Deal, or Customer */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Link to Record (Optional)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={formData.relatedType}
              onChange={(e) => handleRelatedChange(e.target.value, '')}
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none"
            >
              <option value="None">None (General Task)</option>
              <option value="Customer">Customer Account</option>
              <option value="Deal">Sales Deal</option>
              <option value="Lead">Lead</option>
            </select>

            {formData.relatedType === 'Customer' && (
              <select
                value={formData.relatedId}
                onChange={(e) => handleRelatedChange('Customer', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none"
              >
                <option value="">Select Customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            {formData.relatedType === 'Deal' && (
              <select
                value={formData.relatedId}
                onChange={(e) => handleRelatedChange('Deal', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none"
              >
                <option value="">Select Deal...</option>
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            )}

            {formData.relatedType === 'Lead' && (
              <select
                value={formData.relatedId}
                onChange={(e) => handleRelatedChange('Lead', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none"
              >
                <option value="">Select Lead...</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.company})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Task Description & Action Items
          </label>
          <textarea
            rows={3}
            placeholder="Details, agendas, deliverables, and expectations..."
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
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

