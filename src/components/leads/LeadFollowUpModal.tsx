import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeModal, addToast } from '../../store/slices/uiSlice';
import { addActivity } from '../../store/slices/activitiesSlice';
import { addTask } from '../../store/slices/tasksSlice';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Phone, Calendar, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export const LeadFollowUpModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const modalData = useAppSelector((state) => state.ui.modalData);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const isOpen = activeModal === 'lead-followup';
  const lead = modalData?.lead;

  const [followUpType, setFollowUpType] = useState<'Call' | 'Meeting' | 'Email' | 'Demo'>('Call');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [createTaskReminder, setCreateTaskReminder] = useState(true);

  useEffect(() => {
    if (lead) {
      setNotes(`Follow up with ${lead.name} regarding CRM license sizing and deployment schedule.`);
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Log an activity
    dispatch(
      addActivity({
        type: followUpType === 'Call' ? 'Call' : followUpType === 'Meeting' ? 'Meeting' : 'Email',
        title: `Scheduled Follow-up ${followUpType}: ${lead.name}`,
        description: notes || `Follow-up scheduled on ${scheduledDate} at ${scheduledTime}`,
        entityType: 'Lead',
        entityId: lead.id,
        entityName: lead.company,
        performedBy: currentUser?.name || 'Vikram Malhotra',
        performedAvatar: currentUser?.avatar,
        outcome: 'Follow-up Scheduled',
      })
    );

    // 2. Optionally add an actionable task
    if (createTaskReminder) {
      dispatch(
        addTask({
          title: `${followUpType} with ${lead.name} (${lead.company})`,
          description: notes,
          dueDate: scheduledDate,
          priority: 'High',
          category: followUpType === 'Call' ? 'Call' : 'Meeting',
          status: 'To Do',
          assignedTo: currentUser?.name || 'Vikram Malhotra',
          assignedAvatar: currentUser?.avatar,
          relatedTo: {
            type: 'Lead',
            id: lead.id,
            name: lead.company,
          },
        })
      );
    }

    dispatch(
      addToast({
        type: 'success',
        title: 'Follow-up Scheduled 📅',
        message: `${followUpType} scheduled with ${lead.name} for ${scheduledDate} at ${scheduledTime}.`,
      })
    );

    dispatch(closeModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title="Schedule Lead Follow-Up"
      subtitle={`Set touchpoint reminders and schedule agenda for ${lead.name} (${lead.company})`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Lead banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">{lead.name}</span>
            <span className="text-slate-500 dark:text-slate-400">{lead.title} • {lead.company}</span>
          </div>
          <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded-lg">
            Score: {lead.score}/100
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Follow-up Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['Call', 'Meeting', 'Email', 'Demo'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFollowUpType(type)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer flex flex-col items-center gap-1 ${
                  followUpType === type
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {type === 'Call' && <Phone className="w-3.5 h-3.5" />}
                {type === 'Meeting' && <Calendar className="w-3.5 h-3.5" />}
                {type === 'Email' && <MessageSquare className="w-3.5 h-3.5" />}
                {type === 'Demo' && <Clock className="w-3.5 h-3.5" />}
                <span>{type}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Follow-Up Date *
            </label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Time (IST) *
            </label>
            <input
              type="time"
              required
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Follow-Up Agenda & Strategic Notes
          </label>
          <textarea
            rows={3}
            required
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="createTaskReminder"
            checked={createTaskReminder}
            onChange={(e) => setCreateTaskReminder(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="createTaskReminder" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            Create high-priority reminder in My Task Management
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={() => dispatch(closeModal())}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Schedule Follow-Up
          </Button>
        </div>
      </form>
    </Modal>
  );
};

