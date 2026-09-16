import React, { useState, useEffect, useMemo } from 'react';
import { ApiClient } from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';
import { useProfile } from '../../context/ProfileContext';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import {
  CreditCard,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Percent,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export interface CreditCardAccount {
  id: string;
  name: string;
  type: string;
  institution: string;
  maskedNumber: string;
  creditLimit: number;
  usedAmount: number;
  balance?: number;
  availableLimit: number;
  dueDate?: string;
  statementDate?: string;
  currency?: string;
  status: string;
  expiryDate?: string;
  cardColor?: string;
}

const CARD_COLOR_PRESETS = [
  { name: 'Sleek Obsidian', value: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' },
  { name: 'Midnight Emerald', value: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' },
  { name: 'Royal Crimson', value: 'linear-gradient(135deg, #881337 0%, #be123c 100%)' },
  { name: 'Deep Sapphire', value: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)' },
  { name: 'Graphite Carbon', value: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)' },
  { name: 'Sunset Bronze', value: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)' }
];

export const CreditCardsView: React.FC = () => {
  const { profile } = useProfile();
  const { success, error } = useToast();

  const [accounts, setAccounts] = useState<CreditCardAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CreditCardAccount | null>(null);

  // Add Form State
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [usedAmount, setUsedAmount] = useState('');
  const [last4, setLast4] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [statementDate, setStatementDate] = useState('');
  const [cardColor, setCardColor] = useState(CARD_COLOR_PRESETS[0].value);
  const [submitting, setSubmitting] = useState(false);

  // Update Balance Form State
  const [updateUsedVal, setUpdateUsedVal] = useState('');
  const [updateLimitVal, setUpdateLimitVal] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadCards = async () => {
    try {
      setLoading(true);
      const list = await ApiClient.getAccounts();
      if (Array.isArray(list)) {
        const creditCards = list
          .filter((a: any) => a.type === 'credit_card')
          .map((c: any) => {
            const lim = Number(c.creditLimit || c.totalLimit || 100000);
            const used = Number(c.usedAmount !== undefined ? c.usedAmount : Math.abs(c.balance || 0));
            const avail = Math.max(0, lim - used);
            return {
              ...c,
              creditLimit: lim,
              usedAmount: used,
              availableLimit: avail
            };
          });
        setAccounts(creditCards);
      }
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
    const handleDataChanged = () => loadCards();
    window.addEventListener('moneymate_data_changed', handleDataChanged);
    return () => window.removeEventListener('moneymate_data_changed', handleDataChanged);
  }, []);

  // Summary Computations
  const totalLimit = useMemo(
    () => accounts.reduce((sum, c) => sum + (Number(c.creditLimit) || 0), 0),
    [accounts]
  );
  const totalUsed = useMemo(
    () => accounts.reduce((sum, c) => sum + (Number(c.usedAmount) || 0), 0),
    [accounts]
  );
  const totalAvailable = Math.max(0, totalLimit - totalUsed);
  const overallUtilization = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0;

  const handleOpenAdd = () => {
    setName('');
    setInstitution('');
    setCreditLimit('');
    setUsedAmount('');
    setLast4('');
    setDueDate('15th of every month');
    setStatementDate('2nd of every month');
    setCardColor(CARD_COLOR_PRESETS[0].value);
    setIsAddOpen(true);
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const limNum = parseFloat(creditLimit);
    const usedNum = parseFloat(usedAmount) || 0;

    if (!name.trim()) {
      error('Name Required', 'Please enter a card name (e.g. HDFC Regalia).');
      return;
    }
    if (isNaN(limNum) || limNum <= 0) {
      error('Limit Required', 'Please enter total credit limit.');
      return;
    }

    try {
      setSubmitting(true);
      await ApiClient.addAccount({
        name: name.trim(),
        type: 'credit_card',
        institution: institution.trim() || 'Bank Finance',
        maskedNumber: last4 ? `•••• ${last4.slice(-4)}` : '•••• 1998',
        creditLimit: limNum,
        usedAmount: usedNum,
        availableLimit: Math.max(0, limNum - usedNum),
        balance: -Math.abs(usedNum),
        dueDate: dueDate.trim() || '15th of month',
        statementDate: statementDate.trim() || '2nd of month',
        currency: 'INR',
        status: 'active',
        expiryDate: '05/29',
        cardColor
      });

      success('Card Linked', `Added ${name} with limit ${formatCurrency(limNum, 'INR')}.`);
      setIsAddOpen(false);
      loadCards();
    } catch (err: any) {
      error('Error', err.message || 'Could not link card.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenUpdate = (card: CreditCardAccount) => {
    setSelectedCard(card);
    setUpdateUsedVal(card.usedAmount.toString());
    setUpdateLimitVal(card.creditLimit.toString());
    setIsUpdateOpen(true);
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;

    const newUsed = parseFloat(updateUsedVal) || 0;
    const newLimit = parseFloat(updateLimitVal) || selectedCard.creditLimit;

    try {
      setUpdating(true);
      await ApiClient.updateAccount(selectedCard.id, {
        usedAmount: newUsed,
        creditLimit: newLimit,
        availableLimit: Math.max(0, newLimit - newUsed),
        balance: -Math.abs(newUsed)
      });

      success('Balance Updated', `Updated used balance to ${formatCurrency(newUsed, 'INR')}.`);
      setIsUpdateOpen(false);
      loadCards();
    } catch (err: any) {
      error('Error', err.message || 'Could not update card.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCard = async (id: string, cardName: string) => {
    if (!window.confirm(`Unlink credit card "${cardName}"?`)) return;
    try {
      await ApiClient.deleteAccount(id);
      success('Card Unlinked', `Removed "${cardName}".`);
      loadCards();
    } catch (err: any) {
      error('Error', err.message || 'Could not delete card.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title">
            <span className="nav-emoji">💳</span>
            <span>Credit Cards & Credit Lines</span>
          </h2>
          <p className="section-top-subtitle">
            {accounts.length} Active Card{accounts.length === 1 ? '' : 's'} Linked • Track total limits, outstanding usage, and due dates
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          <span>+ Link New Card</span>
        </button>
      </div>

      {/* 4 KPI Summary Cards (Total Limit, Used, Available, Utilization) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}
      >
        {/* Total Credit Limit */}
        <div className="premium-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Credit Limit
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.12)',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CreditCard size={14} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatCurrency(totalLimit, 'INR')}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across {accounts.length} active credit cards
          </div>
        </div>

        {/* Total Used / Outstanding */}
        <div className="premium-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Used / Dues
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(244, 63, 94, 0.12)',
                color: '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingDown size={14} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: '#f43f5e' }}>
            {formatCurrency(totalUsed, 'INR')}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Current statement balance
          </div>
        </div>

        {/* Available Limit */}
        <div className="premium-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Available Limit
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingUp size={14} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: '#10b981' }}>
            {formatCurrency(totalAvailable, 'INR')}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Ready to spend buffer
          </div>
        </div>

        {/* Utilization Ratio */}
        <div className="premium-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Credit Utilization
            </span>
            <span
              className={`badge-status ${
                overallUtilization <= 30 ? 'success' : overallUtilization <= 50 ? 'warning' : 'danger'
              }`}
              style={{ fontSize: '0.68rem', padding: '2px 6px' }}
            >
              {overallUtilization <= 30 ? 'Healthy (<30%)' : overallUtilization <= 50 ? 'Moderate' : 'High Usage'}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {overallUtilization}%
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--border-subtle)',
              marginTop: '8px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${Math.min(100, overallUtilization)}%`,
                height: '100%',
                borderRadius: 'var(--radius-full)',
                background:
                  overallUtilization <= 30
                    ? '#10b981'
                    : overallUtilization <= 50
                    ? '#f59e0b'
                    : '#ef4444',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Cards List / Grid */}
      {accounts.length === 0 ? (
        <div
          className="premium-card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CreditCard size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>No Credit Cards Linked Yet</h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: '420px', margin: 0 }}>
            Link your credit cards to monitor total limits, outstanding balances, utilization percentage, and payment due dates.
          </p>
          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Link Your First Card</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px'
          }}
        >
          {accounts.map((card) => {
            const cardUtil =
              card.creditLimit > 0 ? Math.round((card.usedAmount / card.creditLimit) * 100) : 0;

            return (
              <div
                key={card.id}
                style={{
                  background: card.cardColor || 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '22px',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '230px',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                {/* Card Top Row: Bank Name, Chips, Actions */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                        {card.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500, marginTop: '2px' }}>
                        {card.institution}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenUpdate(card)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 'var(--radius-xs)',
                          padding: '5px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Update Used Balance"
                      >
                        <Edit3 size={12} />
                        <span>Update</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCard(card.id, card.name)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.25)',
                          color: '#fda4af',
                          border: 'none',
                          borderRadius: 'var(--radius-xs)',
                          padding: '5px 7px',
                          cursor: 'pointer'
                        }}
                        title="Unlink card"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Masked Card Number */}
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '1.12rem',
                      letterSpacing: '0.12em',
                      margin: '18px 0 14px',
                      color: 'rgba(255, 255, 255, 0.92)'
                    }}
                  >
                    {card.maskedNumber}
                  </div>
                </div>

                {/* Card Bottom: Limits, Used, and Progress */}
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0, 0, 0, 0.28)',
                      marginBottom: '10px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.64rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
                        Total Limit
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                        {formatCurrency(card.creditLimit, 'INR')}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.64rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
                        Used Amount
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fda4af', marginTop: '2px' }}>
                        {formatCurrency(card.usedAmount, 'INR')}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.64rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
                        Available
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#6ee7b7', marginTop: '2px' }}>
                        {formatCurrency(card.availableLimit, 'INR')}
                      </div>
                    </div>
                  </div>

                  {/* Utilization Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.75)', marginBottom: '4px' }}>
                      <span>{cardUtil}% Used</span>
                      <span>{card.dueDate ? `Due: ${card.dueDate}` : 'Active'}</span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '5px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(255, 255, 255, 0.2)',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, cardUtil)}%`,
                          height: '100%',
                          borderRadius: 'var(--radius-full)',
                          background: cardUtil <= 30 ? '#10b981' : cardUtil <= 50 ? '#fbbf24' : '#f43f5e'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal 1: Link Credit Card */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Link Credit Card" maxWidth="500px">
        <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Card Name *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. HDFC Regalia Gold, ICICI Amazon Pay"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Bank / Issuer
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. HDFC Bank, SBI Card, Axis Bank"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Credit Limit (₹) *
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 150000"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Amount Used (₹)
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 24000"
                value={usedAmount}
                onChange={(e) => setUsedAmount(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Last 4 Digits
              </label>
              <input
                type="text"
                maxLength={4}
                className="form-input"
                placeholder="e.g. 5732"
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Due Date
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 15th of every month"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Color Presets */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Card Theme / Color
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              {CARD_COLOR_PRESETS.map((preset) => {
                const isSelected = cardColor === preset.value;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setCardColor(preset.value)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-full)',
                      background: preset.value,
                      border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                      boxShadow: isSelected ? '0 0 0 2px #6366f1' : 'none',
                      cursor: 'pointer'
                    }}
                    title={preset.name}
                  />
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ flex: 2, justifyContent: 'center' }}
            >
              {submitting ? 'Linking...' : '+ Link Card'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Update Used Balance / Payment */}
      <Modal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        title={`Update ${selectedCard?.name || 'Card'} Balance`}
        maxWidth="440px"
      >
        <form onSubmit={handleSaveUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '-4px' }}>
            Update your current amount used or adjust your total credit limit.
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Current Amount Used (₹) *
            </label>
            <input
              type="number"
              className="form-input"
              value={updateUsedVal}
              onChange={(e) => setUpdateUsedVal(e.target.value)}
              required
              autoFocus
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
              Set to 0 if you paid off your bill completely.
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Credit Limit (₹)
            </label>
            <input
              type="number"
              className="form-input"
              value={updateLimitVal}
              onChange={(e) => setUpdateLimitVal(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setIsUpdateOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="btn btn-primary"
              style={{ flex: 2, justifyContent: 'center' }}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
