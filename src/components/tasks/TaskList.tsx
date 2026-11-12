import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  toggleTaskStatus,
  deleteTask,
  setFilterStatus,
  setFilterPriority,
} from '../../store/slices/tasksSlice';
import { openModal, addToast, setActiveTab } from '../../store/slices/uiSlice';
import { openCustomerDrawer } from '../../store/slices/customersSlice';
import { setSelectedDealId } from '../../store/slices/dealsSlice';
import { setSelectedLeadId } from '../../store/slices/leadsSlice';
import { PriorityBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { PriorityLevel, TaskStatus } from '../../types/crm';
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Calendar,
  CheckSquare,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const filterStatus = useAppSelector((state) => state.tasks.filterStatus);
  const filterPriority = useAppSelector((state) => state.tasks.filterPriority);

  const [localSearch, setLocalSearch] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const query = localSearch.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.assignedTo.toLowerCase().includes(query) ||
      (task.relatedTo && task.relatedTo.name.toLowerCase().includes(query));
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Task metrics
  const totalCount = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const overdueCount = tasks.filter(
    (t) => t.status !== 'Completed' && t.dueDate < todayStr
  ).length;

  const handleToggle = (id: string, title: string) => {
    dispatch(toggleTaskStatus(id));
    dispatch(
      addToast({
        type: 'info',
        title: 'Task Status Updated',
        message: `Status updated for "${title}".`,
      })
    );
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete task "${title}"?`)) {
      dispatch(deleteTask(id));
      dispatch(
        addToast({
          type: 'warning',
          title: 'Task Deleted',
          message: `"${title}" has been removed.`,
        })
      );
    }
  };

  const handleRelatedClick = (related: { type: 'Lead' | 'Deal' | 'Customer'; id: string }) => {
    if (related.type === 'Customer') {
      dispatch(openCustomerDrawer(related.id));
      dispatch(setActiveTab('customers'));
    } else if (related.type === 'Deal') {
      dispatch(setSelectedDealId(related.id));
      dispatch(setActiveTab('pipeline'));
    } else if (related.type === 'Lead') {
      dispatch(setSelectedLeadId(related.id));
      dispatch(setActiveTab('leads'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight m-0">
            Task Management & Follow-ups
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Prioritize customer deadlines, internal contract reviews, and sales operations
          </p>
        </div>

        <button
          onClick={() => dispatch(openModal({ type: 'new-task' }))}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-indigo-300 dark:shadow-none transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Total Action Items
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{totalCount}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              In Progress
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{inProgressCount}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Overdue Deadlines
            </span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400">{overdueCount}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Completed
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{completedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, descriptions, accounts..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            {(['All', 'To Do', 'In Progress', 'Completed'] as const).map((status) => (
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

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) =>
              dispatch(setFilterPriority(e.target.value as PriorityLevel | 'All'))
            }
            className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent Only</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List Table / Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <CheckSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-white">No tasks found</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                No items match your active filters.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isOverdue = task.status !== 'Completed' && task.dueDate < todayStr;
              return (
                <div
                  key={task.id}
                  className={`p-4 flex items-start sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                    task.status === 'Completed' ? 'bg-slate-50/40 dark:bg-slate-800/20 opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggle(task.id, task.title)}
                      className="mt-0.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer shrink-0"
                    >
                      {task.status === 'Completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-bold text-slate-900 dark:text-white ${
                            task.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                        <PriorityBadge priority={task.priority} />
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200/60 dark:border-slate-700/60">
                          {task.category}
                        </span>
                        {isOverdue && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800/60">
                            Overdue
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 leading-snug">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span className={isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}>
                            Due {formatDate(task.dueDate)}
                          </span>
                        </div>

                        {task.relatedTo && (
                          <button
                            onClick={() => handleRelatedClick(task.relatedTo!)}
                            className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline bg-indigo-50/60 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md text-[11px] cursor-pointer"
                          >
                            <span>
                              {task.relatedTo.type}: {task.relatedTo.name}
                            </span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      {task.assignedAvatar && (
                        <img
                          src={task.assignedAvatar}
                          alt={task.assignedTo}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      )}
                      <span className="font-medium truncate max-w-[110px]">
                        {task.assignedTo}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          dispatch(openModal({ type: 'edit-task', data: { task } }))
                        }
                        title="Edit Task"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id, task.title)}
                        title="Delete Task"
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

