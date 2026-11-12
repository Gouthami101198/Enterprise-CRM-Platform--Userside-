import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  login,
  signup,
  forgotPassword,
  verifyOtp,
  resetPassword,
  setAuthView,
  clearRecoveryStatus,
} from '../../store/slices/authSlice';
import { setColorTheme, addToast, ColorTheme } from '../../store/slices/uiSlice';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  Eye,
  EyeOff,
  Palette,
  Zap,
  KeyRound,
  RefreshCw,
  Phone,
  Check,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const authView = useAppSelector((state) => state.auth.authView);
  const recoverySentEmail = useAppSelector((state) => state.auth.recoverySentEmail);
  const colorTheme = useAppSelector((state) => state.ui.colorTheme);

  const [showPassword, setShowPassword] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('vikram.m@vanguardcrm.in');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCompany, setSignupCompany] = useState('');
  const [signupRole, setSignupRole] = useState('Enterprise AE');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('vikram.m@vanguardcrm.in');

  // OTP verify state
  const [otpCode, setOtpCode] = useState('842190');

  // Reset password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      dispatch(addToast({ type: 'error', title: 'Email Required', message: 'Please enter your corporate email.' }));
      return;
    }
    dispatch(login({ email: loginEmail }));
    dispatch(addToast({ type: 'success', title: 'Welcome Back!', message: 'Signed into Vanguard Sales Cloud.' }));
  };

  const handleDemoLogin = () => {
    dispatch(
      login({
        email: 'vikram.m@vanguardcrm.in',
        name: 'Vikram Malhotra',
        role: 'Senior Enterprise AE',
        company: 'Vanguard Technologies Pvt. Ltd.',
      })
    );
    dispatch(
      addToast({
        type: 'success',
        title: 'Demo Session Active ⚡',
        message: 'Signed in as Vikram Malhotra (Senior Enterprise AE - Bengaluru).',
      })
    );
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupCompany.trim()) {
      dispatch(addToast({ type: 'error', title: 'Missing Information', message: 'Please complete all required fields.' }));
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      dispatch(addToast({ type: 'error', title: 'Password Mismatch', message: 'Passwords do not match.' }));
      return;
    }
    if (!agreeTerms) {
      dispatch(addToast({ type: 'error', title: 'Terms Required', message: 'Please agree to the Master Subscription Agreement.' }));
      return;
    }
    dispatch(
      signup({
        name: signupName,
        email: signupEmail,
        role: signupRole,
        company: signupCompany,
        phone: signupPhone,
      })
    );
    dispatch(addToast({ type: 'success', title: 'Account Created 🎉', message: `Welcome to Vanguard, ${signupName}!` }));
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      dispatch(addToast({ type: 'error', title: 'Email Required', message: 'Please enter your registered work email.' }));
      return;
    }
    dispatch(forgotPassword(forgotEmail));
    dispatch(
      addToast({
        type: 'info',
        title: '6-Digit OTP Dispatched',
        message: `Verification code sent to ${forgotEmail}. (Use demo code: 842190)`,
      })
    );
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      dispatch(addToast({ type: 'error', title: 'Invalid Code', message: 'Please enter the 6-digit verification code.' }));
      return;
    }
    dispatch(verifyOtp(otpCode));
    dispatch(
      addToast({
        type: 'success',
        title: 'OTP Verified Successfully',
        message: 'Identity confirmed. Please choose your new password.',
      })
    );
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      dispatch(addToast({ type: 'error', title: 'Password Too Short', message: 'Password must be at least 8 characters.' }));
      return;
    }
    if (newPassword !== confirmPassword) {
      dispatch(addToast({ type: 'error', title: 'Password Mismatch', message: 'Passwords do not match.' }));
      return;
    }
    dispatch(resetPassword());
    dispatch(
      addToast({
        type: 'success',
        title: 'Password Reset Completed 🎉',
        message: 'Your password has been securely updated. Please sign in.',
      })
    );
  };

  const colorThemes: { id: ColorTheme; name: string; color: string }[] = [
    { id: 'sunset-copper', name: 'Sunset Copper', color: 'bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400' },
    { id: 'sapphire', name: 'Sapphire Blue', color: 'bg-blue-600' },
    { id: 'emerald', name: 'Emerald Green', color: 'bg-emerald-600' },
    { id: 'violet', name: 'Royal Violet', color: 'bg-purple-600' },
    { id: 'rose', name: 'Crimson Rose', color: 'bg-rose-600' },
    { id: 'amber', name: 'Warm Amber Gold', color: 'bg-amber-600' },
    { id: 'cyan', name: 'Nordic Cyan', color: 'bg-cyan-600' },
    { id: 'indigo', name: 'Electric Indigo', color: 'bg-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex transition-colors duration-200">
      {/* Top Floating Theme Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="p-2.5 rounded-xl bg-slate-900/90 text-slate-200 shadow-md border border-slate-800 hover:border-amber-500/50 hover:scale-105 transition cursor-pointer flex items-center gap-2 text-xs font-bold"
            title="Theme Palette"
          >
            <Palette className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline capitalize">{colorTheme.replace('-', ' ')}</span>
          </button>

          {themeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 p-2 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 z-50 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 block tracking-wider">
                Select Theme Palette
              </span>
              {colorThemes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    dispatch(setColorTheme(th.id));
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${colorTheme === th.id
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'hover:bg-slate-800 text-slate-300'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full ${th.color} shrink-0`} />
                    <span>{th.name}</span>
                  </div>
                  {colorTheme === th.id && <Check className="w-3.5 h-3.5 text-amber-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Left Showcase Banner (Desktop) - Deep Midnight Slate & Glowing Amber-Copper */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-stone-900/80 to-slate-950 border-r border-slate-800 p-12 text-white relative overflow-hidden flex-col justify-between">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white leading-tight">
              Vanguard<span className="text-amber-400">CRM</span>
            </h2>
            <span className="text-[11px] font-bold text-amber-400/80 uppercase tracking-wider">
              Enterprise CRM Platform • User Panel
            </span>
          </div>
        </div>

        {/* Value Proposition & Task Requirements */}
        <div className="relative z-10 max-w-lg space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO 27001 & RBI Data Residency Compliant (Mumbai AWS)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
            Enterprise CRM Platform
            <span className="block text-xl sm:text-2xl font-bold text-amber-400 mt-1">
              User Panel for Sales Reps & Operations
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            A modern, responsive User Panel that empowers employees, sales representatives, and managers to manage their CRM activities, customer relationships, deals, and performance efficiently.
          </p>

          <div className="space-y-2.5 pt-1">
            {[
              'Lead Management: View, create, qualify & schedule follow-ups',
              'Sales Pipeline: Kanban board tracking deals with weighted forecasting',
              'Customer Management: 360° profile drawer, financial KPIs & history',
              'Task Management: Priority levels, deadlines & completion tracking',
              'Activity Tracking: Log calls, meetings, emails & follow-up touchpoints',
              'Reports & Analytics: Personal sales pacing, conversion rates & task stats',
              'Notification Center: Lead assignments, meeting alerts & pipeline updates',
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 backdrop-blur-xs shadow-xl">
          <p className="text-xs text-slate-300 italic leading-relaxed">
            "Vanguard CRM Platform User Panel enables our sales representatives and managers to execute daily CRM activities with high velocity — from lead qualification and visual Kanban deals to customer 360° touchpoints."
          </p>
          <div className="mt-3 flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              alt="Vikram Malhotra"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/50"
            />
            <div>
              <span className="text-xs font-bold text-white block">Vikram Malhotra</span>
              <span className="text-[10px] text-slate-400">Senior Enterprise AE • Vanguard Technologies Pvt. Ltd.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Card Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto bg-slate-950">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Brand */}
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Vanguard<span className="text-amber-400">CRM</span>
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Enterprise CRM Platform • User Panel
              </span>
            </div>
          </div>

          {/* Quick Demo Pill Banner (on Login) */}
          {authView === 'login' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-stone-900/60 to-slate-900 border border-amber-500/30 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Quick Evaluation Access
                </span>
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Instant Demo
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Experience Vanguard CRM pre-configured as <span className="font-bold text-white">Vikram Malhotra</span> (Senior Enterprise AE) with live Indian enterprise accounts.
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-amber-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Interactive Demo Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {authView === 'login' && (
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Sign In to Vanguard CRM</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your enterprise corporate work credentials
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Corporate Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="vikram.m@vanguardcrm.in"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => dispatch(setAuthView('forgot-password'))}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Remember this session (30 days)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-amber-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In to Cockpit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  New to Vanguard?{' '}
                  <button
                    onClick={() => dispatch(setAuthView('signup'))}
                    className="font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                  >
                    Create Employee Account
                  </button>
                </span>
              </div>
            </div>
          )}

          {/* 2. FORGOT PASSWORD FORM */}
          {authView === 'forgot-password' && (
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
              <div>
                <button
                  onClick={() => dispatch(setAuthView('login'))}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline mb-2 flex items-center gap-1 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
                <h3 className="text-xl font-bold text-white">Recover Password</h3>
                <p className="text-xs text-slate-400 mt-1">
                  We will send a 6-digit OTP code to verify your corporate identity
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Corporate Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="vikram.m@vanguardcrm.in"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-amber-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Send 6-Digit Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* 3. OTP VERIFICATION FORM */}
          {authView === 'otp-verify' && (
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
              <div>
                <button
                  onClick={() => dispatch(setAuthView('forgot-password'))}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline mb-2 flex items-center gap-1 cursor-pointer"
                >
                  ← Back to Email Input
                </button>
                <h3 className="text-xl font-bold text-white">OTP Verification</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter the 6-digit OTP code sent to <span className="font-bold text-amber-400">{recoverySentEmail || forgotEmail}</span>
                </p>
              </div>

              {/* Demo Hint Banner */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                <span className="font-bold">Demo OTP Code:</span> <span className="font-mono font-bold tracking-widest text-white ml-2 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30">842190</span>
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 text-center">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full tracking-[0.5em] text-center font-mono text-2xl py-3 bg-slate-950 border-2 border-amber-500/80 text-white rounded-xl focus:border-amber-400 outline-none"
                    placeholder="842190"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-amber-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Verify OTP Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(addToast({ type: 'info', title: 'Code Resent', message: 'A new code 842190 was sent.' }));
                  }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Code (30s)</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. RESET PASSWORD FORM */}
          {authView === 'reset-password' && (
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Create New Password</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your identity has been verified. Set a strong password for your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Set Password & Sign In</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* 5. SIGNUP FORM */}
          {authView === 'signup' && (
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
              <div>
                <button
                  onClick={() => dispatch(setAuthView('login'))}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline mb-2 flex items-center gap-1 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
                <h3 className="text-xl font-bold text-white">Create User Account</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Onboard to Vanguard Enterprise Sales Intelligence Cloud
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Corporate Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="first.last@company.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Mobile Number (India) *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-slate-700/80 bg-slate-800 text-xs font-bold text-slate-300">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="98200 11223"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 rounded-r-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Company Legal Entity *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tata Consultancy Services"
                        value={signupCompany}
                        onChange={(e) => setSignupCompany(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Role
                    </label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 text-white rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none"
                    >
                      <option value="Enterprise AE">Enterprise AE</option>
                      <option value="Regional Sales Director">Regional Sales Director</option>
                      <option value="SDR Lead">SDR Lead</option>
                      <option value="Customer Success VP">Customer Success VP</option>
                      <option value="Sales Manager">Sales Manager</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>
                      I agree to the Enterprise Master Subscription Agreement and RBI DPDP Privacy Policy.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-amber-600/25 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Create User Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => dispatch(setAuthView('login'))}
                    className="font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </span>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>© 2026 Vanguard Technologies Pvt. Ltd.</span>
            <span>Enterprise Sales Cloud v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
