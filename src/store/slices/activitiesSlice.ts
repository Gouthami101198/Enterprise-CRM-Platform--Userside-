import '../storageMigration';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity, ActivityType } from '../../types/crm';
import { initialActivities } from '../mockData';

interface ActivitiesState {
  activities: Activity[];
  filterType: ActivityType | 'All';
  searchQuery: string;
}

const loadActivitiesFromStorage = (): Activity[] => {
  try {
    const saved = localStorage.getItem('crm_activities');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load activities from localStorage', e);
  }
  return initialActivities;
};

const initialState: ActivitiesState = {
  activities: loadActivitiesFromStorage(),
  filterType: 'All',
  searchQuery: '',
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    addActivity: (state, action: PayloadAction<Omit<Activity, 'id' | 'timestamp'>>) => {
      const newActivity: Activity = {
        ...action.payload,
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      state.activities.unshift(newActivity);
      localStorage.setItem('crm_activities', JSON.stringify(state.activities));
    },
    deleteActivity: (state, action: PayloadAction<string>) => {
      state.activities = state.activities.filter((a) => a.id !== action.payload);
      localStorage.setItem('crm_activities', JSON.stringify(state.activities));
    },
    setFilterType: (state, action: PayloadAction<ActivityType | 'All'>) => {
      state.filterType = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetActivities: (state) => {
      state.activities = initialActivities;
      localStorage.removeItem('crm_activities');
    },
  },
});

export const {
  addActivity,
  deleteActivity,
  setFilterType,
  setSearchQuery,
  resetActivities,
} = activitiesSlice.actions;

export default activitiesSlice.reducer;

