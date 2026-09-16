import React, { useState } from 'react';
import { Modal } from './Modal';
import { ApiClient } from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';
import { TrendingDown, TrendingUp, Check, Calendar, CreditCard, Tag } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultType?: 'debit' | 'credit';
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultType = 'debit'
}) => {
  const [type, setType] = useState<'debit' | 'credit'>(defaultType);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(defaultType === 'credit' ? 'Salary' : 'Food & Groceries');
  const [account, setAccount] = useState('Cash in Hand (Wallet)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { success, error } = useToast();

  const expenseCategories = [
    'Food & Groceries',
    'Dining Out / Tea & Snacks',
    'Transportation & Fuel',
    'Shopping & Personal',
    'Utilities & Mobile Bill',
    'Medical & Health',
    'Entertainment',
    'EMI / Loan Repayment',
    'Chit Fund Installment',
    'Lent to Friend',
    'Other Expense'
  ];

  const incomeCategories = [
    'Salary Inflow',
    'Freelance / Business',
    'Dividend / Interest',
    'Chit Payout / Return',
    'Lent Money Returned',
    'Cashback / Reward',
    'Other Income'
  ];

  const handleTypeSwitch = (newType: 'debit' | 'credit') => {
    setType(newType);
    setCategory(newType === 'credit' ? 'Salary Inflow' : 'Food & Groceries');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      error('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (!title.trim()) {
      error('Title Required', 'Please enter a short description.');
      return;
    }

    try {
      setIsSubmitting(true);
      await ApiClient.addTransaction({
        title: title.trim(),
        amount: numAmount,
        type,
        category,
        account,
        date,
        notes: notes.trim()
      });

      success(
        type === 'credit' ? 'Income Added' : 'Expense Recorded',
        `₹${numAmount.toLocaleString('en-IN')} recorded for ${title}.`
      );

      // Reset form
      setAmount('');
      setTitle('');
      setNotes('');
      onSuccess();
      onClose();
    } catch (err: any) {
      error('Save Failed', err.message || 'Could not save transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'debit' ? '⚡ Record Daily Expense' : '💰 Record Income Inflow'}
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Toggle between Expense and Income */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            padding: '4px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <button
            type="button"
            onClick={() => handleTypeSwitch('debit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: type === 'debit' ? '#fff' : 'var(--text-secondary)',
              background: type === 'debit' ? '#ef4444' : 'transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            <TrendingDown size={16} />
            <span>Expense</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeSwitch('credit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: type === 'credit' ? '#fff' : 'var(--text-secondary)',
              background: type === 'credit' ? '#10b981' : 'transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            <TrendingUp size={16} />
            <span>Income</span>
          </button>
        </div>

        {/* Amount Input (Prominent) */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
            Amount (₹) *
          </label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: type === 'credit' ? '#10b981' : '#ef4444'
              }}
            >
              ₹
            </span>
            <input
              type="number"
              step="any"
              autoFocus
              className="form-input"
              style={{
                paddingLeft: '34px',
                fontSize: '1.25rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display)'
              }}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Description / Title */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Description / Paid For *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Tea & Snacks, Supermarket Groceries, Petrol, Salary..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category & Account */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {(type === 'debit' ? expenseCategories : incomeCategories).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Payment Account</label>
            <select
              className="form-select"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            >
              <option value="Cash in Hand (Wallet)">💵 Cash in Hand (Wallet)</option>
              <option value="Primary Savings Bank Account">🏦 Primary Savings Bank</option>
              <option value="Primary Credit Card">💳 Credit Card</option>
            </select>
          </div>
        </div>

        {/* Date & Optional Notes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Optional Note</label>
            <input
              type="text"
              className="form-input"
              placeholder="Friend name, shop name..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              flex: 2,
              background: type === 'credit' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            }}
            disabled={isSubmitting}
          >
            <Check size={16} />
            <span>{isSubmitting ? 'Saving...' : type === 'credit' ? 'Record Income' : 'Record Expense'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
