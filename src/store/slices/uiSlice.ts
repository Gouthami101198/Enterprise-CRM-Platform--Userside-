import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lead, Deal, Customer, Task } from '../../types/crm';

export type NavigationTab =
  | 'dashboard'
  | 'leads'
  | 'pipeline'
  | 'customers'
  | 'tasks'
  | 'activities'
  | 'analytics'
  | 'notifications';

export type WorkspaceScope = 'personal' | 'team';

export type ColorTheme =
  | 'sunset-copper'
  | 'sapphire'
  | 'emerald'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'cyan'
  | 'indigo';

export type ModalType =
  | 'new-lead'
  | 'edit-lead'
  | 'convert-lead'
  | 'lead-followup'
  | 'new-deal'
  | 'edit-deal'
  | 'new-customer'
  | 'edit-customer'
  | 'new-task'
  | 'edit-task'
  | 'log-activity'
  | 'user-profile'
  | 'theme-picker'
  | null;

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

export type ThemeMode = 'light' | 'dark';

interface UIState {
  activeTab: NavigationTab;
  workspaceScope: WorkspaceScope;
  colorTheme: ColorTheme;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  activeModal: ModalType;
  modalData: {
    lead?: Lead;
    deal?: Deal;
    customer?: Customer;
    task?: Task;
    defaultEntity?: {
      type: 'Lead' | 'Deal' | 'Customer';
      id: string;
      name: string;
    };
  } | null;
  toasts: ToastMessage[];
  globalSearch: string;
  theme: ThemeMode;
}

const getInitialColorTheme = (): ColorTheme => {
  try {
    const saved = localStorage.getItem('vanguard_theme') || localStorage.getItem('zenithflow_theme') || localStorage.getItem('vedaflow_theme');
    if (saved) {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', saved);
      }
      return saved as ColorTheme;
    }
  } catch (e) {
    console.error('Failed to get initial color theme', e);
  }
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', 'sunset-copper');
  }
  return 'sunset-copper';
};

const getInitialWorkspaceScope = (): WorkspaceScope => {
  try {
    const saved = localStorage.getItem('vanguard_scope') || localStorage.getItem('zenithflow_scope') || localStorage.getItem('vedaflow_scope');
    if (saved === 'personal' || saved === 'team') return saved;
  } catch (e) {
    console.error('Failed to get initial scope', e);
  }
  return 'personal';
};

const getInitialTheme = (): ThemeMode => {
  try {
    const saved = localStorage.getItem('crm_theme');
    if (saved === 'dark' || saved === 'light') {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', saved === 'dark');
      }
      return saved;
    }
  } catch (e) {
    console.error('Failed to get initial theme', e);
  }
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }
  return 'dark';
};

const initialTheme = getInitialTheme();
const initialColorTheme = getInitialColorTheme();
const initialScope = getInitialWorkspaceScope();

const initialState: UIState = {
  activeTab: 'dashboard',
  workspaceScope: initialScope,
  colorTheme: initialColorTheme,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  activeModal: null,
  modalData: null,
  toasts: [],
  globalSearch: '',
  theme: initialTheme,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<NavigationTab>) => {
      state.activeTab = action.payload;
      state.mobileMenuOpen = false;
      try {
        localStorage.setItem('vanguard_active_tab', action.payload);
      } catch { }
    },
    setWorkspaceScope: (state, action: PayloadAction<WorkspaceScope>) => {
      state.workspaceScope = action.payload;
      try {
        localStorage.setItem('vanguard_scope', action.payload);
      } catch { }
    },
    setColorTheme: (state, action: PayloadAction<ColorTheme>) => {
      state.colorTheme = action.payload;
      try {
        localStorage.setItem('vanguard_theme', action.payload);
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', action.payload);
        }
      } catch { }
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', state.theme === 'dark');
      }
      localStorage.setItem('crm_theme', state.theme);
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', state.theme === 'dark');
      }
      localStorage.setItem('crm_theme', state.theme);
    },
    openModal: (
      state,
      action: PayloadAction<{ type: ModalType; data?: UIState['modalData'] }>
    ) => {
      state.activeModal = action.payload.type;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const newToast: ToastMessage = {
        ...action.payload,
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };
      state.toasts.push(newToast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setGlobalSearch: (state, action: PayloadAction<string>) => {
      state.globalSearch = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setWorkspaceScope,
  setColorTheme,
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleTheme,
  setTheme,
  openModal,
  closeModal,
  addToast,
  removeToast,
  setGlobalSearch,
} = uiSlice.actions;

export default uiSlice.reducer;
