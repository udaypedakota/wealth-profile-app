import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import {
  BarChart3,
  PieChart,
  Layers,
  ArrowRight,
  ChevronDown,
  Wallet,
  ShoppingCart,
  Zap,
  Fuel,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Building2,
  Calendar,
  Sparkles,
  Plus,
  Receipt
} from 'lucide-react';

interface CategoryItem {
  category: string;
  amount: number;
  percentage: number;
}

interface ChitProgressItem {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  progressPercent: number;
  monthlyAmount: number;
  status: string;
}

interface FinancialChartsSectionProps {
  balances: {
    totalNetWorth?: number;
    totalCashAndBank?: number;
    totalCreditCardDue?: number;
    todayExpense?: number;
    thisMonthIncome?: number;
    thisMonthExpense?: number;
    monthlyIncome?: number;
    monthlyBudget?: number;
  };
  categoryBreakdown?: CategoryItem[];
  chitsList?: ChitProgressItem[];
  recentTransactions?: any[];
  creditCardData?: any;
  monthlyCashFlow?: { month: string; inflow: number; outflow: number }[];
  onNavigateTab?: (tabId: string) => void;
}

const EMPTY_MONTHLY_CASH_FLOW = [
  { month: 'Jan', inflow: 0, outflow: 0 },
  { month: 'Feb', inflow: 0, outflow: 0 },
  { month: 'Mar', inflow: 0, outflow: 0 },
  { month: 'Apr', inflow: 0, outflow: 0 },
  { month: 'May', inflow: 0, outflow: 0 },
  { month: 'Jun', inflow: 0, outflow: 0 },
  { month: 'Jul', inflow: 0, outflow: 0 },
  { month: 'Aug', inflow: 0, outflow: 0 },
  { month: 'Sep', inflow: 0, outflow: 0 },
  { month: 'Oct', inflow: 0, outflow: 0 },
  { month: 'Nov', inflow: 0, outflow: 0 },
  { month: 'Dec', inflow: 0, outflow: 0 }
];

function formatCompactNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${Math.round(num / 1000)}K`;
  return `${num}`;
}

export const FinancialChartsSection: React.FC<FinancialChartsSectionProps> = ({
  balances,
  categoryBreakdown = [],
  chitsList = [],
  recentTransactions = [],
  monthlyCashFlow,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'cashflow' | 'categories' | 'chits'>('cashflow');
  const [selectedMonthRange, setSelectedMonthRange] = useState<'thisMonth' | 'allYear'>('thisMonth');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Dynamic monthly cash flow: sync current month with live balances or server records
  const monthlyData = React.useMemo(() => {
    if (Array.isArray(monthlyCashFlow) && monthlyCashFlow.length === 12) {
      return monthlyCashFlow;
    }
    const currentMonthIdx = new Date().getMonth();
    return EMPTY_MONTHLY_CASH_FLOW.map((m, idx) => {
      if (idx === currentMonthIdx) {
        return {
          ...m,
          inflow: Number(balances.thisMonthIncome || balances.monthlyIncome || 0),
          outflow: Number(balances.thisMonthExpense || 0)
        };
      }
      return m;
    });
  }, [monthlyCashFlow, balances]);

  const maxVal = React.useMemo(() => {
    const highest = Math.max(
      ...monthlyData.map((d) => Math.max(d.inflow, d.outflow)),
      Number(balances.thisMonthIncome || 0),
      Number(balances.thisMonthExpense || 0)
    );
    return highest > 0 ? Math.ceil(highest * 1.15) : 50000;
  }, [monthlyData, balances]);

  const totalYearInflow = monthlyData.reduce((s, m) => s + m.inflow, 0);
  const totalYearOutflow = monthlyData.reduce((s, m) => s + m.outflow, 0);

  // Categories calculation (purely dynamic from real user records)
  const displayCategories = React.useMemo(() => {
    if (Array.isArray(categoryBreakdown) && categoryBreakdown.length > 0) {
      const palette = ['#3b82f6', '#f97316', '#f59e0b', '#06b6d4', '#8b5cf6', '#10b981'];
      return categoryBreakdown.slice(0, 6).map((c, i) => ({
        name: c.category,
        percent: c.percentage,
        amount: c.amount,
        color: palette[i % palette.length]
      }));
    }
    return [];
  }, [categoryBreakdown]);

  const totalExpenseVal = displayCategories.reduce((s, c) => s + c.amount, 0) || Number(balances.thisMonthExpense || 0);

  // Compute SVG Donut Chart Slices
  let cumulative = 0;
  const donutSlices = displayCategories.map((cat) => {
    const strokeDasharray = `${cat.percent} ${100 - cat.percent}`;
    const strokeDashoffset = 100 - cumulative + 25; // 25 to start at 12 o'clock
    cumulative += cat.percent;
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset
    };
  });

  // Recent transactions list: purely dynamic from real user entries
  const displayRecentTransactions = React.useMemo(() => {
    const list: any[] = [];
    if (Array.isArray(recentTransactions) && recentTransactions.length > 0) {
      recentTransactions.slice(0, 5).forEach((tx) => {
        const isCredit = tx.type === 'credit';
        let IconComp = isCredit ? Wallet : ShoppingCart;
        let iconBg = isCredit ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';
        let iconColor = isCredit ? '#10b981' : '#f43f5e';

        const cat = (tx.category || '').toLowerCase();
        if (cat.includes('bill') || cat.includes('util')) {
          IconComp = Zap;
          iconBg = 'rgba(245, 158, 11, 0.12)';
          iconColor = '#f59e0b';
        } else if (cat.includes('fuel') || cat.includes('trans')) {
          IconComp = Fuel;
          iconBg = 'rgba(59, 130, 246, 0.12)';
          iconColor = '#3b82f6';
        }

        list.push({
          id: tx.id || String(Math.random()),
          title: tx.title || (isCredit ? 'Income Received' : 'Expense Recorded'),
          subtitle: `${isCredit ? 'Income' : 'Expense'} • ${tx.account || 'Vault'}`,
          amount: Number(tx.amount || 0),
          type: tx.type,
          date: tx.date || 'Today',
          icon: IconComp,
          iconBg,
          iconColor
        });
      });
    }
    return list;
  }, [recentTransactions]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* =========================================================================
          SECTION 1: CASH FLOW OVERVIEW (FULL-WIDTH 12-MONTH DUAL BAR CHART)
          ========================================================================= */}
      <div
        className="premium-card"
        style={{
          padding: '24px',
          borderRadius: '20px',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
          position: 'relative'
        }}
      >
        {/* Card Header with Title and 3 Pill Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px'
          }}
        >
          {/* Title with Blue Chart Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(9, 92, 229, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#095ce5'
              }}
            >
              <BarChart3 size={20} />
            </div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0f294a',
                letterSpacing: '-0.02em',
                margin: 0
              }}
            >
              Cash Flow Overview
            </h2>
          </div>

          {/* 3 Pill Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '9999px',
              gap: '4px'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('cashflow')}
              style={{
                border: 'none',
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: activeTab === 'cashflow' ? 'linear-gradient(135deg, #095ce5 0%, #0045b5 100%)' : 'transparent',
                color: activeTab === 'cashflow' ? '#ffffff' : '#64748b',
                boxShadow: activeTab === 'cashflow' ? '0 2px 8px rgba(9, 92, 229, 0.3)' : 'none'
              }}
            >
              Monthly Inflow vs Outflow
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              style={{
                border: 'none',
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: activeTab === 'categories' ? 'linear-gradient(135deg, #095ce5 0%, #0045b5 100%)' : 'transparent',
                color: activeTab === 'categories' ? '#ffffff' : '#64748b',
                boxShadow: activeTab === 'categories' ? '0 2px 8px rgba(9, 92, 229, 0.3)' : 'none'
              }}
            >
              Spending Categories
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chits')}
              style={{
                border: 'none',
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: activeTab === 'chits' ? 'linear-gradient(135deg, #095ce5 0%, #0045b5 100%)' : 'transparent',
                color: activeTab === 'chits' ? '#ffffff' : '#64748b',
                boxShadow: activeTab === 'chits' ? '0 2px 8px rgba(9, 92, 229, 0.3)' : 'none'
              }}
            >
              Chit Funds & Liabilities
            </button>
          </div>
        </div>

        {/* Tab 1: 12-Month Dual Bar Chart */}
        {activeTab === 'cashflow' && (
          <div>
            {/* Zero State Notice if user has no cash flow activity */}
            {totalYearInflow === 0 && totalYearOutflow === 0 && (
              <div
                style={{
                  padding: '8px 14px',
                  background: 'rgba(9, 92, 229, 0.05)',
                  border: '1px dashed rgba(9, 92, 229, 0.2)',
                  borderRadius: '10px',
                  fontSize: '0.76rem',
                  color: '#095ce5',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={14} />
                <span>No cash flow entries recorded yet this year. Tap <strong>+ Add Income</strong> or <strong>Record Expense</strong> above to plot your real trends.</span>
              </div>
            )}

            {/* Chart Legend on Top Right */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '18px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                <span>Inflow</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f87171' }} />
                <span>Outflow</span>
              </div>
            </div>

            {/* Chart Canvas with Y-Axis and 12 Columns */}
            <div style={{ position: 'relative', width: '100%', height: '230px', display: 'flex', alignItems: 'stretch' }}>
              {/* Y-Axis Labels */}
              <div
                style={{
                  width: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  paddingBottom: '26px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  textAlign: 'right',
                  paddingRight: '8px'
                }}
              >
                <span>{formatCompactNumber(maxVal)}</span>
                <span>{formatCompactNumber(Math.round(maxVal * 0.75))}</span>
                <span>{formatCompactNumber(Math.round(maxVal * 0.5))}</span>
                <span>{formatCompactNumber(Math.round(maxVal * 0.25))}</span>
                <span>0</span>
              </div>

              {/* Main Bars Grid with Horizontal Grid Lines */}
              <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Horizontal Dashed Lines */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '26px', pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: '100%',
                        borderBottom: '1px dashed rgba(0, 0, 0, 0.08)'
                      }}
                    />
                  ))}
                </div>

                {/* 12 Months Columns */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                    paddingBottom: '26px'
                  }}
                >
                  {monthlyData.map((item, idx) => {
                    const inflowHeightPercent = Math.min(100, Math.round((item.inflow / maxVal) * 100));
                    const outflowHeightPercent = Math.min(100, Math.round((item.outflow / maxVal) * 100));
                    const isHovered = hoveredMonth === idx;

                    return (
                      <div
                        key={item.month}
                        onMouseEnter={() => setHoveredMonth(idx)}
                        onMouseLeave={() => setHoveredMonth(null)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          position: 'relative',
                          cursor: 'pointer',
                          padding: '0 4px'
                        }}
                      >
                        {/* Tooltip on Hover */}
                        {isHovered && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '105%',
                              background: '#0f172a',
                              color: '#ffffff',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '0.68rem',
                              whiteSpace: 'nowrap',
                              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
                              zIndex: 30,
                              pointerEvents: 'none'
                            }}
                          >
                            <div style={{ fontWeight: 800, color: '#38bdf8' }}>Inflow: ₹{item.inflow.toLocaleString('en-IN')}</div>
                            <div style={{ fontWeight: 800, color: '#f87171' }}>Outflow: ₹{item.outflow.toLocaleString('en-IN')}</div>
                          </div>
                        )}

                        {/* Dual Vertical Rounded Bars */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100%', width: '100%', justifyContent: 'center' }}>
                          {/* Inflow Bar (Sky Blue) */}
                          <div
                            style={{
                              width: '42%',
                              maxWidth: '18px',
                              height: `${inflowHeightPercent}%`,
                              background: 'linear-gradient(180deg, #38bdf8 0%, #2563eb 100%)',
                              borderTopLeftRadius: '5px',
                              borderTopRightRadius: '5px',
                              transition: 'height 0.3s ease',
                              boxShadow: isHovered ? '0 0 10px rgba(56, 189, 248, 0.5)' : 'none'
                            }}
                          />

                          {/* Outflow Bar (Salmon Red) */}
                          <div
                            style={{
                              width: '42%',
                              maxWidth: '18px',
                              height: `${outflowHeightPercent}%`,
                              background: 'linear-gradient(180deg, #f87171 0%, #ef4444 100%)',
                              borderTopLeftRadius: '5px',
                              borderTopRightRadius: '5px',
                              transition: 'height 0.3s ease',
                              boxShadow: isHovered ? '0 0 10px rgba(248, 113, 113, 0.5)' : 'none'
                            }}
                          />
                        </div>

                        {/* Month Label below the axis */}
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '-22px',
                            fontSize: '0.74rem',
                            fontWeight: isHovered ? 700 : 500,
                            color: isHovered ? '#095ce5' : '#64748b'
                          }}
                        >
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Spending Categories (Expanded View) */}
        {activeTab === 'categories' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                <svg viewBox="0 0 42 42" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', borderRadius: '50%' }}>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="5.5" />
                  {donutSlices.map((slice, idx) => (
                    <circle
                      key={idx}
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="5.5"
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                  ))}
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f294a' }}>
                    {formatCurrency(totalExpenseVal, 'INR')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Outflow</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {displayCategories.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{c.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f294a' }}>{formatCurrency(c.amount, 'INR')}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: c.color, background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px' }}>
                      {c.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Chit Funds & Liabilities */}
        {activeTab === 'chits' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontWeight: 800, color: '#0f294a' }}>Active Chit Funds & Monthly Liabilities</h4>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Community pools and disciplined recurring savings progress
                </p>
              </div>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('chits')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#095ce5',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Manage All</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>

            {chitsList.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <Layers size={32} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', color: '#0f294a' }}>No Active Chit Funds</h4>
                <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: '#64748b' }}>
                  Track your monthly community chit pools, auctions, and dividend payouts.
                </p>
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('chits')}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={14} /> Link Chit Fund
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {chitsList.map((chit) => (
                  <div key={chit.id} style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f294a' }}>{chit.name}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#095ce5', background: 'rgba(9, 92, 229, 0.1)', padding: '2px 8px', borderRadius: '9999px' }}>
                        {chit.progressPercent}%
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '9999px', background: '#e2e8f0', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ width: `${chit.progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #095ce5, #38bdf8)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                      <span>Paid: <strong style={{ color: '#10b981' }}>₹{chit.paidAmount.toLocaleString('en-IN')}</strong></span>
                      <span>Target: <strong>₹{chit.totalAmount.toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 2: TWO CARDS SIDE-BY-SIDE (50% / 50% Desktop, Stacked Mobile)
          Left: Spending Categories (Donut) | Right: Recent Transactions (Styled List)
          ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px'
        }}
      >
        {/* ===================== LEFT CARD: SPENDING CATEGORIES ===================== */}
        <div
          className="premium-card"
          style={{
            padding: '24px',
            borderRadius: '20px',
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(9, 92, 229, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#095ce5'
                }}
              >
                <PieChart size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f294a', letterSpacing: '-0.02em', margin: 0 }}>
                Spending Categories
              </h3>
            </div>

            {/* This Month Dropdown Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              <span>This Month</span>
              <ChevronDown size={14} color="#64748b" />
            </div>
          </div>

          {/* Donut Chart & Category Breakdown Side-by-Side */}
          {displayCategories.length === 0 ? (
            <div style={{ padding: '36px 16px', textAlign: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(9, 92, 229, 0.08)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#095ce5',
                  marginBottom: '10px'
                }}
              >
                <PieChart size={24} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f294a' }}>No Expenses Recorded</div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 16px' }}>
                Record your daily spending to see your automated category breakdown.
              </p>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('transactions')}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} /> Record Expense
                </button>
              )}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              {/* SVG Donut Chart */}
              <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
                <svg viewBox="0 0 42 42" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', borderRadius: '50%' }}>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="5.8" />
                  {donutSlices.map((slice, idx) => (
                    <circle
                      key={idx}
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="5.8"
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                  ))}
                </svg>

                {/* Center Total Hub */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    width: '100px'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.18rem',
                      fontWeight: 800,
                      color: '#0f294a',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1
                    }}
                  >
                    ₹{totalExpenseVal.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Total</div>
                </div>
              </div>

              {/* Category Percentages List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {displayCategories.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#0f294a', marginLeft: '6px' }}>{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===================== RIGHT CARD: RECENT TRANSACTIONS ===================== */}
        <div
          className="premium-card"
          style={{
            padding: '24px',
            borderRadius: '20px',
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(9, 92, 229, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#095ce5'
                }}
              >
                <Wallet size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f294a', letterSpacing: '-0.02em', margin: 0 }}>
                Recent Transactions
              </h3>
            </div>

            {/* View All link */}
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('transactions')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#095ce5',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Clean Styled Rows or Zero State */}
          {displayRecentTransactions.length === 0 ? (
            <div style={{ padding: '36px 16px', textAlign: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(9, 92, 229, 0.08)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#095ce5',
                  marginBottom: '10px'
                }}
              >
                <Receipt size={24} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f294a' }}>No Transactions Yet</div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 16px' }}>
                Your real-time daily incomes and expenses will appear here.
              </p>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('transactions')}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} /> Add Transaction
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {displayRecentTransactions.map((tx) => {
                const IconComp = tx.icon || Wallet;
                const isCredit = tx.type === 'credit';

                return (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 6px',
                      borderRadius: '10px',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      {/* Circle Icon Badge */}
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: tx.iconBg,
                          color: tx.iconColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <IconComp size={18} />
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f294a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tx.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
                          {tx.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Amount & Date on Right */}
                    <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '8px' }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          color: isCredit ? '#10b981' : '#ef4444'
                        }}
                      >
                        {isCredit ? `+₹${tx.amount.toLocaleString('en-IN')}` : `-₹${tx.amount.toLocaleString('en-IN')}`}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1px' }}>
                        {tx.date}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
