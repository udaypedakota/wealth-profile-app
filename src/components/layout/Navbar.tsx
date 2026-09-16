import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ProfileDropdown } from './ProfileDropdown';
import {
  Landmark,
  Search,
  Bell,
  Sun,
  Moon,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onNavigateTab: (tabId: string) => void;
  onNotificationClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateTab, onNotificationClick }) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => onNavigateTab('overview')}>
          <div className="brand-icon-wrapper">
            <Landmark size={22} />
          </div>
          <div>
            <div className="brand-title">
              <span>ZENITH</span>
              <span style={{ fontWeight: 300 }}>WEALTH</span>
              <span className="brand-badge">Private</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <Search size={16} className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search accounts, transactions, deposits, statements..."
            aria-label="Search"
          />
        </div>

        {/* Actions & Profile Dropdown */}
        <div className="navbar-actions">
          {/* Theme Mode Toggle Button */}
          <button
            type="button"
            className="nav-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {resolvedTheme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#3b82f6" />}
          </button>

          {/* Notifications Trigger Button */}
          <button
            type="button"
            className="nav-icon-btn"
            onClick={onNotificationClick}
            aria-label="Open notifications"
            title="Notification Center (3 unread)"
          >
            <Bell size={18} />
            <span className="nav-badge-indicator" />
          </button>

          {/* Profile Dropdown */}
          <ProfileDropdown onNavigateTab={onNavigateTab} />
        </div>
      </div>
    </nav>
  );
};
