import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import { ProfileAvatar } from '../profile/ProfileAvatar';
import { Landmark, X } from 'lucide-react';

export type ActiveNavPage =
  | 'dashboard'
  | 'transactions'
  | 'income'
  | 'expenses'
  | 'bills'
  | 'emis'
  | 'chits'
  | 'credit_cards'
  | 'money_lent'
  | 'money_borrowed'
  | 'analytics'
  | 'budgets'
  | 'calendar'
  | 'reports'
  | 'profile'
  | 'settings';

interface SidebarProps {
  currentPage: ActiveNavPage;
  onSelectPage: (page: ActiveNavPage) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  mobileOpen,
  onCloseMobile
}) => {
  const { profile } = useProfile();
  const { personal, tier, stats } = profile;

  const handleNavClick = (page: ActiveNavPage) => {
    onSelectPage(page);
    onCloseMobile();
  };

  const navSections = [
    {
      title: 'Daily Financial Ledger',
      items: [
        { id: 'dashboard' as ActiveNavPage, label: 'Home / Dashboard', emoji: '🏠', badge: 'Overview' },
        { id: 'transactions' as ActiveNavPage, label: 'Transactions', emoji: '💳', badge: stats.totalTransactions > 0 ? `${stats.totalTransactions}` : undefined },
        { id: 'income' as ActiveNavPage, label: 'Income Streams', emoji: '💰', badge: undefined },
        { id: 'expenses' as ActiveNavPage, label: 'Expenses', emoji: '📉', badge: undefined },
        { id: 'bills' as ActiveNavPage, label: 'Bills', emoji: '🧾', badge: stats.activeBills > 0 ? `${stats.activeBills} Due` : undefined },
        { id: 'emis' as ActiveNavPage, label: 'EMIs & Loans', emoji: '🏦', badge: stats.activeEmis > 0 ? `${stats.activeEmis} Active` : undefined },
        { id: 'chits' as ActiveNavPage, label: 'Chits', emoji: '🔄', badge: undefined },
        { id: 'credit_cards' as ActiveNavPage, label: 'Credit Cards', emoji: '💳', badge: stats.creditCardsCount > 0 ? `${stats.creditCardsCount}` : undefined },
        { id: 'money_lent' as ActiveNavPage, label: 'Money Lent', emoji: '🤝', badge: undefined },
        { id: 'money_borrowed' as ActiveNavPage, label: 'Money Borrowed', emoji: '💵', badge: undefined }
      ]
    },
    {
      title: 'Personal Account',
      items: [
        { id: 'profile' as ActiveNavPage, label: 'Profile & Personal Info', emoji: '👤', badge: profile.kycVerified ? 'KYC' : undefined },
        { id: 'settings' as ActiveNavPage, label: 'Settings', emoji: '⚙', badge: undefined }
      ]
    }
  ];

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onCloseMobile} />}

      <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand" onClick={() => handleNavClick('profile')}>
            <div className="sidebar-brand-icon">
              <Landmark size={20} />
            </div>
            <div>
              <div className="sidebar-brand-name">MoneyMate</div>
              <div className="sidebar-brand-sub">Private Wealth</div>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-toggle-btn"
            style={{ display: mobileOpen ? 'flex' : 'none' }}
            onClick={onCloseMobile}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="sidebar-nav">
          {navSections.map((section, idx) => (
            <div key={idx} className="sidebar-nav-group">
              <div className="sidebar-group-title">{section.title}</div>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar-nav-item ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="nav-emoji">{item.emoji}</span>
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-count-badge">{item.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div
          className="sidebar-footer-profile"
          onClick={() => handleNavClick('profile')}
          title="Open Profile"
        >
          <ProfileAvatar
            avatarUrl={personal.avatarUrl}
            fullName={personal.fullName}
            size="sm"
            showStatusDot
          />
          <div className="sidebar-footer-info">
            <div className="sidebar-footer-name">{personal.fullName}</div>
            <div className="sidebar-footer-tier">{tier.split(' ')[0]} Client</div>
          </div>
        </div>
      </aside>
    </>
  );
};
