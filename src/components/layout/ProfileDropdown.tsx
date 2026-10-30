import React, { useState, useRef, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ProfileAvatar } from '../profile/ProfileAvatar';
import {
  ChevronDown,
  User,
  ShieldCheck,
  Settings,
  LogOut
} from 'lucide-react';

interface ProfileDropdownProps {
  onNavigateTab: (tabId: string) => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onNavigateTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();
  const { currentUser, logout } = useAuth();
  const { success } = useToast();

  const { personal, contact, tier, kycVerified } = profile;
  const displayName = currentUser?.fullName || personal?.fullName || 'Private Member';
  const displayEmail = currentUser?.email || contact?.email || '';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (tabId: string) => {
    onNavigateTab(tabId);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    success('Signed Out', 'You have been signed out of your account.');
  };

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        className="profile-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <ProfileAvatar
          avatarUrl={personal.avatarUrl}
          fullName={displayName}
          size="sm"
          showStatusDot
        />
        <div className="profile-trigger-info">
          <span className="profile-trigger-name">{displayName}</span>
          <span className="profile-trigger-role">{tier ? tier.split(' ')[0] : 'Private'} Member</span>
        </div>
        <ChevronDown
          size={16}
          className="profile-trigger-chevron"
          style={{
            color: 'var(--text-muted)',
            transition: 'transform 200ms ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)'
          }}
        />
      </button>

      {isOpen && (
        <div className="profile-dropdown-menu" role="menu">
          {/* Header Card */}
          <div className="dropdown-header-card">
            <ProfileAvatar
              avatarUrl={personal.avatarUrl}
              fullName={displayName}
              size="md"
            />
            <div className="dropdown-user-details">
              <div className="dropdown-user-name">{displayName}</div>
              <div className="dropdown-user-email">{displayEmail}</div>
              {kycVerified && (
                <span className="dropdown-kyc-pill">
                  <ShieldCheck size={11} /> KYC Verified
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="dropdown-item"
            onClick={() => handleSelect('overview')}
            role="menuitem"
          >
            <User size={16} color="var(--primary)" />
            <span>Profile & Account Info</span>
          </button>

          <button
            type="button"
            className="dropdown-item"
            onClick={() => handleSelect('preferences')}
            role="menuitem"
          >
            <Settings size={16} color="#64748b" />
            <span>Account Settings</span>
          </button>

          <div className="dropdown-divider" />

          <button
            type="button"
            className="dropdown-item danger"
            onClick={handleLogout}
            role="menuitem"
          >
            <LogOut size={16} />
            <span>Sign Out / Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};
