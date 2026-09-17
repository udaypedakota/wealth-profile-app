import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Coins,
  DollarSign,
  Calendar,
  Sparkles,
  Percent
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
    totalNetWorth: number;
    totalCashAndBank: number;
    totalCreditCardDue: number;
    todayExpense: number;
    yesterdayExpense?: number;
    thisMonthIncome: number;
    thisMonthExpense: number;
    monthlyIncome: number;
    monthlyBudget: number;
  };
  categoryBreakdown?: CategoryItem[];
  chitsList?: ChitProgressItem[];
  creditCardData?: {
    totalLimit: number;
    totalUsed: number;
    available: number;
    utilization: number;
    count: number;
  };
  onNavigateTab?: (tabId: string) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; stroke: string }> = {
  'Food & Groceries': { bg: 'rgba(245, 158, 11, 0.12)', text: '#f59e0b', stroke: '#f59e0b' },
  'Food': { bg: 'rgba(245, 158, 11, 0.12)', text: '#f59e0b', stroke: '#f59e0b' },
  'Medical & Health': { bg: 'rgba(239, 68, 68, 0.12)', text: '#ef4444', stroke: '#ef4444' },
  'Transportation & Fuel': { bg: 'rgba(59, 130, 246, 0.12)', text: '#3b82f6', stroke: '#3b82f6' },
  'Transportation': { bg: 'rgba(59, 130, 246, 0.12)', text: '#3b82f6', stroke: '#3b82f6' },
  'Entertainment': { bg: 'rgba(236, 72, 153, 0.12)', text: '#ec4899', stroke: '#ec4899' },
  'Other Expense': { bg: 'rgba(139, 92, 246, 0.12)', text: '#8b5cf6', stroke: '#8b5cf6' },
  'Hostel': { bg: 'rgba(168, 85, 247, 0.12)', text: '#a855f7', stroke: '#a855f7' },
  'Utilities': { bg: 'rgba(6, 182, 212, 0.12)', text: '#06b6d4', stroke: '#06b6d4' }
};

const DEFAULT_COLOR = { bg: 'rgba(100, 116, 139, 0.12)', text: '#94a3b8', stroke: '#94a3b8' };

export const FinancialChartsSection: React.FC<FinancialChartsSectionProps> = ({
  balances,
  categoryBreakdown = [],
  chitsList = [],
  creditCardData,
  onNavigateTab
}) => {
  const [activeView, setActiveView] = useState<'cashflow' | 'categories' | 'chits'>('cashflow');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Fallback category breakdown if empty
  const categories: CategoryItem[] = categoryBreakdown.length > 0
    ? categoryBreakdown
    : [
        { category: 'Hostel & Stay', amount: 6500, percentage: 46 },
        { category: 'Food & Groceries', amount: 3200, percentage: 23 },
        { category: 'Medical & Health', amount: 3000, percentage: 21 },
        { category: 'Transportation & Fuel', amount: 1000, percentage: 7 },
        { category: 'Entertainment', amount: 300, percentage: 3 }
      ];

  const totalExpense = categories.reduce((sum, c) => sum + c.amount, 0) || balances.thisMonthExpense || 14000;

  // Compute SVG Donut Chart Slices
  let cumulativePercent = 0;
  const donutSlices = categories.map((cat) => {
    const strokeDasharray = `${cat.percentage} ${100 - cat.percentage}`;
    const strokeDashoffset = 100 - cumulativePercent + 25; // 25 to start at top (12 o'clock)
    cumulativePercent += cat.percentage;
    const color = CATEGORY_COLORS[cat.category] || DEFAULT_COLOR;
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
      color
    };
  });

  // Monthly Budget calculations
  const monthlySalary = balances.monthlyIncome || 60000;
  const monthlyBudget = balances.monthlyBudget || 35000;
  const spentThisMonth = balances.thisMonthExpense || totalExpense;
  const budgetUtilization = Math.min(100, Math.round((spentThisMonth / monthlyBudget) * 100));
  const budgetRemaining = Math.max(0, monthlyBudget - spentThisMonth);
  const projectedSavings = Math.max(0, monthlySalary - spentThisMonth);

  return (
    <div
      className="premium-card"
      style={{
        padding: '20px 22px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-card)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Header with Title and Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '30px',
                height: '30px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PieChart size={17} />
            </span>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Interactive Visual Analytics & Graphs
            </h2>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.25)'
              }}
            >
              Live Insights
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 38px' }}>
            Real-time visual distribution of your daily spending, budget velocity, and active chit funds
          </p>
        </div>

        {/* View Switcher Buttons */}
        <div
          style={{
            display: 'inline-flex',
            padding: '3px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            gap: '2px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveView('cashflow')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeView === 'cashflow' ? 'var(--primary-gradient)' : 'transparent',
              color: activeView === 'cashflow' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <TrendingUp size={13} />
            <span>Monthly Inflow vs Outflow</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('categories')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeView === 'categories' ? 'var(--primary-gradient)' : 'transparent',
              color: activeView === 'categories' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <PieChart size={13} />
            <span>Spending Categories</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('chits')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeView === 'chits' ? 'var(--primary-gradient)' : 'transparent',
              color: activeView === 'chits' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Layers size={13} />
            <span>Chit Funds & Liabilities</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: EXPENSE CATEGORIES (Interactive SVG Donut & Detailed Category Cards)
          ========================================================================= */}
      {activeView === 'categories' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center'
          }}
        >
          {/* Left: SVG Donut Chart */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '10px 0'
            }}
          >
            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
              <svg
                viewBox="0 0 42 42"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: 'rotate(-90deg)',
                  borderRadius: '50%',
                  overflow: 'visible'
                }}
              >
                {/* Background Track */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="var(--border-subtle)"
                  strokeWidth="4.5"
                />

                {/* Slices */}
                {donutSlices.map((slice, idx) => {
                  const isHovered = hoveredCategory === slice.category;
                  return (
                    <circle
                      key={idx}
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke={slice.color.stroke}
                      strokeWidth={isHovered ? '6.5' : '4.5'}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      style={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        filter: isHovered ? `drop-shadow(0 0 6px ${slice.color.stroke})` : 'none'
                      }}
                      onMouseEnter={() => setHoveredCategory(slice.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Donut Hub */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  width: '130px'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {hoveredCategory || 'Total Spend'}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginTop: '2px'
                  }}
                >
                  {hoveredCategory
                    ? formatCurrency(categories.find((c) => c.category === hoveredCategory)?.amount || 0, 'INR')
                    : formatCurrency(totalExpense, 'INR')}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>
                  {hoveredCategory
                    ? `${categories.find((c) => c.category === hoveredCategory)?.percentage}% of total`
                    : `${categories.length} Categories`}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Hover over slices or categories to inspect breakdown
            </div>
          </div>

          {/* Right: Category List with percentage bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.map((cat, idx) => {
              const color = CATEGORY_COLORS[cat.category] || DEFAULT_COLOR;
              const isHovered = hoveredCategory === cat.category;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredCategory(cat.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isHovered ? color.bg : 'var(--bg-surface)',
                    border: isHovered ? `1px solid ${color.stroke}` : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: color.stroke
                        }}
                      />
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {cat.category}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {formatCurrency(cat.amount, 'INR')}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: color.text,
                          background: color.bg,
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-xs)',
                          minWidth: '36px',
                          textAlign: 'center'
                        }}
                      >
                        {cat.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal mini bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '5px',
                      background: 'var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${cat.percentage}%`,
                        height: '100%',
                        background: color.stroke,
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: MONTHLY CASH FLOW (Inflow vs Outflow vs Budget Visual Velocity)
          ========================================================================= */}
      {activeView === 'cashflow' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Comparative Cash Stream Bar Chart */}
          <div
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Monthly Cash Flow Stream & Comparison
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#10b981' }}>+{formatCurrency(monthlySalary, 'INR')}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>vs</span>
                  <span style={{ color: '#f43f5e' }}>-{formatCurrency(spentThisMonth, 'INR')}</span>
                </div>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  border: '1px solid rgba(16, 185, 129, 0.25)'
                }}
              >
                <Sparkles size={13} />
                <span>Net Savings: {formatCurrency(projectedSavings, 'INR')}</span>
              </div>
            </div>

            {/* Stream Bars Comparison */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Bar 1: Monthly Income */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    Monthly Salary Inflow
                  </span>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>
                    +{formatCurrency(monthlySalary, 'INR')} (100%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>

              {/* Bar 2: Budget Target */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
                    Monthly Budget Target
                  </span>
                  <span style={{ fontWeight: 800, color: '#3b82f6' }}>
                    {formatCurrency(monthlyBudget, 'INR')} ({Math.round((monthlyBudget / monthlySalary) * 100)}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Math.round((monthlyBudget / monthlySalary) * 100))}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>

              {/* Bar 3: Actual Spent */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }} />
                    Actual Outflow (Cash + Cards)
                  </span>
                  <span style={{ fontWeight: 800, color: '#f43f5e' }}>
                    -{formatCurrency(spentThisMonth, 'INR')} ({Math.round((spentThisMonth / monthlySalary) * 100)}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Math.round((spentThisMonth / monthlySalary) * 100))}%`, height: '100%', background: 'linear-gradient(90deg, #f43f5e 0%, #be123c 100%)', borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>

              {/* Bar 4: Net Projected Savings */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} />
                    Net Projected Savings
                  </span>
                  <span style={{ fontWeight: 800, color: '#8b5cf6' }}>
                    {formatCurrency(projectedSavings, 'INR')} ({Math.round((projectedSavings / monthlySalary) * 100)}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Math.round((projectedSavings / monthlySalary) * 100))}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)', borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Visual Multi-Stage Progress Bar */}
          <div
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Monthly Budget Utilization
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {formatCurrency(spentThisMonth, 'INR')}{' '}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    spent of {formatCurrency(monthlyBudget, 'INR')} budget
                  </span>
                </div>
              </div>
              <div
                style={{
                  textAlign: 'right',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: budgetUtilization <= 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: budgetUtilization <= 80 ? '#10b981' : '#ef4444',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}
              >
                {budgetUtilization}% Used
              </div>
            </div>

            {/* Progress Track */}
            <div
              style={{
                width: '100%',
                height: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex'
              }}
            >
              <div
                style={{
                  width: `${budgetUtilization}%`,
                  height: '100%',
                  background: budgetUtilization <= 70
                    ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.5s ease'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              <span>Spent so far: <strong style={{ color: '#f43f5e' }}>{formatCurrency(spentThisMonth, 'INR')}</strong></span>
              <span>Headroom left: <strong style={{ color: '#10b981' }}>{formatCurrency(budgetRemaining, 'INR')}</strong></span>
            </div>
          </div>

          {/* 4 Inflow vs Outflow Pillars Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}
          >
            {/* Pillar 1: Total Salary Inflow */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderLeft: '3px solid #10b981'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Expected Inflow
                </span>
                <TrendingUp size={15} color="#10b981" />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                +{formatCurrency(monthlySalary, 'INR')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Primary Monthly Salary
              </div>
            </div>

            {/* Pillar 2: Total Month Outflow */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderLeft: '3px solid #f43f5e'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Actual Outflow
                </span>
                <TrendingDown size={15} color="#f43f5e" />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#f43f5e' }}>
                -{formatCurrency(spentThisMonth, 'INR')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Cash + Card Expenses
              </div>
            </div>

            {/* Pillar 3: Projected Net Savings */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderLeft: '3px solid #3b82f6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Projected Savings
                </span>
                <Coins size={15} color="#3b82f6" />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6' }}>
                {formatCurrency(projectedSavings, 'INR')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Salary minus monthly spend
              </div>
            </div>

            {/* Pillar 4: Savings Rate % */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderLeft: '3px solid #8b5cf6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Savings Rate
                </span>
                <Percent size={15} color="#8b5cf6" />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#8b5cf6' }}>
                {monthlySalary > 0 ? Math.round((projectedSavings / monthlySalary) * 100) : 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                High Tier Wealth Builder
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CHIT FUNDS & COMMITMENTS (4 Active Chits Visual Accumulation)
          ========================================================================= */}
      {activeView === 'chits' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Active Chit Funds Progress & Pot Values
            </span>
            {onNavigateTab && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => onNavigateTab('chits')}
                style={{ fontSize: '0.75rem', padding: '4px 10px', gap: '4px' }}
              >
                <span>Open Chit Tracker</span>
                <ArrowUpRight size={13} />
              </button>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px'
            }}
          >
            {chitsList.length > 0 ? (
              chitsList.map((chit) => (
                <div
                  key={chit.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {chit.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Monthly: <strong>{formatCurrency(chit.monthlyAmount, 'INR')}</strong>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.25)'
                      }}
                    >
                      {chit.progressPercent}% Paid
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                      margin: '10px 0 6px'
                    }}
                  >
                    <div
                      style={{
                        width: `${chit.progressPercent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>Paid: <strong style={{ color: '#10b981' }}>{formatCurrency(chit.paidAmount, 'INR')}</strong></span>
                    <span>Pool: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(chit.totalAmount, 'INR')}</strong></span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active chit funds found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
