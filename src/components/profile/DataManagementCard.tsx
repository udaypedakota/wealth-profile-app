import React, { useRef, useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FolderArchive,
  FileJson
} from 'lucide-react';

export const DataManagementCard: React.FC = () => {
  const { profile, exportData, importData, resetDemoData } = useProfile();
  const { success, error, info } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleExport = async () => {
    try {
      const jsonStr = await exportData();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateTag = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `zenith-wealth-profile-${dateTag}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      success('Export Completed', 'Profile and ledger records downloaded as JSON.');
    } catch {
      error('Export Failed', 'Unable to export profile data.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    try {
      const text = await file.text();
      await importData(text);
      success('Import Successful', 'Your profile and records have been restored.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      error('Import Failed', err.message || 'The uploaded file is not a valid profile backup.');
    }
  };

  const handleConfirmReset = async () => {
    try {
      await resetDemoData();
      setIsResetModalOpen(false);
      success('Demo Restored', 'All profile fields and mock records reset to factory defaults.');
    } catch {
      error('Reset Failed', 'Unable to reset data.');
    }
  };

  const dataBreakdown = [
    { label: 'Client Profile & Biometrics', count: '1 Record (Name, Bio, KYC)', status: 'Encrypted Local' },
    { label: 'Verified Contact Channels', count: '2 Phones, 1 Email, 1 Address', status: 'Active' },
    { label: 'Financial Targets & Goals', count: 'Income, Budget, Savings Target', status: 'Synchronized' },
    { label: 'Connected Accounts & Cards', count: `${profile.accounts.length} Instruments`, status: 'Linked' },
    { label: 'Ledger Transaction Metrics', count: `${profile.stats.totalTransactions} Aggregated Records`, status: 'Computed' },
    { label: 'System Alert Preferences', count: '11 Triggers & Channels', status: 'Customized' },
    { label: 'Appearance & Themes', count: `${profile.appearance.theme} / ${profile.appearance.accentColor}`, status: 'Saved' }
  ];

  return (
    <div className="premium-card glow-hover">
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="card-icon-bubble">
            <Database size={22} />
          </div>
          <div>
            <h3 className="card-title">My Data & Storage Governance</h3>
            <p className="card-subtitle">
              Inspect entities maintained by the application, export your dataset, or restore demo information
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleExport}>
            <Download size={14} />
            <span>Export My Data</span>
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} />
            <span>Import JSON</span>
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            onClick={() => setIsResetModalOpen(true)}
          >
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
          Active Data Entities Maintained
        </h4>

        <div className="card-grid-2col">
          {dataBreakdown.map((item, idx) => (
            <div
              key={idx}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FolderArchive size={16} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.count}</div>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--badge-bg)',
                  border: '1px solid var(--badge-border)',
                  color: 'var(--text-secondary)'
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 16px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}
        >
          <FileJson size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
          <div>
            Your data is stored strictly in your browser's private localStorage and memory sandbox.
            Exporting creates a standardized JSON snapshot compatible with direct database seeding in MongoDB Atlas.
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset to Demo State?"
        maxWidth="460px"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsResetModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirmReset}
            >
              Confirm Reset
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <AlertTriangle size={32} color="#ef4444" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}>
              Are you sure you want to restore demo information?
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              This will overwrite any customized names, addresses, uploaded avatars, or added cards with the standard
              Zenith Private Wealth demo profile dataset.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
