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
      title="Add Transaction"
      maxWidth="460px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Toggle between Expense and Income (Matches Reference Design Image 1 Screen 4) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            padding: '4px',
            background: 'var(--bg-surface)',
            borderRadius: '9999px',
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
              padding: '10px 16px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: type === 'debit' ? '#fff' : 'var(--text-secondary)',
              background: type === 'debit' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'transparent',
              boxShadow: type === 'debit' ? '0 3px 10px rgba(239, 68, 68, 0.35)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            Expense
          </button>

          <button
            type="button"
            onClick={() => handleTypeSwitch('credit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 16px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: type === 'credit' ? '#fff' : 'var(--text-secondary)',
              background: type === 'credit' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
              boxShadow: type === 'credit' ? '0 3px 10px rgba(16, 185, 129, 0.35)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            Income
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Category
          </label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '12px 14px', borderRadius: '12px', fontSize: '0.92rem' }}
          >
            {(type === 'debit' ? expenseCategories : incomeCategories).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Amount
          </label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--text-muted)'
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
                paddingLeft: '38px',
                fontSize: '1.15rem',
                fontWeight: 700,
                borderRadius: '12px',
                paddingTop: '12px',
                paddingBottom: '12px',
                fontFamily: 'var(--font-display)'
              }}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Date */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Date
          </label>
          <div style={{ position: 'relative' }}>
            <Calendar
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="date"
              className="form-input"
              style={{ paddingLeft: '42px', borderRadius: '12px', paddingTop: '12px', paddingBottom: '12px' }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Description
          </label>
          <input
            type="text"
            className="form-input"
            style={{ borderRadius: '12px', paddingTop: '12px', paddingBottom: '12px' }}
            placeholder="Enter description"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Payment Account */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Account (Optional)
          </label>
          <select
            className="form-select"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: '10px', fontSize: '0.84rem' }}
          >
            <option value="Cash in Hand (Wallet)">💵 Cash in Hand (Wallet)</option>
            <option value="Primary Savings Bank Account">🏦 Primary Savings Bank Account</option>
            <option value="Primary Credit Card">💳 Primary Credit Card</option>
          </select>
        </div>

        {/* Save Transaction Button (Full Width Pill matching Image 1 Screen 4) */}
        <div style={{ marginTop: '6px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 700,
              background:
                type === 'credit'
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow:
                type === 'credit'
                  ? '0 4px 14px rgba(16, 185, 129, 0.4)'
                  : '0 4px 14px rgba(239, 68, 68, 0.4)'
            }}
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Saving...' : 'Save Transaction'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
