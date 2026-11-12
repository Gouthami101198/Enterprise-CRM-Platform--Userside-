import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthView } from '../../types/auth';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  authView: AuthView;
  recoverySentEmail: string | null;
  pendingOtpCode: string | null;
}

const defaultUser: User = {
  id: 'tm-1',
  name: 'Vikram Malhotra',
  email: 'vikram.m@vanguardcrm.in',
  role: 'Senior Enterprise AE',
  company: 'Vanguard Technologies Pvt. Ltd.',
  title: 'Senior Enterprise Account Executive',
  department: 'Enterprise Strategic Accounts & Cloud Solutions',
  phone: '+91 98200 44556',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  timezone: 'Asia/Kolkata (IST)',
  currency: 'INR (₹)',
  quota: 75000000, // ₹7.50 Cr
  closedWonAmount: 62000000, // ₹6.20 Cr
};

const loadAuthFromStorage = (): { user: User; isAuth: boolean } => {
  try {
    const savedUser = localStorage.getItem('crm_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.name === 'Priya Nair' || parsed.name === 'Priya Patel' || parsed.email?.includes('vedaflow') || parsed.email?.includes('zenithflow')) {
        parsed.name = 'Vikram Malhotra';
        parsed.email = 'vikram.m@vanguardcrm.in';
        parsed.company = 'Vanguard Technologies Pvt. Ltd.';
        parsed.avatar = defaultUser.avatar;
      }
      return { user: { ...defaultUser, ...parsed }, isAuth: false };
    }
  } catch (e) {
    console.error('Failed to parse auth from storage', e);
  }
  return { user: defaultUser, isAuth: false };
};

const savedAuth = loadAuthFromStorage();

const initialState: AuthState = {
  currentUser: savedAuth.user,
  isAuthenticated: false, // Always present the Vanguard Auth page first when opening the application
  authView: 'login',
  recoverySentEmail: null,
  pendingOtpCode: '842190',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; name?: string; role?: string; company?: string }>) => {
      const email = action.payload.email.trim();
      const name = action.payload.name || (email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()));
      const user: User = {
        id: `usr-${Date.now()}`,
        name: email === defaultUser.email ? defaultUser.name : name,
        email,
        role: action.payload.role || 'Enterprise Sales AE',
        company: action.payload.company || 'Vanguard Technologies Pvt. Ltd.',
        title: email === defaultUser.email ? defaultUser.title : 'Account Executive',
        department: 'Sales & Customer Growth',
        phone: '+91 98200 11223',
        avatar:
          email === defaultUser.email
            ? defaultUser.avatar
            : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        timezone: 'Asia/Kolkata (IST)',
        currency: 'INR (₹)',
        quota: 75000000,
        closedWonAmount: 62000000,
      };
      state.currentUser = user;
      state.isAuthenticated = true;
      state.recoverySentEmail = null;
      state.authView = 'login';
      localStorage.setItem('crm_user', JSON.stringify(user));
    },
    signup: (state, action: PayloadAction<{ name: string; email: string; role: string; company: string; phone?: string }>) => {
      const user: User = {
        id: `usr-${Date.now()}`,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
        company: action.payload.company,
        phone: action.payload.phone || '+91 98200 11223',
        title: 'Account Executive',
        department: 'Direct Sales',
        avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80`,
        timezone: 'Asia/Kolkata (IST)',
        currency: 'INR (₹)',
        quota: 50000000,
        closedWonAmount: 0,
      };
      state.currentUser = user;
      state.isAuthenticated = true;
      state.recoverySentEmail = null;
      state.authView = 'login';
      localStorage.setItem('crm_user', JSON.stringify(user));
    },
    forgotPassword: (state, action: PayloadAction<string>) => {
      state.recoverySentEmail = action.payload;
      state.pendingOtpCode = '842190';
      state.authView = 'otp-verify';
    },
    verifyOtp: (state, action: PayloadAction<string>) => {
      if (action.payload.trim() === (state.pendingOtpCode || '842190') || action.payload.trim().length === 6) {
        state.authView = 'reset-password';
      }
    },
    resetPassword: (state) => {
      state.authView = 'login';
      state.recoverySentEmail = null;
      state.pendingOtpCode = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
        localStorage.setItem('crm_user', JSON.stringify(state.currentUser));
      }
    },
    logout: (state) => {
      state.currentUser = defaultUser;
      state.isAuthenticated = false;
      state.authView = 'login';
      state.recoverySentEmail = null;
      localStorage.removeItem('crm_is_auth');
    },
    setAuthView: (state, action: PayloadAction<AuthView>) => {
      state.authView = action.payload;
    },
    clearRecoveryStatus: (state) => {
      state.recoverySentEmail = null;
      state.pendingOtpCode = null;
    },
  },
});

export const {
  login,
  signup,
  forgotPassword,
  verifyOtp,
  resetPassword,
  updateProfile,
  logout,
  setAuthView,
  clearRecoveryStatus,
} = authSlice.actions;

export default authSlice.reducer;

