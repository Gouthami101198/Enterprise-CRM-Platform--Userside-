import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import leadsReducer from './slices/leadsSlice';
import dealsReducer from './slices/dealsSlice';
import customersReducer from './slices/customersSlice';
import tasksReducer from './slices/tasksSlice';
import activitiesReducer from './slices/activitiesSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    deals: dealsReducer,
    customers: customersReducer,
    tasks: tasksReducer,
    activities: activitiesReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
