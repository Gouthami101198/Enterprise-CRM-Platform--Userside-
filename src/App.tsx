import React, { useEffect } from 'react';
import { useAppSelector } from './store';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { useTitleTicker } from './hooks/useTitleTicker';

// Authentication page
import { AuthPage } from './components/auth/AuthPage';

// Main views
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { LeadList } from './components/leads/LeadList';
import { PipelineBoard } from './components/pipeline/PipelineBoard';
import { CustomerList } from './components/customers/CustomerList';
import { TaskList } from './components/tasks/TaskList';
import { ActivityFeed } from './components/activities/ActivityFeed';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { NotificationsView } from './components/notifications/NotificationsView';

// Modals & Drawers
import { LeadModal } from './components/leads/LeadModal';
import { ConvertLeadModal } from './components/leads/ConvertLeadModal';
import { LeadFollowUpModal } from './components/leads/LeadFollowUpModal';
import { DealModal } from './components/pipeline/DealModal';
import { CustomerModal } from './components/customers/CustomerModal';
import { CustomerProfileDrawer } from './components/customers/CustomerProfileDrawer';
import { TaskModal } from './components/tasks/TaskModal';
import { LogActivityModal } from './components/activities/LogActivityModal';
import { UserProfileModal } from './components/profile/UserProfileModal';

export const App: React.FC = () => {
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const theme = useAppSelector((state) => state.ui.theme);
  const colorTheme = useAppSelector((state) => state.ui.colorTheme);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Browser Tab Title matching Vanguard CRM Platform
  useTitleTicker('Vanguard CRM Platform');

  // Sync theme and color theme to document root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (colorTheme) {
      document.documentElement.setAttribute('data-theme', colorTheme);
    }
  }, [theme, colorTheme]);

  // If not authenticated, render login / signup / forgot password screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
        <AuthPage />
        <ToastContainer />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'leads':
        return <LeadList />;
      case 'pipeline':
        return <PipelineBoard />;
      case 'customers':
        return <CustomerList />;
      case 'tasks':
        return <TaskList />;
      case 'activities':
        return <ActivityFeed />;
      case 'analytics':
        return <AnalyticsView />;
      case 'notifications':
        return <NotificationsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased overflow-hidden transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileNav />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          <div className="w-full max-w-[1600px] mx-auto">{renderActiveView()}</div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <LeadModal />
      <ConvertLeadModal />
      <LeadFollowUpModal />
      <DealModal />
      <CustomerModal />
      <CustomerProfileDrawer />
      <TaskModal />
      <LogActivityModal />
      <UserProfileModal />

      {/* Floating Toasts */}
      <ToastContainer />
    </div>
  );
};

export default App;
