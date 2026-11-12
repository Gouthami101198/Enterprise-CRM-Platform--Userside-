import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem, NotificationType } from '../../types/crm';

interface NotificationsState {
  items: NotificationItem[];
  filter: NotificationType | 'all';
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'lead_assigned',
    title: 'New High-Value Lead Assigned',
    message: 'Rajesh Kulkarni (CTO - Tata Consultancy Services, BFSI) was assigned to you with an estimated value of ₹1.25 Cr.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    read: false,
    linkTab: 'leads',
    entityId: 'lead-1',
  },
  {
    id: 'notif-2',
    type: 'meeting_alert',
    title: 'Upcoming Meeting in 30 Mins',
    message: 'Executive Architecture Walkthrough with TCS Banking Tech core architects at Whitefield Campus.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    linkTab: 'activities',
    entityId: 'act-2',
  },
  {
    id: 'notif-3',
    type: 'task_reminder',
    title: 'Urgent Deadline Approaching',
    message: 'Deliver DPDP Act 2023 compliance audit deck and data localization clearance for TCS.',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    read: false,
    linkTab: 'tasks',
    entityId: 'task-1',
  },
  {
    id: 'notif-4',
    type: 'deal_update',
    title: 'Deal Moved to Proposal',
    message: 'Nationwide Retail POS & Customer Engine (Reliance Retail Digital, ₹2.40 Cr) was advanced to Proposal.',
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    read: true,
    linkTab: 'pipeline',
    entityId: 'deal-2',
  },
  {
    id: 'notif-5',
    type: 'system',
    title: 'Q4 Quota Milestone Reached',
    message: 'Congratulations! You have achieved 83% of your Q4 enterprise sales target (₹6.20 Cr closed won).',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: true,
    linkTab: 'dashboard',
  },
];

const loadNotificationsFromStorage = (): NotificationItem[] => {
  try {
    const saved = localStorage.getItem('crm_notifications');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse notifications from storage', e);
  }
  return initialNotifications;
};

const initialState: NotificationsState = {
  items: loadNotificationsFromStorage(),
  filter: 'all',
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) {
        item.read = true;
        localStorage.setItem('crm_notifications', JSON.stringify(state.items));
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => {
        n.read = true;
      });
      localStorage.setItem('crm_notifications', JSON.stringify(state.items));
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
      localStorage.setItem('crm_notifications', JSON.stringify(state.items));
    },
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'timestamp' | 'read'>>) => {
      const newItem: NotificationItem = {
        ...action.payload,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.items.unshift(newItem);
      localStorage.setItem('crm_notifications', JSON.stringify(state.items));
    },
    setNotificationFilter: (state, action: PayloadAction<NotificationType | 'all'>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  addNotification,
  setNotificationFilter,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;

