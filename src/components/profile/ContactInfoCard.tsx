import React from 'react';
import { ContactInformation } from '../../types/profile';
import { Mail, Phone, MapPin, Edit2, CheckCircle2 } from 'lucide-react';

interface ContactInfoCardProps {
  contact: ContactInformation;
  onEditClick: () => void;
}

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ contact, onEditClick }) => {
  return (
    <div className="premium-card glow-hover">
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="card-icon-bubble">
            <Mail size={22} />
          </div>
          <div>
            <h3 className="card-title">Contact & Address</h3>
            <p className="card-subtitle">Official communication channels and verified residential address</p>
          </div>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onEditClick}>
          <Edit2 size={14} />
          <span>Edit</span>
        </button>
      </div>

      <div className="info-fields-grid">
        <div className="info-field-item">
          <span className="info-field-label">Primary Email Address</span>
          <span className="info-field-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {contact.email}
            <span title="Email Verified" style={{ display: 'inline-flex' }}>
              <CheckCircle2 size={15} color="#10b981" />
            </span>
          </span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Primary Mobile Number</span>
          <span className="info-field-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={14} color="var(--primary)" />
            {contact.mobile}
            <span title="SMS OTP Verified" style={{ display: 'inline-flex' }}>
              <CheckCircle2 size={15} color="#10b981" />
            </span>
          </span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Alternate Mobile / WhatsApp</span>
          <span className="info-field-value">{contact.altMobile || 'Not provided'}</span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">PIN / ZIP Code</span>
          <span className="info-field-value" style={{ fontFamily: 'var(--font-mono)' }}>
            {contact.zipCode}
          </span>
        </div>

        <div className="info-field-item" style={{ gridColumn: '1 / -1' }}>
          <span className="info-field-label">Residential Address</span>
          <span className="info-field-value" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              {contact.address}, {contact.city}, {contact.state} - {contact.zipCode}, {contact.country}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
