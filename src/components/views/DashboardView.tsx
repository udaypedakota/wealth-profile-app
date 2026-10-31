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
  ArrowDownLeft,
  ArrowUpRight,
  Target,
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

// ============================================================================
// GROWTH ARTWORK: Ceramic Potted Plant with Leaves (Aaku) + Rising 3D Bars + Arrow
// Matches Desktop Welcome Banner (Image 1) & Mobile Header (Image 3)
// ============================================================================
const DashboardGrowthArt: React.FC<{ variant?: 'desktop' | 'mobile' }> = ({ variant = 'desktop' }) => {
  if (variant === 'mobile') {
    return (
      <div
        className="mobile-growth-art-container"
        style={{
          position: 'relative',
          width: '74px',
          height: '62px',
          flexShrink: 0,
          pointerEvents: 'none'
        }}
      >
        <svg viewBox="0 0 80 66" fill="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="mobLeafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="mobLeafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="mobBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <radialGradient id="mobAuraGlow" cx="60%" cy="40%" r="50%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.35)" />
              <stop offset="100%" stopColor="rgba(37, 99, 235, 0.0)" />
            </radialGradient>
          </defs>

          {/* Ambient soft glow & wave curve */}
          <ellipse cx="48" cy="32" rx="28" ry="24" fill="url(#mobAuraGlow)" />
          <path d="M12 50 C 26 34, 46 44, 70 24" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.45" strokeDasharray="3 3" fill="none" />

          {/* Mini 3D Growth Bars */}
          <rect x="42" y="34" width="7" height="18" rx="3.5" fill="url(#mobBarGrad)" opacity="0.85" />
          <rect x="52" y="24" width="7" height="28" rx="3.5" fill="url(#mobBarGrad)" opacity="0.9" />
          <rect x="62" y="14" width="7" height="38" rx="3.5" fill="url(#mobBarGrad)" />

          {/* Mini upward growth arrow */}
          <path d="M40 32 Q 54 20 66 10" stroke="#00e599" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M60 9 L 68 10 L 66 18" stroke="#00e599" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Potted Ceramic Plant with Green Leaves (Aaku) */}
          <ellipse cx="23" cy="56" rx="8" ry="2.2" fill="rgba(15, 23, 42, 0.16)" />
          <path d="M14 38 L32 38 L29 55 L17 55 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
          <rect x="12" y="36" width="22" height="3" rx="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

          {/* Green Leaves (Aaku) */}
          <path d="M23 36 C 22 24, 20 12, 23 4 C 26 12, 25 24, 23 36 Z" fill="url(#mobLeafGrad1)" />
          <path d="M23 34 C 17 24, 8 18, 3 17 C 5 24, 11 31, 20 35 Z" fill="url(#mobLeafGrad2)" />
          <path d="M23 34 C 29 24, 38 18, 43 17 C 41 24, 35 31, 26 35 Z" fill="url(#mobLeafGrad2)" />
        </svg>
      </div>
    );
  }

  // Desktop Banner Illustration (Exact match to Image 1)
  return (
    <div
      className="dashboard-banner-growth-art"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: '76px',
        width: '185px',
        margin: '0 18px',
        flexShrink: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <svg viewBox="0 0 210 90" fill="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="deskLeaf1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="deskLeaf2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="deskBar1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="deskBar2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="arrowGlow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>

        {/* Ambient Flowing Background Wave Lines across banner */}
        <path d="M-30 65 C 15 42, 60 74, 115 46 C 155 26, 195 45, 240 22" stroke="rgba(37, 99, 235, 0.22)" strokeWidth="1.6" fill="none" />
        <path d="M-10 75 C 35 52, 80 82, 135 55 C 175 36, 215 52, 255 30" stroke="rgba(56, 189, 248, 0.28)" strokeWidth="1.2" strokeDasharray="4 3" fill="none" />

        {/* Ceramic Potted Plant with Leaves (Aaku) on Left */}
        {/* Pot Drop Shadow */}
        <ellipse cx="44" cy="78" rx="14" ry="3.5" fill="rgba(15, 23, 42, 0.12)" />
        {/* White Ceramic Pot */}
        <path d="M30 54 L58 54 L54 76 L34 76 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.06))" />
        {/* Pot Rim */}
        <rect x="27" y="51" width="34" height="4.5" rx="2.2" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.2" />

        {/* Lush Green Sprouting Leaves (Aaku) */}
        {/* Center Tall Leaf */}
        <path d="M44 51 C 43 32, 40 18, 44 6 C 48 18, 46 32, 44 51 Z" fill="url(#deskLeaf1)" filter="drop-shadow(0 2px 4px rgba(5, 150, 105, 0.2))" />
        <path d="M44 6 C 42 22, 42 38, 44 51 Z" stroke="#047857" strokeWidth="0.8" opacity="0.5" fill="none" />

        {/* Left Arching Leaf */}
        <path d="M43 47 C 32 34, 18 26, 8 25 C 12 34, 23 44, 38 49 Z" fill="url(#deskLeaf2)" />
        <path d="M8 25 C 20 33, 32 40, 42 47" stroke="#047857" strokeWidth="0.6" opacity="0.4" fill="none" />

        {/* Right Arching Leaf */}
        <path d="M45 47 C 56 34, 70 26, 80 25 C 76 34, 65 44, 50 49 Z" fill="url(#deskLeaf2)" />
        <path d="M80 25 C 68 33, 56 40, 46 47" stroke="#047857" strokeWidth="0.6" opacity="0.4" fill="none" />

        {/* Mid-Left Leaf */}
        <path d="M42 49 C 28 42, 16 46, 12 52 C 20 56, 31 54, 40 50 Z" fill="url(#deskLeaf1)" opacity="0.9" />

        {/* Mid-Right Leaf */}
        <path d="M46 49 C 60 42, 72 46, 76 52 C 68 56, 57 54, 48 50 Z" fill="url(#deskLeaf1)" opacity="0.9" />

        {/* 4 Rising 3D Financial Growth Bars (Blue Gradient) */}
        {/* Bar 1 */}
        <rect x="94" y="52" width="14" height="24" rx="4" fill="url(#deskBar1)" filter="drop-shadow(0 2px 4px rgba(37, 99, 235, 0.25))" />
        <rect x="96" y="54" width="10" height="4" rx="2" fill="rgba(255,255,255,0.4)" />

        {/* Bar 2 */}
        <rect x="114" y="40" width="14" height="36" rx="4" fill="url(#deskBar2)" filter="drop-shadow(0 2px 4px rgba(37, 99, 235, 0.28))" />
        <rect x="116" y="42" width="10" height="4" rx="2" fill="rgba(255,255,255,0.4)" />

        {/* Bar 3 */}
        <rect x="134" y="28" width="14" height="48" rx="4" fill="url(#deskBar1)" filter="drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))" />
        <rect x="136" y="30" width="10" height="4" rx="2" fill="rgba(255,255,255,0.4)" />

        {/* Bar 4 */}
        <rect x="154" y="14" width="14" height="62" rx="4" fill="url(#deskBar2)" filter="drop-shadow(0 3px 6px rgba(37, 99, 235, 0.35))" />
        <rect x="156" y="16" width="10" height="4" rx="2" fill="rgba(255,255,255,0.5)" />

        {/* Upward Growth Arrow (Cyan to Green Gradient) Swooping Up Over Bars */}
        <path
          d="M84 58 Q 124 38 166 12"
          stroke="url(#arrowGlow)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="drop-shadow(0 2px 6px rgba(16, 185, 129, 0.45))"
          fill="none"
        />
        {/* Arrow Tip */}
        <path
          d="M154 9 L 169 11 L 165 24"
          stroke="url(#arrowGlow)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

interface DashboardViewProps {
  onNavigatePage: (page: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigatePage }) => {
  const [data, setData] = useState<any>(() => ApiClient.getCachedDashboard());
  const [loading, setLoading] = useState(() => !ApiClient.getCachedDashboard());
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
    monthlyIncome: 0,
    monthlyBudget: 0,
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
      {/* Mobile-only clean greeting header with Leaf (Aaku) & Growth Art (Matches Reference Image 3 Screen 1) */}
      <div className="dashboard-mobile-greeting">
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <h1 className="mobile-greeting-heading">
            Good Morning, {data?.user?.firstName || data?.user?.fullName?.split(' ')[0] || 'Member'}! 👋
          </h1>
          <p className="mobile-greeting-subheading">Your financial journey at a glance</p>
        </div>
        <DashboardGrowthArt variant="mobile" />
      </div>

      {/* Sleek Glassmorphic Welcome Banner (Desktop only) */}
      <div className="dashboard-welcome-banner desktop-only-banner">
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
            <span>Welcome back, {data?.user?.firstName || 'Member'}!</span>
            <Sparkles size={16} color="#10b981" />
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Your real-time personal money ledger. Record daily updates in seconds with instant cloud persistence.
          </p>
        </div>

        {/* Growth Art: Potted Plant with Leaves (Aaku) + Rising 3D Bars + Arrow (Image 1) */}
        <DashboardGrowthArt variant="desktop" />

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
          4 STAT METRIC CARDS (Desktop: 4 columns in a row, Mobile: 2x2 grid)
          100% Dynamic data from live user balances - Zero fallback for new users
          ========================================================================== */}
      {(() => {
        const displayIncome = Number(balances.thisMonthIncome || balances.monthlyIncome || 0);
        const displayExpense = Number(balances.thisMonthExpense || 0);
        const displaySavings = Math.max(0, displayIncome - displayExpense);
        const budgetLimit = Number(balances.monthlyBudget || 0);
        const budgetUsedPercent = budgetLimit > 0 ? Math.min(100, Math.round((displayExpense / budgetLimit) * 100)) : 0;

        return (
          <div className="stat-metric-grid">
            {/* Card 1: Monthly Inflow */}
            <div className="stat-metric-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.14)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
                    }}
                  >
                    <ArrowDownLeft size={19} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      <span className="desktop-stat-label">Monthly Inflow</span>
                      <span className="mobile-stat-label">Income</span>
                    </span>
                  </div>
                </div>
                {displayIncome > 0 ? (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#10b981',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    ↗ Active
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--text-dim)',
                      background: 'var(--bg-surface)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    ₹0
                  </span>
                )}
              </div>

              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {formatCurrency(displayIncome, 'INR')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {displayIncome > 0 ? 'vs last month' : 'No income recorded'}
                  </div>
                </div>

                {/* Sparkline Indicator */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '26px' }}>
                  {displayIncome > 0
                    ? [35, 45, 60, 50, 75, 90, 100].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            width: '4px',
                            height: `${h}%`,
                            background: i === 6 ? '#10b981' : 'rgba(16, 185, 129, 0.35)',
                            borderRadius: '2px'
                          }}
                        />
                      ))
                    : [15, 15, 15, 15, 15, 15, 15].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            width: '4px',
                            height: `${h}%`,
                            background: 'var(--border-subtle)',
                            borderRadius: '2px'
                          }}
                        />
                      ))}
                </div>
              </div>
            </div>

            {/* Card 2: Monthly Outflow */}
            <div className="stat-metric-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.14)',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)'
                    }}
                  >
                    <ArrowUpRight size={19} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      <span className="desktop-stat-label">Monthly Outflow</span>
                      <span className="mobile-stat-label">Expenses</span>
                    </span>
                  </div>
                </div>
                {displayExpense > 0 ? (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#ef4444',
                      background: 'rgba(239, 68, 68, 0.1)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    ↗ Active
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--text-dim)',
                      background: 'var(--bg-surface)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    ₹0
                  </span>
                )}
              </div>

              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {formatCurrency(displayExpense, 'INR')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {displayExpense > 0 ? 'vs last month' : 'No expenses recorded'}
                  </div>
                </div>

                {/* Sparkline Indicator */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '26px' }}>
                  {displayExpense > 0
                    ? [40, 55, 35, 70, 65, 80, 75].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            width: '4px',
                            height: `${h}%`,
                            background: i === 6 ? '#ef4444' : 'rgba(239, 68, 68, 0.35)',
                            borderRadius: '2px'
                          }}
                        />
                      ))
                    : [15, 15, 15, 15, 15, 15, 15].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            width: '4px',
                            height: `${h}%`,
                            background: 'var(--border-subtle)',
                            borderRadius: '2px'
                          }}
                        />
                      ))}
                </div>
              </div>
            </div>

            {/* Card 3: Net Savings */}
            <div className="stat-metric-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(37, 99, 235, 0.14)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)'
                    }}
                  >
                    <Wallet size={19} strokeWidth={2.3} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      <span className="desktop-stat-label">Net Savings</span>
                      <span className="mobile-stat-label">Savings</span>
                    </span>
                  </div>
                </div>
                {displaySavings > 0 ? (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#2563eb',
                      background: 'rgba(37, 99, 235, 0.1)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    ↗ Saved
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--text-dim)',
                      background: 'var(--bg-surface)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    ₹0
                  </span>
                )}
              </div>

              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {formatCurrency(displaySavings, 'INR')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {displaySavings > 0 ? 'vs last month' : 'No savings yet'}
                  </div>
                </div>

                {/* Sparkline Indicator */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '26px' }}>
                  {displaySavings > 0
                    ? [30, 45, 50, 65, 70, 85, 95].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            width: '4px',
                            height: `${h}%`,
                            background: i === 6 ? '#2563eb' : 'rgba(37, 99, 235, 0.35)',
                            borderRadius: '2px'
                          }}
                        />
                      ))
                    : [15, 15, 15, 15, 15, 15, 15].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            width: '4px',
                            height: `${h}%`,
                            background: 'var(--border-subtle)',
                            borderRadius: '2px'
                          }}
                        />
                      ))}
                </div>
              </div>
            </div>

            {/* Card 4: Budget Utilization */}
            <div className="stat-metric-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(139, 92, 246, 0.14)',
                      color: '#8b5cf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)'
                    }}
                  >
                    <Target size={19} strokeWidth={2.4} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      <span className="desktop-stat-label">Budget Utilization</span>
                      <span className="mobile-stat-label">Budget</span>
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {budgetLimit > 0 ? `${budgetUsedPercent}%` : '0%'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: budgetLimit > 0 ? (budgetUsedPercent <= 100 ? '#10b981' : '#ef4444') : 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }}>
                    {budgetLimit > 0 ? (budgetUsedPercent <= 100 ? 'On track' : 'Over budget') : 'No budget set'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                    {budgetLimit > 0
                      ? `${formatCurrency(displayExpense, 'INR')} of ${formatCurrency(budgetLimit, 'INR')}`
                      : `${formatCurrency(0, 'INR')} of ${formatCurrency(0, 'INR')}`}
                  </div>
                </div>

                {/* Circular Gauge Ring */}
                <div style={{ width: '48px', height: '48px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(139, 92, 246, 0.18)" strokeWidth="4.5" />
                    <circle
                      cx="24"
                      cy="24"
                      r="19"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="4.5"
                      strokeDasharray="119.38"
                      strokeDashoffset={119.38 - (119.38 * budgetUsedPercent) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 24 24)"
                    />
                  </svg>
                  <span style={{ position: 'absolute', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {budgetLimit > 0 ? `${budgetUsedPercent}%` : '0%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ==========================================================================
          CASH FLOW OVERVIEW (12-Month Dual Bar Chart) & TWO SIDE-BY-SIDE CARDS
          (Spending Categories Donut + Recent Transactions Styled List)
          Matches reference mockup pixel-for-pixel
          ========================================================================== */}
      <FinancialChartsSection
        balances={balances}
        categoryBreakdown={data?.categoryBreakdown}
        chitsList={data?.chitsList}
        recentTransactions={recentTransactions}
        creditCardData={sectionBreakdowns.creditCards}
        monthlyCashFlow={data?.monthlyCashFlow}
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
                  Credit Cards ({sectionBreakdowns.creditCards.count || 0} Linked)
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
                className={`badge-status ${sectionBreakdowns.creditCards.count > 0 ? (sectionBreakdowns.creditCards.utilization <= 30 ? 'success' : 'warning') : 'neutral'}`}
                style={{ fontSize: '0.68rem', padding: '2px 6px' }}
              >
                {sectionBreakdowns.creditCards.count > 0 ? `${sectionBreakdowns.creditCards.utilization}% Used` : '0 Cards'}
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
