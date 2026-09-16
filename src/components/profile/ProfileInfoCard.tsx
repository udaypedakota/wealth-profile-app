import React from 'react';
import { PersonalInformation } from '../../types/profile';
import { formatDate } from '../../utils/formatters';
import { User, Edit2, Calendar, Shield, AtSign } from 'lucide-react';

interface ProfileInfoCardProps {
  personal: PersonalInformation;
  onEditClick: () => void;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ personal, onEditClick }) => {
  return (
    <div className="premium-card glow-hover">
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="card-icon-bubble">
            <User size={22} />
          </div>
          <div>
            <h3 className="card-title">Personal Information</h3>
            <p className="card-subtitle">Primary client identity, name, and biographical records</p>
          </div>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onEditClick}>
          <Edit2 size={14} />
          <span>Edit</span>
        </button>
      </div>

      <div className="info-fields-grid">
        <div className="info-field-item">
          <span className="info-field-label">Full Legal Name</span>
          <span className="info-field-value">{personal.fullName || 'Not specified'}</span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Username</span>
          <span className="info-field-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AtSign size={14} color="var(--primary)" />
            {personal.username || 'Not assigned'}
          </span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">First Name</span>
          <span className="info-field-value">{personal.firstName || 'Not specified'}</span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Last Name</span>
          <span className="info-field-value">{personal.lastName || 'Not specified'}</span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Date of Birth</span>
          <span className="info-field-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--text-muted)" />
            {formatDate(personal.dateOfBirth)}
          </span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Gender</span>
          <span className="info-field-value">{personal.gender || 'Not specified'}</span>
        </div>

        <div className="info-field-item" style={{ gridColumn: '1 / -1' }}>
          <span className="info-field-label">Biographical Statement / About Me</span>
          <p className="info-field-value" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            {personal.bio || 'No bio provided. Click edit to add a brief introduction.'}
          </p>
        </div>
      </div>
    </div>
  );
};
