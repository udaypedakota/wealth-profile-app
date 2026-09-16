import React, { useState, useEffect, useMemo } from 'react';
import { ApiClient } from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import {
  Plus,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Coins,
  ChevronRight,
  TrendingDown,
  Info,
  RotateCcw
} from 'lucide-react';

export interface ChitPayment {
  id: string;
  monthNumber: number;
  monthName: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface ChitFund {
  id: string;
  name: string;
  title?: string;
  totalAmount?: number;
  totalPotValue?: number;
  durationMonths?: number;
  monthlyAmount?: number;
  monthlySubscription?: number;
  startDate?: string;
  currentMonth?: string;
  status: string;
  payments?: ChitPayment[];
}

export const ChitsView: React.FC = () => {
  const { success, error } = useToast();

  const [chits, setChits] = useState<ChitFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChitId, setSelectedChitId] = useState<string | null>(null);

  // Modal States
  const [isAddChitOpen, setIsAddChitOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  // New Chit Form State (matches screenshot 1)
  const [chitName, setChitName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [durationMonths, setDurationMonths] = useState('20');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [isMonthlyOverridden, setIsMonthlyOverridden] = useState(false);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isSubmittingChit, setIsSubmittingChit] = useState(false);

  // New Payment Form State (matches screenshot 2)
  const [payMonthName, setPayMonthName] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [payNotes, setPayNotes] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  const loadChits = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.getChits();
      const list = Array.isArray(res) ? res : [];
      setChits(list);

      // Default select the first chit if none selected or selected was removed
      if (list.length > 0) {
        setSelectedChitId((prev) => (prev && list.some((c) => c.id === prev) ? prev : list[0].id));
      } else {
        setSelectedChitId(null);
      }
    } catch {
      // fallback handled in apiClient
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChits();
    const handleUpdate = () => loadChits();
    window.addEventListener('moneymate_data_changed', handleUpdate);
    return () => window.removeEventListener('moneymate_data_changed', handleUpdate);
  }, []);

  // Auto-calculate Monthly Amount: Total ÷ Duration
  const handleTotalChange = (val: string) => {
    setTotalAmount(val);
    if (!isMonthlyOverridden) {
      const tot = parseFloat(val);
      const dur = parseFloat(durationMonths);
      if (!isNaN(tot) && !isNaN(dur) && dur > 0) {
        setMonthlyAmount(Math.round(tot / dur).toString());
      } else {
        setMonthlyAmount('');
      }
    }
  };

  const handleDurationChange = (val: string) => {
    setDurationMonths(val);
    if (!isMonthlyOverridden) {
      const tot = parseFloat(totalAmount);
      const dur = parseFloat(val);
      if (!isNaN(tot) && !isNaN(dur) && dur > 0) {
        setMonthlyAmount(Math.round(tot / dur).toString());
      } else {
        setMonthlyAmount('');
      }
    }
  };

  const handleMonthlyChange = (val: string) => {
    setMonthlyAmount(val);
    setIsMonthlyOverridden(true);
  };

  const handleOpenAddChit = () => {
    setChitName('');
    setTotalAmount('');
    setDurationMonths('20');
    setMonthlyAmount('');
    setIsMonthlyOverridden(false);
    setStartDate(new Date().toISOString().split('T')[0]);
    setIsAddChitOpen(true);
  };

  const handleSaveChit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totNum = parseFloat(totalAmount);
    const durNum = parseInt(durationMonths, 10);
    const mNum = parseFloat(monthlyAmount);

    if (!chitName.trim()) {
      error('Chit Name Required', 'Please enter a chit name (e.g. 3L Chit).');
      return;
    }
    if (isNaN(totNum) || totNum <= 0) {
      error('Invalid Total Amount', 'Please enter a valid total chit amount.');
      return;
    }
    if (isNaN(durNum) || durNum <= 0) {
      error('Invalid Duration', 'Please enter a valid duration in months.');
      return;
    }

    try {
      setIsSubmittingChit(true);
      const newChit = await ApiClient.addChit({
        name: chitName.trim(),
        title: chitName.trim(),
        totalAmount: totNum,
        totalPotValue: totNum,
        durationMonths: durNum,
        monthlyAmount: !isNaN(mNum) && mNum > 0 ? mNum : Math.round(totNum / durNum),
        monthlySubscription: !isNaN(mNum) && mNum > 0 ? mNum : Math.round(totNum / durNum),
        startDate: startDate || new Date().toISOString().split('T')[0],
        status: 'Active',
        payments: []
      });

      success('Chit Fund Created', `Created "${chitName}" (${formatCurrency(totNum, 'INR')}).`);
      setIsAddChitOpen(false);
      await loadChits();
      if (newChit?.id) setSelectedChitId(newChit.id);
    } catch (err: any) {
      error('Save Failed', err?.message || 'Could not save chit fund.');
    } finally {
      setIsSubmittingChit(false);
    }
  };

  const handleDeleteChit = async (id: string, name: string) => {
    if (!window.confirm(`Delete chit fund "${name}" and all its recorded payments?`)) return;
    try {
      await ApiClient.deleteChit(id);
      success('Chit Fund Deleted', `Removed "${name}".`);
      loadChits();
    } catch (err: any) {
      error('Delete Failed', err?.message || 'Could not delete chit.');
    }
  };

  const handleClearPayments = async (id: string, name: string) => {
    if (!window.confirm(`Clear all recorded payments for "${name}" so you can re-enter month by month from your book?`)) return;
    try {
      await ApiClient.updateChit(id, { payments: [] });
      success('Payments Cleared', `Cleared all payments for "${name}". Ready for fresh entries from your book.`);
      loadChits();
    } catch (err: any) {
      error('Clear Failed', err?.message || 'Could not clear payments.');
    }
  };

  // Selected Chit Data & Calculations
  const selectedChit = useMemo(() => {
    return chits.find((c) => c.id === selectedChitId) || chits[0] || null;
  }, [chits, selectedChitId]);

  const paymentsList = useMemo(() => {
    if (!selectedChit?.payments) return [];
    return [...selectedChit.payments];
  }, [selectedChit]);

  const totalPaid = useMemo(() => {
    return paymentsList.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  }, [paymentsList]);

  const totalPool = selectedChit ? Number(selectedChit.totalAmount || selectedChit.totalPotValue || 0) : 0;
  const duration = selectedChit ? Number(selectedChit.durationMonths || 20) : 20;
  const expectedMonthly = selectedChit ? Number(selectedChit.monthlyAmount || selectedChit.monthlySubscription || Math.round(totalPool / duration)) : 0;
  const remainingAmount = Math.max(0, totalPool - totalPaid);
  const paidMonthsCount = paymentsList.length;
  const pendingMonths = Math.max(0, duration - paidMonthsCount);

  // Open Add Payment Modal
  const handleOpenAddPayment = () => {
    if (!selectedChit) return;

    // Suggest next month name
    const monthIndex = paymentsList.length + 1;
    const dateObj = new Date();
    dateObj.setMonth(dateObj.getMonth() - (paymentsList.length > 0 ? 0 : 0));
    const suggestedMonth = `${dateObj.toLocaleString('en-IN', { month: 'long' })} ${dateObj.getFullYear()}`;

    setPayMonthName(suggestedMonth);
    setPayAmount(expectedMonthly ? expectedMonthly.toString() : '');
    setPayDate(new Date().toISOString().split('T')[0]);
    setPayNotes('');
    setIsAddPaymentOpen(true);
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChit) return;

    const amtNum = parseFloat(payAmount);
    if (!payMonthName.trim()) {
      error('Month Required', 'Please enter month name (e.g. November 2026).');
      return;
    }
    if (isNaN(amtNum) || amtNum <= 0) {
      error('Invalid Amount', 'Please enter the installment amount paid.');
      return;
    }

    try {
      setIsSubmittingPay(true);
      await ApiClient.addChitPayment(selectedChit.id, {
        monthNumber: paymentsList.length + 1,
        monthName: payMonthName.trim(),
        amount: amtNum,
        date: payDate || new Date().toISOString().split('T')[0],
        notes: payNotes.trim()
      });

      success('Payment Recorded', `Recorded ₹${amtNum.toLocaleString('en-IN')} for ${payMonthName}.`);
      setIsAddPaymentOpen(false);
      loadChits();
    } catch (err: any) {
      error('Payment Failed', err?.message || 'Could not save payment.');
    } finally {
      setIsSubmittingPay(false);
    }
  };

  const handleDeletePayment = async (paymentId: string, monthName: string) => {
    if (!selectedChit) return;
    if (!window.confirm(`Delete payment record for ${monthName}?`)) return;

    try {
      await ApiClient.deleteChitPayment(selectedChit.id, paymentId);
      success('Payment Removed', `Deleted installment for ${monthName}.`);
      loadChits();
    } catch (err: any) {
      error('Delete Failed', err?.message || 'Could not delete payment.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* View Header with Chit Selector and Action Buttons */}
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title">
            <span className="nav-emoji">🔄</span>
            <span>Chit Funds & Monthly Payments</span>
          </h2>
          <p className="section-top-subtitle">
            {chits.length} Chit Fund{chits.length === 1 ? '' : 's'} Active • Track auction dividends & monthly installments
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleOpenAddChit}
          >
            <Plus size={16} />
            <span>Create New Chit</span>
          </button>

          {selectedChit && (
            <button
              type="button"
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
              }}
              onClick={handleOpenAddPayment}
            >
              <Plus size={16} />
              <span>Add Payment</span>
            </button>
          )}
        </div>
      </div>

      {/* Chit Selector Tabs (if multiple chits exist) */}
      {chits.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '6px',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {chits.map((c) => {
            const isSel = c.id === selectedChitId;
            const cName = c.name || c.title || 'Chit Fund';
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedChitId(c.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isSel ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                  background: isSel ? 'rgba(99, 102, 241, 0.16)' : 'var(--bg-card)',
                  color: isSel ? '#818cf8' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{cName}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: isSel ? '#6366f1' : 'var(--bg-surface)',
                    color: isSel ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  {c.payments?.length || 0}/{c.durationMonths || 20}m
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State when no chits exist */}
      {!loading && chits.length === 0 && (
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
            <Layers size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>No Chit Funds Added Yet</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '440px', margin: 0 }}>
            Start tracking your community chit funds, monthly installments, auction dividend reductions, and remaining pool balances.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            style={{
              marginTop: '8px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff',
              border: 'none',
              padding: '10px 22px'
            }}
            onClick={handleOpenAddChit}
          >
            <Plus size={16} />
            <span>Add Your First Chit (e.g. 3L Chit)</span>
          </button>
        </div>
      )}

      {/* Active Chit Detail View (Matching Screenshot 2) */}
      {selectedChit && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Chit Overview Card with 3 Metrics */}
          <div
            className="premium-card"
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-card)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
              position: 'relative'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                marginBottom: '16px'
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    margin: 0
                  }}
                >
                  {selectedChit.name || selectedChit.title || '3L Chit'}
                </h3>
                <div
                  style={{
                    fontSize: '0.84rem',
                    color: 'var(--text-muted)',
                    marginTop: '4px',
                    fontWeight: 500
                  }}
                >
                  {paidMonthsCount}/{duration} months • {formatCurrency(expectedMonthly, 'INR')}/mo
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {paymentsList.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                    onClick={() => handleClearPayments(selectedChit.id, selectedChit.name || selectedChit.title || 'Chit')}
                    title="Clear all recorded payments in this chit fund"
                  >
                    <RotateCcw size={13} />
                    <span>Clear Payments</span>
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  onClick={() => handleDeleteChit(selectedChit.id, selectedChit.name || selectedChit.title || 'Chit')}
                  title="Delete this chit fund"
                >
                  <Trash2 size={13} />
                  <span>Delete Chit</span>
                </button>
              </div>
            </div>

            {/* 3 Metrics Row: PAID, REMAINING, PENDING (Exactly matches Screenshot 2) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              {/* PAID */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    marginBottom: '4px'
                  }}
                >
                  Paid
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#10b981'
                  }}
                >
                  {formatCurrency(totalPaid, 'INR')}
                </div>
              </div>

              {/* REMAINING */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(244, 63, 94, 0.08)',
                  border: '1px solid rgba(244, 63, 94, 0.2)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    marginBottom: '4px'
                  }}
                >
                  Remaining
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#f43f5e'
                  }}
                >
                  {formatCurrency(remainingAmount, 'INR')}
                </div>
              </div>

              {/* PENDING */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    marginBottom: '4px'
                  }}
                >
                  Pending
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: pendingMonths === 0 ? '#10b981' : '#ef4444'
                  }}
                >
                  {pendingMonths} MO
                </div>
              </div>
            </div>
          </div>

          {/* Payments Section Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '6px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Payments</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Track monthly chit payments • {paymentsList.length} installments recorded
              </p>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-primary"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                border: 'none',
                padding: '6px 14px'
              }}
              onClick={handleOpenAddPayment}
            >
              <Plus size={14} />
              <span>Add Payment</span>
            </button>
          </div>

          {/* Payments Ledger Table (Matches Screenshot 2 with Purple Header) */}
          <div
            className="premium-table-container"
            style={{
              overflowX: 'auto',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <table
              className="premium-table"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '500px'
              }}
            >
              <thead>
                <tr
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff'
                  }}
                >
                  <th style={{ color: '#ffffff', width: '48px', padding: '12px 14px', fontSize: '0.74rem' }}>#</th>
                  <th style={{ color: '#ffffff', padding: '12px 14px', fontSize: '0.74rem' }}>MONTH</th>
                  <th style={{ color: '#ffffff', padding: '12px 14px', fontSize: '0.74rem' }}>AMOUNT PAID</th>
                  <th style={{ color: '#ffffff', padding: '12px 14px', fontSize: '0.74rem' }}>DATE</th>
                  <th style={{ color: '#ffffff', width: '56px', padding: '12px 14px', textAlign: 'center', fontSize: '0.74rem' }}>
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentsList.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Coins size={28} color="#6366f1" style={{ opacity: 0.7 }} />
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No Payments Recorded Yet</div>
                      <div style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                        Click "+ Add Payment" above to record your first monthly chit installment.
                      </div>
                    </td>
                  </tr>
                ) : (
                  paymentsList.map((pay, idx) => (
                    <tr key={pay.id || idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {pay.monthNumber || idx + 1}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        <div>{pay.monthName}</div>
                        {pay.notes && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '2px' }}>
                            {pay.notes}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: '12px 14px',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          fontSize: '0.98rem',
                          color: '#10b981'
                        }}
                      >
                        {formatCurrency(pay.amount, 'INR')}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {formatDate(pay.date)}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDeletePayment(pay.id, pay.monthName)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-xs)',
                            background: 'rgba(239, 68, 68, 0.12)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          title={`Delete payment for ${pay.monthName}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL 1: ADD NEW CHIT (Matches Screenshot 1 Exactly)
          ========================================================================== */}
      <Modal
        isOpen={isAddChitOpen}
        onClose={() => setIsAddChitOpen(false)}
        title="Add New Chit"
        maxWidth="480px"
      >
        <form onSubmit={handleSaveChit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '-8px' }}>
            Create a new chit fund entry
          </div>

          {/* CHIT NAME */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              className="form-label"
              style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Chit Name
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 3L Chit"
              value={chitName}
              onChange={(e) => setChitName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* TOTAL AMOUNT */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              className="form-label"
              style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Total Amount (₹)
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="300000"
              value={totalAmount}
              onChange={(e) => handleTotalChange(e.target.value)}
              required
            />
          </div>

          {/* DURATION (MONTHS) */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              className="form-label"
              style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Duration (Months)
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="20"
              value={durationMonths}
              onChange={(e) => handleDurationChange(e.target.value)}
              required
            />
          </div>

          {/* MONTHLY AMOUNT (₹) */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              className="form-label"
              style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Monthly Amount (₹)
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="15000"
              value={monthlyAmount}
              onChange={(e) => handleMonthlyChange(e.target.value)}
              required
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                marginTop: '4px'
              }}
            >
              <span>💡</span>
              <span>Auto-calculated from Total ÷ Duration. You can override.</span>
            </div>
          </div>

          {/* START DATE */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              className="form-label"
              style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Start Date
            </label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={isSubmittingChit}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.95rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                justifyContent: 'center'
              }}
            >
              <Plus size={16} />
              <span>{isSubmittingChit ? 'Creating Chit Fund...' : '+ Add Chit'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddChitOpen(false)}
              className="btn btn-secondary"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                justifyContent: 'center'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* ==========================================================================
          MODAL 2: ADD MONTHLY PAYMENT (Matches Screenshot 2)
          ========================================================================== */}
      <Modal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        title="Add Monthly Chit Payment"
        maxWidth="460px"
      >
        <form onSubmit={handleSavePayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '-6px' }}>
            Record an installment for <strong>{selectedChit?.name || selectedChit?.title}</strong>
          </div>

          {/* Month Name */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Month Name *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. November 2026"
              value={payMonthName}
              onChange={(e) => setPayMonthName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Amount Paid (Can reflect auction dividend discounts) */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Amount Paid (₹) *
            </label>
            <input
              type="number"
              step="any"
              className="form-input"
              placeholder="e.g. 15000 or 14935"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              required
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
              Standard installment is {formatCurrency(expectedMonthly, 'INR')}. Enter exact amount paid after auction dividend.
            </div>
          </div>

          {/* Payment Date */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Payment Date *
            </label>
            <input
              type="date"
              className="form-input"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              required
            />
          </div>

          {/* Optional Notes / Auction Dividend */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Notes / Dividend (Optional)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dividend saved ₹65"
              value={payNotes}
              onChange={(e) => setPayNotes(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => setIsAddPaymentOpen(false)}
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmittingPay}
              className="btn btn-primary"
              style={{
                flex: 2,
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 700
              }}
            >
              <Plus size={16} />
              <span>{isSubmittingPay ? 'Recording...' : 'Record Payment'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
