export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  title?: string;
  department?: string;
  phone?: string;
  avatar?: string;
  timezone?: string;
  currency?: string;
  quota?: number;
  closedWonAmount?: number;
}

export type AuthView = 'login' | 'signup' | 'forgot-password' | 'otp-verify' | 'reset-password';

