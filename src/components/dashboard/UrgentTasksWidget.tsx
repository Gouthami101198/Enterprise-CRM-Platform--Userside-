import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleTaskStatus } from '../../store/slices/tasksSlice';
import { setActiveTab, openModal, addToast } from '../../store/slices/uiSlice';
import { PriorityBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { CheckCircle2, Circle, Clock, ArrowRight, Plus } from 'lucide-react';

export const UrgentTasksWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const isPersonal = workspaceScope === 'personal';
  const currentRepName = currentUser?.name || 'Vikram Malhotra';

  const scopedTasks = isPersonal
    ? tasks.filter((t) => t.assignedTo === currentRepName || t.assignedTo === 'Vikram Malhotra')
    : tasks;

  // Filter urgent & high priority tasks not completed first
  const pendingTasks = [...scopedTasks]
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => {
      const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);

  const handleToggle = (id: string, title: string) => {
    dispatch(toggleTaskStatus(id));
    dispatch(
      addToast({
        type: 'success',
        title: 'Task Updated',
        message: `Status updated for "${title}"`,
      })
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isPersonal ? 'My Priority Action Items' : 'Priority Action Items'}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isPersonal
                ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
            }`}>
              {pendingTasks.length} {isPersonal ? 'Assigned' : 'Team Tasks'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isPersonal ? 'My urgent deadlines and assigned follow-ups' : 'Urgent deadlines & follow-ups'}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => dispatch(openModal({ type: 'new-task' }))}
            className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Create Task"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch(setActiveTab('tasks'))}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {pendingTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">All caught up!</p>
            <p className="text-xs text-slate-400">No pending urgent tasks right now.</p>
          </div>
        ) : (
          pendingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 transition group"
            >
              <button
                onClick={() => handleToggle(task.id, task.title)}
                className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer shrink-0"
              >
                {task.status === 'Completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {task.title}
                  </span>
                  <PriorityBadge priority={task.priority} />
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 leading-snug">
                  {task.description}
                </p>

                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>Due: {formatDate(task.dueDate)}</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[120px]">
                    {task.assignedTo}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
