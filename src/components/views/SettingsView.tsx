import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import { AppearanceSettings } from '../profile/AppearanceSettings';
import { NotificationPreferences } from '../profile/NotificationPreferences';
import { SecurityCard } from '../profile/SecurityCard';

export const SettingsView: React.FC = () => {
  const { profile, updateNotifications, updateSecurity } = useProfile();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title">Application Settings & Security</h2>
          <p className="section-top-subtitle">
            Manage your display themes, notification reminder triggers, and privacy PIN
          </p>
        </div>
      </div>

      <AppearanceSettings />

      <NotificationPreferences
        notifications={profile.notifications}
        onUpdate={updateNotifications}
      />

      <SecurityCard
        security={profile.security}
        onUpdate={updateSecurity}
      />
    </div>
  );
};
