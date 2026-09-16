import React, { useState } from 'react';
import { AccountItem, AccountType, CurrencyCode } from '../../types/profile';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  CreditCard,
  Wallet,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

interface AccountSummaryProps {
  accounts: AccountItem[];
  currency: CurrencyCode;
  maskBalances?: boolean;
  onAddAccount: (account: AccountItem) => Promise<void>;
  onUpdateAccount: (account: AccountItem) => Promise<void>;
  onDeleteAccount: (accountId: string) => Promise<void>;
}

export const AccountSummary: React.FC<AccountSummaryProps> = ({
  accounts,
  currency,
  maskBalances = false,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountItem | null>(null);
  const [hideBalances, setHideBalances] = useState(maskBalances);
  const { success, error } = useToast();

  // Form states
  const [formData, setFormData] = useState<{
    name: string;
    type: AccountType;
    institution: string;
    lastFour: string;
    balance: number;
    status: 'primary' | 'active' | 'linked';
    expiryDate: string;
  }>({
    name: '',
    type: 'bank',
    institution: '',
    lastFour: '',
    balance: 0,
    status: 'active',
    expiryDate: ''
  });

  const openAddModal = () => {
    setEditingAccount(null);
    setFormData({
      name: '',
      type: 'bank',
      institution: '',
      lastFour: '',
      balance: 0,
      status: 'active',
      expiryDate: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (acc: AccountItem) => {
    setEditingAccount(acc);
    setFormData({
      name: acc.name,
      type: acc.type,
      institution: acc.institution,
      lastFour: acc.maskedNumber.replace(/[^\d]/g, ''),
      balance: acc.balance,
      status: acc.status,
      expiryDate: acc.expiryDate || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Validation Error', 'Account name is required.');
      return;
    }

    try {
      const maskedNumber = `•••• ${formData.lastFour ? formData.lastFour.padStart(4, '0').slice(-4) : '0000'}`;

      if (editingAccount) {
        await onUpdateAccount({
          ...editingAccount,
          name: formData.name,
          type: formData.type,
          institution: formData.institution,
          maskedNumber,
          balance: Number(formData.balance),
          status: formData.status,
          expiryDate: formData.type === 'credit_card' ? formData.expiryDate : undefined
        });
        success('Account Updated', `${formData.name} updated successfully.`);
      } else {
        const newAcc: AccountItem = {
          id: 'acc_' + Math.random().toString(36).substring(2, 8),
          name: formData.name,
          type: formData.type,
          institution: formData.institution || 'Direct Bank',
          maskedNumber,
          balance: Number(formData.balance),
          currency,
          status: formData.status,
          expiryDate: formData.type === 'credit_card' ? formData.expiryDate : undefined,
          cardColor:
            formData.type === 'credit_card'
              ? 'linear-gradient(135deg, #374151 0%, #111827 100%)'
              : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        };
        await onAddAccount(newAcc);
        success('Account Connected', `${formData.name} linked successfully.`);
      }
      setIsModalOpen(false);
    } catch {
      error('Operation Failed', 'Unable to save account details.');
    }
  };

  const handleDelete = async (accountId: string, accountName: string) => {
    if (window.confirm(`Are you sure you want to unlink ${accountName}?`)) {
      try {
        await onDeleteAccount(accountId);
        success('Account Unlinked', `${accountName} was removed.`);
      } catch {
        error('Error', 'Unable to unlink account.');
      }
    }
  };

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case 'credit_card':
        return <CreditCard size={20} />;
      case 'cash':
      case 'wallet':
        return <Wallet size={20} />;
      case 'bank':
      case 'savings':
      default:
        return <Building2 size={20} />;
    }
  };

  return (
    <div className="premium-card glow-hover">
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="card-icon-bubble">
            <Building2 size={22} />
          </div>
          <div>
            <h3 className="card-title">Connected Accounts & Instruments</h3>
            <p className="card-subtitle">
              Manage liquid bank accounts, high-yield deposits, and luxury credit card lines
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setHideBalances(!hideBalances)}
            title={hideBalances ? 'Reveal balances' : 'Hide balances'}
          >
            {hideBalances ? <Eye size={15} /> : <EyeOff size={15} />}
            <span>{hideBalances ? 'Show Balances' : 'Hide Balances'}</span>
          </button>

          <button type="button" className="btn btn-primary btn-sm" onClick={openAddModal}>
            <Plus size={16} />
            <span>Add Account / Card</span>
          </button>
        </div>
      </div>

      <div className="card-grid-3col">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="account-card-item"
            style={{ background: acc.cardColor || 'var(--bg-surface)' }}
          >
            <div className="account-card-top">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--primary)' }}>{getAccountIcon(acc.type)}</span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>{acc.name}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                  {acc.institution}
                </div>
              </div>

              <span className="account-type-badge">{acc.type.replace('_', ' ')}</span>
            </div>

            <div className="account-card-number" style={{ color: '#cbd5e1' }}>
              {acc.maskedNumber}
              {acc.expiryDate && (
                <span style={{ fontSize: '0.75rem', marginLeft: '12px', color: '#94a3b8' }}>
                  EXP: {acc.expiryDate}
                </span>
              )}
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                {acc.type === 'credit_card' ? 'Current Outstanding Due' : 'Available Liquid Balance'}
              </div>
              <div
                className="account-card-balance"
                style={{
                  color: acc.balance < 0 ? '#fb7185' : '#fff'
                }}
              >
                {hideBalances ? '••••••••' : formatCurrency(acc.balance, currency)}
              </div>
            </div>

            <div className="account-card-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                onClick={() => openEditModal(acc)}
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
                onClick={() => handleDelete(acc.id, acc.name)}
                title="Unlink Account"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Account Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAccount ? 'Edit Account / Card' : 'Link New Account or Card'}
        maxWidth="520px"
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Account / Card Nickname</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. HDFC Salary, Amex Platinum Metal"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Instrument Type</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as AccountType })}
              >
                <option value="bank">Checking / Current Account</option>
                <option value="savings">Savings Account</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Liquid Cash Reserve</option>
                <option value="wallet">Digital Wallet</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Banking Institution</label>
              <input
                type="text"
                className="form-input"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g. HDFC, ICICI, SBI"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Last 4 Digits</label>
              <input
                type="text"
                maxLength={4}
                className="form-input"
                value={formData.lastFour}
                onChange={(e) => setFormData({ ...formData, lastFour: e.target.value.replace(/[^\d]/g, '') })}
                placeholder="4892"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Balance ({currency})</label>
              <input
                type="number"
                className="form-input"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
                placeholder="0"
                required
              />
            </div>
          </div>

          {formData.type === 'credit_card' && (
            <div className="form-group">
              <label className="form-label">Card Expiration (MM/YY)</label>
              <input
                type="text"
                maxLength={5}
                className="form-input"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                placeholder="12/28"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Account Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="primary">Primary Operating Account</option>
              <option value="active">Active & Linked</option>
              <option value="linked">Secondary / Linked</option>
            </select>
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAccount ? 'Save Changes' : 'Connect Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
