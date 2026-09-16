import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { ProfileAvatar } from './ProfileAvatar';
import { AvatarUploadModal } from './AvatarUploadModal';
import { ProfileStats } from './ProfileStats';
import { formatDate } from '../../utils/formatters';
import {
  Edit3,
  MapPin,
  Calendar,
  Mail,
  Phone,
  ShieldCheck,
  Crown,
  Sparkles
} from 'lucide-react';

interface ProfileHeaderProps {
  onEditClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onEditClick }) => {
  const { profile, uploadAvatar, removeAvatar, completionPercentage } = useProfile();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const { personal, contact, financial, stats, memberSince, tier, kycVerified } = profile;

  return (
    <div className="profile-header-container">
      {/* Cover Banner */}
      <div className="profile-cover-banner">
        <div className="profile-cover-mesh" />
        <div className="profile-cover-badge">
          <Crown size={15} />
          <span>{tier}</span>
        </div>
      </div>

      {/* Header Body */}
      <div className="profile-header-body">
        {/* Avatar & Action Row */}
        <div className="profile-avatar-row">
          <div className="profile-avatar-wrapper">
            <ProfileAvatar
              avatarUrl={personal.avatarUrl}
              fullName={personal.fullName}
              size="xl"
              editable
              onEditClick={() => setIsAvatarModalOpen(true)}
              showStatusDot
            />
          </div>

          <div className="profile-header-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsAvatarModalOpen(true)}
            >
              <Sparkles size={15} color="var(--primary)" />
              <span>Change Photo</span>
            </button>

            <button type="button" className="btn btn-primary" onClick={onEditClick}>
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Identity & Bio */}
        <div className="profile-identity-section">
          <div className="profile-name-row">
            <h1 className="profile-full-name">{personal.fullName}</h1>
            <span className="profile-username">@{personal.username}</span>

            {kycVerified && (
              <span className="verified-badge" title="KYC Identity Verified & Tier Confirmed">
                <ShieldCheck size={14} /> KYC Verified
              </span>
            )}

            <div
              className="profile-completeness-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Completeness:</span>
              <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                {completionPercentage}%
              </span>
            </div>
          </div>

          {personal.bio && <p className="profile-bio-text">{personal.bio}</p>}

          {/* Quick Meta Chips */}
          <div className="profile-meta-chips">
            <div className="meta-chip">
              <Mail size={14} />
              <span>{contact.email}</span>
            </div>
            <div className="meta-chip">
              <Phone size={14} />
              <span>{contact.mobile}</span>
            </div>
            <div className="meta-chip">
              <MapPin size={14} />
              <span>
                {contact.city}, {contact.state} ({contact.country})
              </span>
            </div>
            <div className="meta-chip">
              <Calendar size={14} />
              <span>Member Since {formatDate(memberSince)}</span>
            </div>
          </div>
        </div>

        {/* Quick Statistics Bar */}
        <ProfileStats stats={stats} currency={financial.currency} />
      </div>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatarUrl={personal.avatarUrl}
        fullName={personal.fullName}
        onSave={uploadAvatar}
        onRemove={removeAvatar}
      />
    </div>
  );
};
