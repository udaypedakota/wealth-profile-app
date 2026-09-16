import React from 'react';
import { ProfileStatistics, CurrencyCode } from '../../types/profile';
import { formatCurrency } from '../../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Receipt,
  CalendarCheck,
  Layers,
  CreditCard,
  HandCoins,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCcw,
  Sparkles
} from 'lucide-react';

interface FinancialStatsGridProps {
  stats: ProfileStatistics;
  currency: CurrencyCode;
}

export const FinancialStatsGrid: React.FC<FinancialStatsGridProps> = ({ stats, currency }) => {
  const metrics = [
    {
      title: 'Total Inflow / Income',
      amount: stats.totalIncome,
      icon: <TrendingUp size={22} color="#10b981" />,
      bgColor: 'rgba(16, 185, 129, 0.12)',
      textColor: '#10b981',
      subtitle: 'Cumulative inflows & salary'
    },
    {
      title: 'Total Expenses',
      amount: stats.totalExpenses,
      icon: <TrendingDown size={22} color="#f43f5e" />,
      bgColor: 'rgba(244, 63, 94, 0.12)',
      textColor: '#f43f5e',
      subtitle: 'Living & discretionary spends'
    },
    {
      title: 'Total Net Savings',
      amount: stats.totalSavings,
      icon: <PiggyBank size={22} color="#06b6d4" />,
      bgColor: 'rgba(6, 182, 212, 0.12)',
      textColor: '#06b6d4',
      subtitle: 'Capital accumulated & parked'
    },
    {
      title: 'Total Bills Settled',
      amount: stats.totalBillsPaid,
      icon: <Receipt size={22} color="#3b82f6" />,
      bgColor: 'rgba(59, 130, 246, 0.12)',
      textColor: '#3b82f6',
      subtitle: 'Utilities, subscriptions & rent'
    },
    {
      title: 'Total EMI Repaid',
      amount: stats.totalEmiPaid,
      icon: <CalendarCheck size={22} color="#8b5cf6" />,
      bgColor: 'rgba(139, 92, 246, 0.12)',
      textColor: '#8b5cf6',
      subtitle: 'Home & asset loan amortization'
    },
    {
      title: 'Total Chit Payments',
      amount: stats.totalChitPayments,
      icon: <Layers size={22} color="#eab308" />,
      bgColor: 'rgba(234, 179, 8, 0.12)',
      textColor: '#eab308',
      subtitle: 'Community chit fund subscriptions'
    },
    {
      title: 'Credit Card Settlements',
      amount: stats.totalCreditCardPayments,
      icon: <CreditCard size={22} color="#ec4899" />,
      bgColor: 'rgba(236, 72, 153, 0.12)',
      textColor: '#ec4899',
      subtitle: 'Full statement dues cleared'
    },
    {
      title: 'Money Lent (Receivable)',
      amount: stats.moneyLent,
      icon: <HandCoins size={22} color="#14b8a6" />,
      bgColor: 'rgba(20, 184, 166, 0.12)',
      textColor: '#14b8a6',
      subtitle: 'Friendly & peer loans given'
    },
    {
      title: 'Money Received Back',
      amount: stats.moneyReceived,
      icon: <ArrowDownLeft size={22} color="#22c55e" />,
      bgColor: 'rgba(34, 197, 94, 0.12)',
      textColor: '#22c55e',
      subtitle: 'Recovered from lent capital'
    },
    {
      title: 'Money Borrowed (Payable)',
      amount: stats.moneyBorrowed,
      icon: <ArrowUpRight size={22} color="#f97316" />,
      bgColor: 'rgba(249, 115, 22, 0.12)',
      textColor: '#f97316',
      subtitle: 'Short term borrowing balance'
    },
    {
      title: 'Money Repaid to Lenders',
      amount: stats.moneyRepaid,
      icon: <RefreshCcw size={22} color="#a855f7" />,
      bgColor: 'rgba(168, 85, 247, 0.12)',
      textColor: '#a855f7',
      subtitle: 'Borrowing debt paid off'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Comprehensive Financial Ledger Statistics</span>
            <Sparkles size={16} color="var(--primary)" />
          </h3>
          <p className="card-subtitle">
            11 core transaction metrics aggregated dynamically from your mock ledger records
          </p>
        </div>
      </div>

      <div className="card-grid-3col">
        {metrics.map((item, idx) => (
          <div key={idx} className="fin-stat-card">
            <div className="fin-stat-icon-wrapper" style={{ background: item.bgColor }}>
              {item.icon}
            </div>
            <div className="fin-stat-content">
              <div className="fin-stat-title">{item.title}</div>
              <div className="fin-stat-amount" style={{ color: item.textColor }}>
                {formatCurrency(item.amount, currency)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {item.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
