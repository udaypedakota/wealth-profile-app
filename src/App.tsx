import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { ToastContainer } from './components/common/ToastContainer';
import { Sidebar, ActiveNavPage } from './components/layout/Sidebar';
import { ProfileDropdown } from './components/layout/ProfileDropdown';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { Skeleton } from './components/common/SkeletonLoader';
import { LoginView } from './components/auth/LoginView';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';
import {
  TransactionsView,
  IncomeView,
  ExpensesView,
  BillsView,
  EmisView,
  ChitsView,
  CreditCardsView,
  MoneyLentView,
  MoneyBorrowedView,
  AnalyticsView,
  BudgetsView,
  CalendarView,
  ReportsView
} from './components/views/FinancialModuleViews';

import { Menu, Sun, Moon, Bell, Search, ChevronRight, RotateCcw } from 'lucide-react';
import { ApiClient } from './services/apiClient';

const AppContent: React.FC = () => {
  const { loading } = useProfile();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [currentPage, setCurrentPage] = useState<ActiveNavPage>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [cloudOnline, setCloudOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  React.useEffect(() => {
    ApiClient.checkCloudHealth().then((h) => setCloudOnline(h.online));
    const handleStatus = (e: any) => {
      if (e?.detail) setCloudOnline(!!e.detail.online);
    };
    const handleSync = (e: any) => {
      if (e?.detail) setIsSyncing(!!e.detail.syncing);
    };
    window.addEventListener('moneymate_cloud_status', handleStatus);
    window.addEventListener('moneymate_sync_status', handleSync);
    return () => {
      window.removeEventListener('moneymate_cloud_status', handleStatus);
      window.removeEventListener('moneymate_sync_status', handleSync);
    };
  }, []);

  const [hasUnreadNotifs, setHasUnreadNotifs] = useState<boolean>(() => {
    try {
      const read = JSON.parse(localStorage.getItem('moneymate_read_notifications') || '[]');
      return read.length < 2;
    } catch {
      return true;
    }
  });

  if (loading) {
    return (
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <Skeleton height="60px" borderRadius="var(--radius-md)" style={{ marginBottom: '24px' }} />
        <Skeleton height="260px" borderRadius="var(--radius-lg)" style={{ marginBottom: '24px' }} />
        <Skeleton height="140px" borderRadius="var(--radius-md)" style={{ marginBottom: '24px' }} />
      </div>
    );
  }

  const getPageTitle = (page: ActiveNavPage) => {
    switch (page) {
      case 'dashboard': return { title: 'Personal Wealth Dashboard', emoji: '🏠' };
      case 'transactions': return { title: 'Transactions Ledger', emoji: '💳' };
      case 'income': return { title: 'Income Streams', emoji: '💰' };
      case 'expenses': return { title: 'Expenses & Living Outflows', emoji: '📉' };
      case 'bills': return { title: 'Recurring Bills & Utilities', emoji: '🧾' };
      case 'emis': return { title: 'EMIs & Asset Loans', emoji: '🏦' };
      case 'chits': return { title: 'Community Chit Funds', emoji: '🔄' };
      case 'credit_cards': return { title: 'Credit Cards & Statements', emoji: '💳' };
      case 'money_lent': return { title: 'Money Lent (Receivables)', emoji: '🤝' };
      case 'money_borrowed': return { title: 'Money Borrowed (Payables)', emoji: '💵' };
      case 'analytics': return { title: 'Wealth Analytics', emoji: '📊' };
      case 'budgets': return { title: 'Budgets & Targets', emoji: '🎯' };
      case 'calendar': return { title: 'Financial Calendar', emoji: '📅' };
      case 'reports': return { title: 'Audited Reports', emoji: '📄' };
      case 'settings': return { title: 'Application Settings', emoji: '⚙' };
      case 'profile':
      default:
        return { title: 'Client Profile & Personal Info', emoji: '👤' };
    }
  };

  const pageInfo = getPageTitle(currentPage);

  return (
    <div className="app-shell">
      {/* Exact Sidebar Navigation requested by user */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Viewport */}
      <div className="app-main-viewport">
        {/* Sticky Top Application Bar */}
        <header className="top-app-bar">
          <div className="app-bar-left">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>

            <div className="app-breadcrumbs">
              <span className="breadcrumb-root">MoneyMate</span>
              <ChevronRight size={14} color="var(--text-muted)" className="breadcrumb-sep" />
              <span className="breadcrumb-active breadcrumb-title-wrapper">
                <span className="breadcrumb-emoji">{pageInfo.emoji}</span>
                <span className="breadcrumb-title-text">{pageInfo.title}</span>
              </span>
            </div>
          </div>

          <div className="navbar-actions">
            {/* Live MongoDB Atlas Cloud Indicator */}
            <div
              className={`cloud-status-badge ${cloudOnline ? 'online' : 'offline'}`}
              onClick={async () => {
                setIsSyncing(true);
                await ApiClient.syncLocalToCloud();
                setIsSyncing(false);
              }}
              title={cloudOnline ? 'Connected to MongoDB Atlas Cloud Database. Click to sync.' : 'Offline Mode. Click to retry connection & sync.'}
              role="button"
              tabIndex={0}
            >
              {isSyncing ? (
                <RotateCcw size={12} className="spin" />
              ) : (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: cloudOnline ? '#10b981' : '#f59e0b',
                    boxShadow: cloudOnline ? '0 0 6px #10b981' : 'none'
                  }}
                />
              )}
              <span style={{ fontSize: '0.74rem' }}>
                {isSyncing ? 'Syncing...' : cloudOnline ? 'MongoDB Atlas' : 'Offline'}
              </span>
            </div>

            <div className="navbar-search" style={{ maxWidth: '240px' }}>
              <Search size={16} className="navbar-search-icon" />
              <input type="text" placeholder="Search records..." aria-label="Search records" />
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              className="nav-icon-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {resolvedTheme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#3b82f6" />}
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              className="nav-icon-btn"
              onClick={() => setIsNotifDrawerOpen(true)}
              aria-label="Open notifications"
              title={hasUnreadNotifs ? "Notifications (Unread alerts)" : "Notifications (All read)"}
            >
              <Bell size={18} />
              {hasUnreadNotifs && <span className="nav-badge-indicator" />}
            </button>

            {/* User Profile Dropdown */}
            <ProfileDropdown
              onNavigateTab={(tabId) => {
                if (tabId === 'overview') setCurrentPage('profile');
                else if (tabId === 'preferences') setCurrentPage('settings');
                else if (tabId === 'financial') setCurrentPage('credit_cards');
                else if (tabId === 'security') setCurrentPage('settings');
                else setCurrentPage('profile');
              }}
            />
          </div>
        </header>

        {/* Clean, Focused Content View for the selected module */}
        <main className="page-content-wrapper">
          {currentPage === 'dashboard' && <DashboardView onNavigatePage={setCurrentPage} />}
          {currentPage === 'profile' && <ProfileView />}
          {currentPage === 'settings' && <SettingsView />}
          {currentPage === 'transactions' && <TransactionsView />}
          {currentPage === 'income' && <IncomeView />}
          {currentPage === 'expenses' && <ExpensesView />}
          {currentPage === 'bills' && <BillsView />}
          {currentPage === 'emis' && <EmisView />}
          {currentPage === 'chits' && <ChitsView />}
          {currentPage === 'credit_cards' && <CreditCardsView />}
          {currentPage === 'money_lent' && <MoneyLentView />}
          {currentPage === 'money_borrowed' && <MoneyBorrowedView />}
          {currentPage === 'analytics' && <AnalyticsView />}
          {currentPage === 'budgets' && <BudgetsView />}
          {currentPage === 'calendar' && <CalendarView />}
          {currentPage === 'reports' && <ReportsView />}
        </main>
      </div>

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        onMarkAllRead={() => setHasUnreadNotifs(false)}
      />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

const AppRoot: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  return <AppContent />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ProfileProvider>
            <AppRoot />
          </ProfileProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
