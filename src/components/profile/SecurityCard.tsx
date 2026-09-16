import React, { useState } from 'react';
import { SecurityPreferences } from '../../types/profile';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Smartphone,
  Laptop,
  CheckCircle2,
  XCircle,
  EyeOff,
  LogOut,
  Info
} from 'lucide-react';

interface SecurityCardProps {
  security: SecurityPreferences;
  onUpdate: (security: SecurityPreferences) => Promise<void>;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({ security, onUpdate }) => {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { success, error, info } = useToast();

  const handleToggle2FA = async () => {
    const updated = {
      ...security,
      twoFactorAuth: !security.twoFactorAuth
    };
    await onUpdate(updated);
    if (updated.twoFactorAuth) {
      success('2FA Activated', 'Two-factor authenticator protection is now active.');
    } else {
      info('2FA Deactivated', 'Two-factor authentication disabled.');
    }
  };

  const handleToggleMaskBalances = async () => {
    const updated = {
      ...security,
      maskBalances: !security.maskBalances
    };
    await onUpdate(updated);
    success('Privacy Setting Saved', updated.maskBalances ? 'Balances are now hidden by default.' : 'Balances visible.');
  };

  const handleToggleMaskNumbers = async () => {
    const updated = {
      ...security,
      maskAccountNumbers: !security.maskAccountNumbers
    };
    await onUpdate(updated);
    success('Privacy Setting Saved', 'Account number masking updated.');
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 6) {
      error('Invalid PIN', 'App security PIN must be exactly 6 digits.');
      return;
    }
    if (pinInput !== confirmPinInput) {
      error('PIN Mismatch', 'The confirmation PIN does not match.');
      return;
    }

    await onUpdate({
      ...security,
      hasPin: true
    });
    setPinInput('');
    setConfirmPinInput('');
    setIsPinModalOpen(false);
    success('PIN Configured', 'Your 6-digit transaction PIN has been successfully set.');
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      error('Weak Password', 'Password must be at least 8 characters long.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setIsPasswordModalOpen(false);
    success('Password Updated', 'Your master account password has been updated.');
  };

  const handleRevokeOtherSessions = async () => {
    const currentOnly = security.activeSessions.filter((s) => s.isCurrent);
    await onUpdate({
      ...security,
      activeSessions: currentOnly
    });
    success('Sessions Terminated', 'All other active device sessions have been revoked.');
  };

  return (
    <div className="premium-card glow-hover">
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="card-icon-bubble">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="card-title">Security, Privacy & Active Devices</h3>
            <p className="card-subtitle">
              Authentication controls, PIN protection, balance privacy, and authorized active sessions
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Last Authentication: <strong style={{ color: 'var(--text-primary)' }}>{security.lastLogin}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Credentials & PIN Grid */}
        <div className="card-grid-2col">
          <div className="info-field-item" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={18} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  6-Digit Security PIN
                </span>
              </div>
              <span className="verified-badge">
                <CheckCircle2 size={12} /> Configured
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
              Required for authorising high-value transactions, Chit bidding, and profile updates.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsPinModalOpen(true)}
            >
              Change 6-Digit PIN
            </button>
          </div>

          <div className="info-field-item" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Master Account Password
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated 30d ago</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
              Primary password credentials used for logging into Zenith Wealth online banking.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Two-Factor Auth & Privacy Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="toggle-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <div className="toggle-info">
                <div className="toggle-title">Two-Factor Authentication (2FA)</div>
                <div className="toggle-desc">
                  Enforces an authenticator TOTP token or hardware key prompt upon client sign-in
                </div>
              </div>
            </div>
            <label className="switch-control">
              <input
                type="checkbox"
                checked={security.twoFactorAuth}
                onChange={handleToggle2FA}
              />
              <span className="switch-slider" />
            </label>
          </div>

          <div className="toggle-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <EyeOff size={20} color="var(--primary)" />
              <div className="toggle-info">
                <div className="toggle-title">Mask Account Balances by Default</div>
                <div className="toggle-desc">
                  Hides account balances behind dots on public or shared screen sessions
                </div>
              </div>
            </div>
            <label className="switch-control">
              <input
                type="checkbox"
                checked={security.maskBalances}
                onChange={handleToggleMaskBalances}
              />
              <span className="switch-slider" />
            </label>
          </div>
        </div>

        {/* Active Authorized Devices */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Authorized Active Sessions ({security.activeSessions.length})
            </h4>
            {security.activeSessions.length > 1 && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                onClick={handleRevokeOtherSessions}
              >
                <LogOut size={13} />
                <span>Revoke Other Sessions</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {security.activeSessions.map((sess) => (
              <div
                key={sess.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {sess.os.includes('Windows') ? (
                    <Laptop size={22} color="var(--primary)" />
                  ) : (
                    <Smartphone size={22} color="var(--primary)" />
                  )}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {sess.deviceName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {sess.browser} • {sess.os} • {sess.location} ({sess.ip})
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {sess.isCurrent ? (
                    <span className="verified-badge" style={{ fontSize: '0.7rem' }}>
                      Current Device
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {sess.lastActive}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note on frontend project */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            padding: '10px 14px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <Info size={16} color="var(--primary)" />
          <span>
            Security controls are fully reactive client-side mock placeholders ready for MongoDB Atlas / JWT auth integration.
          </span>
        </div>
      </div>

      {/* Change PIN Modal */}
      <Modal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        title="Change 6-Digit Security PIN"
        maxWidth="440px"
      >
        <form onSubmit={handleSavePin}>
          <div className="form-group">
            <label className="form-label">New 6-Digit PIN</label>
            <input
              type="password"
              maxLength={6}
              className="form-input"
              style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.2rem' }}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="••••••"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm 6-Digit PIN</label>
            <input
              type="password"
              maxLength={6}
              className="form-input"
              style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.2rem' }}
              value={confirmPinInput}
              onChange={(e) => setConfirmPinInput(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="••••••"
              required
            />
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsPinModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Security PIN
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Master Password"
        maxWidth="440px"
      >
        <form onSubmit={handleSavePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Master Password</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters with numbers"
              required
            />
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save New Password
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
