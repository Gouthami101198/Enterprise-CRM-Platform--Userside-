import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeModal, setColorTheme, addToast, ColorTheme } from '../../store/slices/uiSlice';
import { updateProfile } from '../../store/slices/authSlice';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import {
  User as UserIcon,
  Mail,
  Phone,
  Briefcase,
  Building,
  Lock,
  Palette,
  ShieldCheck,
  Check,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';

interface ThemeOption {
  id: ColorTheme;
  name: string;
  color: string;
  description: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'sunset-copper',
    name: 'Sunset Copper',
    color: 'bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400',
    description: 'Midnight Slate & Glowing Copper (Default)',
  },
  {
    id: 'sapphire',
    name: 'Sapphire Blue',
    color: 'bg-blue-600',
    description: 'Enterprise & Salesforce Style Blue',
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    color: 'bg-emerald-600',
    description: 'High Growth & Velocity Finance',
  },
  {
    id: 'violet',
    name: 'Royal Violet',
    color: 'bg-purple-600',
    description: 'Modern Luxury SaaS & Deep Violet',
  },
  {
    id: 'rose',
    name: 'Crimson Rose',
    color: 'bg-rose-600',
    description: 'Dynamic Passion & Performance',
  },
  {
    id: 'amber',
    name: 'Warm Amber Gold',
    color: 'bg-amber-600',
    description: 'Executive Gold & Autumn Warmth',
  },
  {
    id: 'cyan',
    name: 'Nordic Cyan',
    color: 'bg-cyan-600',
    description: 'Clean Tech & Modern Data Cloud',
  },
  {
    id: 'indigo',
    name: 'Electric Indigo',
    color: 'bg-indigo-600',
    description: 'Classic B2B SaaS Deep Indigo',
  },
];

export const UserProfileModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const currentColorTheme = useAppSelector((state) => state.ui.colorTheme);

  const isOpen = activeModal === 'user-profile' || activeModal === 'theme-picker';

  const [activeTab, setActiveTab] = useState<'profile' | 'themes' | 'security'>('profile');

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Vikram Malhotra',
    email: currentUser?.email || 'vikram.m@vanguardcrm.in',
    title: currentUser?.title || 'Senior Enterprise Account Executive',
    department: currentUser?.department || 'Enterprise BFSI & Strategic Accounts',
    phone: currentUser?.phone || '+91 98200 11223',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    timezone: currentUser?.timezone || 'Asia/Kolkata (IST)',
    currency: currentUser?.currency || 'INR (₹)',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  if (!isOpen) return null;

  const quota = currentUser?.quota || 75000000;
  const closedWon = currentUser?.closedWonAmount || 62000000;
  const attainment = Math.round((closedWon / quota) * 100);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    dispatch(
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal and regional settings have been saved.',
      })
    );
    dispatch(closeModal());
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      dispatch(addToast({ type: 'error', title: 'Error', message: 'Please enter current password.' }));
      return;
    }
    if (passwords.newPassword.length < 8) {
      dispatch(addToast({ type: 'error', title: 'Password Too Short', message: 'New password must be at least 8 characters.' }));
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      dispatch(addToast({ type: 'error', title: 'Mismatch', message: 'New passwords do not match.' }));
      return;
    }
    dispatch(
      addToast({
        type: 'success',
        title: 'Password Changed',
        message: 'Your security credentials have been updated successfully.',
      })
    );
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    dispatch(closeModal());
  };

  const handleSelectTheme = (themeId: ColorTheme) => {
    dispatch(setColorTheme(themeId));
    dispatch(
      addToast({
        type: 'info',
        title: 'Theme Applied',
        message: `Switched palette to ${THEME_OPTIONS.find((t) => t.id === themeId)?.name}.`,
      })
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title="User Profile & Settings"
      subtitle="Personal information, enterprise sales quota, security and theme palette"
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* User Summary Header Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-3.5">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{formData.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  {currentUser?.role || 'Enterprise AE'}
                </span>
              </div>
              <p className="text-xs text-slate-300">{formData.email}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{formData.department}</p>
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-right sm:min-w-[160px] w-full sm:w-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Q4 Personal Quota Attainment
            </span>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="text-base font-black text-emerald-400">{attainment}%</span>
              <span className="text-xs text-slate-300">({formatCurrency(closedWon)})</span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, attainment)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Personal Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'themes'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Color Themes (8)</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Contact Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Timezone
                </label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Default Display Currency
                </label>
                <input
                  type="text"
                  value={formData.currency}
                  disabled
                  className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => dispatch(closeModal())}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Profile
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Theme Selector */}
        {activeTab === 'themes' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Select Visual System Palette
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Choose from 8 curated luxury themes. Changes take effect across your CRM immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = currentColorTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-slate-800 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg shrink-0 ${theme.color} flex items-center justify-center text-white shadow-xs`}>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {theme.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {theme.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="primary" onClick={() => dispatch(closeModal())}>
                Done
              </Button>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Password */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Change Password
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your account authentication credentials with RBI-grade 256-bit encryption.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  New Password (min 8 characters) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => dispatch(closeModal())}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

