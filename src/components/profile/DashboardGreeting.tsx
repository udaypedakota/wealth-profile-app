import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import { ProfileAvatar } from './ProfileAvatar';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

interface DashboardGreetingProps {
  onEditClick: () => void;
}

export const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ onEditClick }) => {
  const { profile } = useProfile();
  const { personal, tier } = profile;

  // Compute greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '16px 20px',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginTop: '20px',
        marginBottom: '4px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <ProfileAvatar
          avatarUrl={personal.avatarUrl}
          fullName={personal.fullName}
          size="md"
          showStatusDot
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {getGreeting()}, {personal.firstName || personal.fullName}!
            </h2>
            <Sparkles size={16} color="var(--primary)" />
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Welcome to your unified {tier} dossier & wealth control centre.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface)'
          }}
        >
          <Calendar size={14} color="var(--primary)" />
          <span>{todayStr}</span>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onEditClick}
        >
          <span>Update Info</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
