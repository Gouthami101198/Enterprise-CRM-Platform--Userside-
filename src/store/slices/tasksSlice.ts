import '../storageMigration';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PriorityLevel, Task, TaskStatus } from '../../types/crm';
import { initialTasks } from '../mockData';

interface TasksState {
  tasks: Task[];
  filterStatus: TaskStatus | 'All';
  filterPriority: PriorityLevel | 'All';
  searchQuery: string;
}

const loadTasksFromStorage = (): Task[] => {
  try {
    const saved = localStorage.getItem('crm_tasks');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load tasks from localStorage', e);
  }
  return initialTasks;
};

const initialState: TasksState = {
  tasks: loadTasksFromStorage(),
  filterStatus: 'All',
  filterPriority: 'All',
  searchQuery: '',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      state.tasks.unshift(newTask);
      localStorage.setItem('crm_tasks', JSON.stringify(state.tasks));
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        localStorage.setItem('crm_tasks', JSON.stringify(state.tasks));
      }
    },
    toggleTaskStatus: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        if (task.status === 'Completed') {
          task.status = 'In Progress';
        } else if (task.status === 'In Progress') {
          task.status = 'Completed';
        } else {
          task.status = 'Completed';
        }
        localStorage.setItem('crm_tasks', JSON.stringify(state.tasks));
      }
    },
    setTaskStatus: (state, action: PayloadAction<{ id: string; status: TaskStatus }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        localStorage.setItem('crm_tasks', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      localStorage.setItem('crm_tasks', JSON.stringify(state.tasks));
    },
    setFilterStatus: (state, action: PayloadAction<TaskStatus | 'All'>) => {
      state.filterStatus = action.payload;
    },
    setFilterPriority: (state, action: PayloadAction<PriorityLevel | 'All'>) => {
      state.filterPriority = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetTasks: (state) => {
      state.tasks = initialTasks;
      localStorage.removeItem('crm_tasks');
    },
  },
});

export const {
  addTask,
  updateTask,
  toggleTaskStatus,
  setTaskStatus,
  deleteTask,
  setFilterStatus,
  setFilterPriority,
  setSearchQuery,
  resetTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;

