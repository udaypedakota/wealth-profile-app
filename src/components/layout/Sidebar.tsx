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

  const navItems = [
    { id: 'dashboard' as ActiveNavPage, label: 'Home / Dashboard', emoji: '🏠' },
    { id: 'transactions' as ActiveNavPage, label: 'Transactions', emoji: '💳' },
    { id: 'income' as ActiveNavPage, label: 'Income Streams', emoji: '💰' },
    { id: 'expenses' as ActiveNavPage, label: 'Expenses', emoji: '📉' },
    { id: 'bills' as ActiveNavPage, label: 'Bills', emoji: '🧾' },
    { id: 'emis' as ActiveNavPage, label: 'EMIs & Loans', emoji: '🏦' },
    { id: 'chits' as ActiveNavPage, label: 'Chits', emoji: '🔄' },
    { id: 'credit_cards' as ActiveNavPage, label: 'Credit Cards', emoji: '💳', badge: stats.creditCardsCount > 0 ? `${stats.creditCardsCount}` : '1' },
    { id: 'money_lent' as ActiveNavPage, label: 'Money Lent', emoji: '🤝' },
    { id: 'money_borrowed' as ActiveNavPage, label: 'Money Borrowed', emoji: '💵' },
    { id: 'profile' as ActiveNavPage, label: 'Profile & Personal Info', emoji: '👤' },
    { id: 'settings' as ActiveNavPage, label: 'Settings', emoji: '⚙' }
  ];

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onCloseMobile} />}

      <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Header: On mobile shows User profile + close button, on desktop shows Brand */}
        <div className="sidebar-header">
          {mobileOpen ? (
            <div className="sidebar-mobile-user-header" onClick={() => handleNavClick('profile')}>
              <ProfileAvatar
                avatarUrl={personal.avatarUrl}
                fullName={personal.fullName}
                size="sm"
                showStatusDot
              />
              <div className="sidebar-footer-info" style={{ marginLeft: '10px' }}>
                <div className="sidebar-footer-name" style={{ color: '#ffffff', fontSize: '0.92rem' }}>
                  {personal.fullName}
                </div>
                <div className="sidebar-footer-tier" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  {tier.split(' ')[0]} Member
                </div>
              </div>
            </div>
          ) : (
            <div className="sidebar-brand" onClick={() => handleNavClick('profile')}>
              <div className="sidebar-brand-icon">
                <Landmark size={20} />
              </div>
              <div>
                <div className="sidebar-brand-name">MoneyMate</div>
                <div className="sidebar-brand-sub">Private Wealth</div>
              </div>
            </div>
          )}

          <button
            type="button"
            className="sidebar-close-btn"
            style={{ display: mobileOpen ? 'flex' : 'none' }}
            onClick={onCloseMobile}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items (Clean List matching Target Design) */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-group" style={{ marginTop: '4px' }}>
            {navItems.map((item) => (
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
        </nav>

        {/* User Profile Footer (Desktop only - mobile shows in header) */}
        {!mobileOpen && (
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
              <div className="sidebar-footer-tier">{tier.split(' ')[0]} Member</div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
