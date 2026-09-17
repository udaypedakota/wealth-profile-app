import React, { useState, useEffect } from 'react';
import { ApiClient } from '../../services/apiClient';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { QuickAddModal } from '../common/QuickAddModal';
import { Modal } from '../common/Modal';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  Trash2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  CreditCard,
  Building2,
  Sparkles,
  ShieldCheck,
  Receipt,
  HandCoins,
  Landmark,
  Edit2,
  Info
} from 'lucide-react';
import { FinancialChartsSection } from '../dashboard/FinancialChartsSection';

interface DashboardViewProps {
  onNavigatePage: (page: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigatePage }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'debit' | 'credit'>('debit');

  // Update Balances Modal State
  const [isUpdateBalancesOpen, setIsUpdateBalancesOpen] = useState(false);
  const [cashBalanceInput, setCashBalanceInput] = useState('');
  const [bankBalanceInput, setBankBalanceInput] = useState('');
  const [isSavingBalances, setIsSavingBalances] = useState(false);

  const { success, error } = useToast();

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.getDashboard();
      setData(res);
    } catch (err: any) {
      console.warn('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    window.addEventListener('moneymate_data_changed', loadDashboard);
    window.addEventListener('moneymate_auth_changed', loadDashboard);
    return () => {
      window.removeEventListener('moneymate_data_changed', loadDashboard);
      window.removeEventListener('moneymate_auth_changed', loadDashboard);
    };
  }, []);

  const openQuickAdd = (type: 'debit' | 'credit') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  const handleDeleteTransaction = async (id: string, title: string) => {
    if (window.confirm(`Delete transaction "${title}"?`)) {
      try {
        await ApiClient.deleteTransaction(id);
        success('Deleted', 'Transaction removed.');
        loadDashboard();
      } catch {
        error('Error', 'Could not delete transaction.');
      }
    }
  };

  const handlePayBill = async (id: string, title: string) => {
    try {
      await ApiClient.payBill(id);
      success('Bill Settled', `Marked ${title} as settled.`);
      loadDashboard();
    } catch {
      error('Error', 'Could not settle bill.');
    }
  };

  const handleOpenUpdateBalances = () => {
    const accList = data?.accounts || [];
    const cashAcc = accList.find((a: any) => a.type === 'cash');
    const bankAcc = accList.find((a: any) => a.type === 'bank');
    setCashBalanceInput(cashAcc?.balance !== undefined ? String(cashAcc.balance) : '0');
    setBankBalanceInput(bankAcc?.balance !== undefined ? String(bankAcc.balance) : '0');
    setIsUpdateBalancesOpen(true);
  };

  const handleSaveBalances = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingBalances(true);
      const accList = data?.accounts || [];
      const cashAcc = accList.find((a: any) => a.type === 'cash') || { id: 'acc_cash_01' };
      const bankAcc = accList.find((a: any) => a.type === 'bank') || { id: 'acc_bank_02' };

      const cVal = parseFloat(cashBalanceInput) || 0;
      const bVal = parseFloat(bankBalanceInput) || 0;

      await ApiClient.updateAccount(cashAcc.id, { balance: cVal });
      await ApiClient.updateAccount(bankAcc.id, { balance: bVal });

      success('Balances Updated', `Cash in Hand: ₹${cVal.toLocaleString('en-IN')} | Bank: ₹${bVal.toLocaleString('en-IN')}`);
      setIsUpdateBalancesOpen(false);
      await loadDashboard();
    } catch (err: any) {
      error('Update Failed', err?.message || 'Could not update balances.');
    } finally {
      setIsSavingBalances(false);
    }
  };

  if (loading && !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-lg)' }} />
        <div className="skeleton" style={{ height: '320px', borderRadius: 'var(--radius-md)' }} />
      </div>
    );
  }

  const balances = data?.balances || {
    totalNetWorth: 0,
    totalCashAndBank: 0,
    totalCreditCardDue: 0,
    todayExpense: 0,
    thisMonthIncome: 0,
    thisMonthExpense: 0,
    monthlyBudget: 35000,
    currencySymbol: '₹'
  };

  const counts = data?.counts || {
    transactionsCount: 0,
    activeBillsCount: 0,
    activeEmisCount: 0,
    activeChitsCount: 0,
    moneyLentPending: 0
  };

  const sectionBreakdowns = data?.sectionBreakdowns || {
    creditCards: { totalLimit: 0, totalUsed: 0, available: 0, utilization: 0, count: 0 },
    bills: { pendingAmount: 0, settledAmount: 0, totalAmount: 0, pendingCount: 0, totalCount: 0 },
    emis: { monthlyTotal: 0, totalLoanAmount: 0, count: 0 },
    chits: { monthlyTotal: 0, totalPool: 0, totalPaid: 0, remainingPool: 0, count: 0 },
    lending: { lentPending: 0, borrowedPending: 0, pendingCount: 0 },
    salary: { monthlyExpected: 0, actualReceivedThisMonth: 0 },
    commitments: { totalMonthlyCommitments: 0, remainingDisposable: 0 }
  };

  const accounts = data?.accounts || [];
  const recentTransactions = data?.recentTransactions || [];
  const upcomingBills = data?.upcomingBills || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sleek Glassmorphic Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div style={{ zIndex: 1, minWidth: 0, flex: '1 1 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={11} />
              <span>Private Wealth • MongoDB Atlas Cloud Active</span>
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.28rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Welcome back, {data?.user?.firstName || 'Uday'}!</span>
            <Sparkles size={16} color="#10b981" />
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Your real-time personal money ledger. Record daily updates in seconds with instant cloud persistence.
          </p>
        </div>

        {/* Quick Action Pill Buttons */}
        <div className="dashboard-quick-actions" style={{ zIndex: 1 }}>
          <button
            type="button"
            className="btn welcome-action-btn"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-full)',
              padding: '8px 18px',
              fontWeight: 700,
              fontSize: '0.82rem',
              boxShadow: '0 3px 12px rgba(239, 68, 68, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            onClick={() => openQuickAdd('debit')}
          >
            <TrendingDown size={15} />
            <span>Record Expense</span>
          </button>

          <button
            type="button"
            className="btn welcome-action-btn"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-full)',
              padding: '8px 18px',
              fontWeight: 700,
              fontSize: '0.82rem',
              boxShadow: '0 3px 12px rgba(16, 185, 129, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            onClick={() => openQuickAdd('credit')}
          >
            <TrendingUp size={15} />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* ==========================================================================
          INTERACTIVE VISUAL CHARTS SECTION (Requested by User - Inflow vs Outflow Chart, Categories & Chits)
          ========================================================================== */}
      <FinancialChartsSection
        balances={balances}
        categoryBreakdown={data?.categoryBreakdown}
        chitsList={data?.chitsList}
        creditCardData={sectionBreakdowns.creditCards}
        onNavigateTab={onNavigatePage}
      />

      {/* ==========================================================================
          FINANCIAL SECTIONS & COMMITMENTS BREAKDOWN (Requested by User)
          ========================================================================== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📊 Financial Sections & Usage Breakdown</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Real-time balance, limit & commitment tracker across all your active financial modules
            </p>
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--primary)',
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}
          >
            Monthly Salary: {formatCurrency(sectionBreakdowns.salary.monthlyExpected, 'INR')}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px'
          }}
        >
          {/* 1. Credit Cards & Lines */}
          <div
            className="premium-card glow-hover"
            style={{ padding: '14px 16px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            onClick={() => onNavigatePage('credit_cards')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Credit Cards ({sectionBreakdowns.creditCards.count || 1} Linked)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#f43f5e' }}>
                    {formatCurrency(sectionBreakdowns.creditCards.totalUsed, 'INR')}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    used of {formatCurrency(sectionBreakdowns.creditCards.totalLimit, 'INR')}
                  </span>
                </div>
              </div>
              <span
                className={`badge-status ${sectionBreakdowns.creditCards.utilization <= 30 ? 'success' : 'warning'}`}
                style={{ fontSize: '0.68rem', padding: '2px 6px' }}
              >
                {sectionBreakdowns.creditCards.utilization}% Used
              </span>
            </div>

            {/* Utilization Bar */}
            <div
              style={{
                width: '100%',
                height: '4px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--border-subtle)',
                margin: '10px 0 6px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, sectionBreakdowns.creditCards.utilization)}%`,
                  height: '100%',
                  background: sectionBreakdowns.creditCards.utilization <= 30 ? '#10b981' : '#f59e0b'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Available: <strong style={{ color: '#10b981' }}>{formatCurrency(sectionBreakdowns.creditCards.available, 'INR')}</strong></span>
              <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Manage Cards <ArrowRight size={11} />
              </span>
            </div>
          </div>

          {/* 2. Bills & Utilities */}
          <div
            className="premium-card glow-hover"
            style={{ padding: '14px 16px', cursor: 'pointer' }}
            onClick={() => onNavigatePage('bills')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Pending Bills ({sectionBreakdowns.bills.pendingCount} Due)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
                    {formatCurrency(sectionBreakdowns.bills.pendingAmount, 'INR')}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    due this cycle
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Receipt size={14} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '14px' }}>
              <span>Settled: {formatCurrency(sectionBreakdowns.bills.settledAmount, 'INR')}</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Pay Bills <ArrowRight size={11} />
              </span>
            </div>
          </div>

          {/* 3. Chit Funds */}
          <div
            className="premium-card glow-hover"
            style={{ padding: '14px 16px', cursor: 'pointer' }}
            onClick={() => onNavigatePage('chits')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Chit Funds ({sectionBreakdowns.chits.count} Active)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#6366f1' }}>
                    {formatCurrency(sectionBreakdowns.chits.monthlyTotal, 'INR')}/mo
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Pool: {formatCurrency(sectionBreakdowns.chits.totalPool, 'INR')}
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={14} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '14px' }}>
              <span>Paid To Date: <strong style={{ color: '#10b981' }}>{formatCurrency(sectionBreakdowns.chits.totalPaid, 'INR')}</strong></span>
              <span style={{ color: '#6366f1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Chit Tracker <ArrowRight size={11} />
              </span>
            </div>
          </div>

          {/* 4. Loans & EMIs */}
          <div
            className="premium-card glow-hover"
            style={{ padding: '14px 16px', cursor: 'pointer' }}
            onClick={() => onNavigatePage('emis')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Loans & EMIs ({sectionBreakdowns.emis.count} Active)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6' }}>
                    {formatCurrency(sectionBreakdowns.emis.monthlyTotal, 'INR')}/mo
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Principal: {formatCurrency(sectionBreakdowns.emis.totalLoanAmount, 'INR')}
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(59, 130, 246, 0.12)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Landmark size={14} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '14px' }}>
              <span>Monthly commitment</span>
              <span style={{ color: '#3b82f6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                View Loans <ArrowRight size={11} />
              </span>
            </div>
          </div>

          {/* 5. Money Lent & Borrowed */}
          <div
            className="premium-card glow-hover"
            style={{ padding: '14px 16px', cursor: 'pointer' }}
            onClick={() => onNavigatePage('money_lent')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Hand Loans & Lending
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                    {formatCurrency(sectionBreakdowns.lending.lentPending, 'INR')}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    to collect
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <HandCoins size={14} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '14px' }}>
              <span>Borrowed to repay: {formatCurrency(sectionBreakdowns.lending.borrowedPending, 'INR')}</span>
              <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Receivables <ArrowRight size={11} />
              </span>
            </div>
          </div>

          {/* 6. Income & Net Disposable */}
          <div
            className="premium-card glow-hover"
            style={{ padding: '14px 16px', cursor: 'pointer' }}
            onClick={() => onNavigatePage('income')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Monthly Salary Stream
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                    {formatCurrency(sectionBreakdowns.salary.monthlyExpected, 'INR')}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    salary inflow
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-xs)',
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

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '14px' }}>
              <span>Net Disposable: <strong style={{ color: '#10b981' }}>{formatCurrency(sectionBreakdowns.commitments.remainingDisposable, 'INR')}</strong></span>
              <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Income Ledger <ArrowRight size={11} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Row: Recent Daily Transactions & Upcoming Bills */}
      <div className="card-grid-2col">
        {/* Left: Recent Daily Transactions */}
        <div className="premium-card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 className="card-title">Recent Daily Transactions</h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigatePage('transactions')}
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div style={{ padding: '20px 14px', textAlign: 'center' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  color: 'var(--text-muted)'
                }}
              >
                <Receipt size={18} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                No Transactions Recorded Yet
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Start tracking your daily expenses or income right now.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={() => openQuickAdd('debit')}
              >
                <Plus size={13} />
                <span>Record Today's Expense</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {recentTransactions.map((tx: any) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: 'var(--radius-xs)',
                        background: tx.type === 'credit' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                        color: tx.type === 'credit' ? '#10b981' : '#f43f5e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {tx.type === 'credit' ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tx.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                        {tx.category || 'General'} • {formatDate(tx.date || new Date().toISOString())}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        color: tx.type === 'credit' ? '#10b981' : '#f43f5e',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, 'INR')}
                    </div>

                    <button
                      type="button"
                      style={{ color: '#ef4444', padding: '3px', cursor: 'pointer', background: 'transparent', border: 'none' }}
                      onClick={() => handleDeleteTransaction(tx.id, tx.title)}
                      title="Delete record"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Upcoming Bills & Due Reminders */}
        <div className="premium-card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 className="card-title">Upcoming Bills & Dues</h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigatePage('bills')}
            >
              <span>Manage Bills</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {upcomingBills.length === 0 ? (
            <div style={{ padding: '20px 14px', textAlign: 'center' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  color: '#10b981'
                }}
              >
                <CheckCircle2 size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                All Bills Are Cleared
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                You have no pending bills or upcoming utility dues.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={() => onNavigatePage('bills')}
              >
                <Plus size={13} />
                <span>Add Scheduled Bill</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {upcomingBills.map((bill: any) => (
                <div
                  key={bill.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                      {bill.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#f59e0b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} />
                      <span>Due by {formatDate(bill.dueDate)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {formatCurrency(bill.amount, 'INR')}
                    </span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      onClick={() => handlePayBill(bill.id, bill.title)}
                    >
                      <CheckCircle2 size={12} />
                      <span>Pay</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Live Accounts Snapshot */}
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Accounts Snapshot
              </div>
              <button
                type="button"
                style={{ fontSize: '0.72rem', color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}
                onClick={() => onNavigatePage('credit_cards')}
              >
                Manage Accounts →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {accounts.length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No accounts linked yet.</div>
              ) : (
                accounts.map((acc: any) => (
                  <div key={acc.id} style={{ padding: '8px 10px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {acc.type === 'credit_card' ? <CreditCard size={11} /> : acc.type === 'cash' ? <Wallet size={11} /> : <Building2 size={11} />}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.name}</span>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        color: acc.balance < 0 ? '#f43f5e' : 'var(--text-primary)',
                        marginTop: '3px'
                      }}
                    >
                      {formatCurrency(acc.balance, 'INR')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={loadDashboard}
        defaultType={quickAddType}
      />

      {/* Update Cash & Bank Balances Modal */}
      <Modal
        isOpen={isUpdateBalancesOpen}
        onClose={() => setIsUpdateBalancesOpen(false)}
        title="Update Cash & Bank Balances"
      >
        <form onSubmit={handleSaveBalances} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Set your real cash in hand and savings bank balances. This updates your live MongoDB Atlas cloud database.
          </p>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wallet size={14} color="#10b981" />
              <span>Cash in Hand (Wallet) ₹</span>
            </label>
            <input
              type="number"
              step="any"
              className="form-input"
              placeholder="e.g. 5000"
              value={cashBalanceInput}
              onChange={(e) => setCashBalanceInput(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={14} color="#0284c7" />
              <span>Primary Bank Account Balance ₹</span>
            </label>
            <input
              type="number"
              step="any"
              className="form-input"
              placeholder="e.g. 25000"
              value={bankBalanceInput}
              onChange={(e) => setBankBalanceInput(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsUpdateBalancesOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSavingBalances}
            >
              {isSavingBalances ? 'Saving to Database...' : 'Save Balances'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
