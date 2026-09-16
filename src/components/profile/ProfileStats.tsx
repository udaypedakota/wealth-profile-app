import React from 'react';
import { ProfileStatistics, CurrencyCode } from '../../types/profile';
import { formatCurrency } from '../../utils/formatters';
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  CalendarClock,
  ReceiptText,
  CreditCard,
  Building2
} from 'lucide-react';

interface ProfileStatsProps {
  stats: ProfileStatistics;
  currency: CurrencyCode;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats, currency }) => {
  const items = [
    {
      label: 'Transactions',
      value: stats.totalTransactions.toLocaleString(),
      icon: <ArrowUpDown size={14} />,
      color: ''
    },
    {
      label: 'Total Income',
      value: formatCurrency(stats.totalIncome, currency),
      icon: <TrendingUp size={14} color="#10b981" />,
      color: 'positive'
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(stats.totalExpenses, currency),
      icon: <TrendingDown size={14} color="#f43f5e" />,
      color: 'negative'
    },
    {
      label: 'Active EMIs',
      value: `${stats.activeEmis} Active`,
      icon: <CalendarClock size={14} color="#f59e0b" />,
      color: ''
    },
    {
      label: 'Active Bills',
      value: `${stats.activeBills} Scheduled`,
      icon: <ReceiptText size={14} color="#3b82f6" />,
      color: ''
    },
    {
      label: 'Credit Cards',
      value: `${stats.creditCardsCount} Cards`,
      icon: <CreditCard size={14} color="#8b5cf6" />,
      color: ''
    },
    {
      label: 'Connected Accounts',
      value: `${stats.accountsCount} Accounts`,
      icon: <Building2 size={14} color="#06b6d4" />,
      color: ''
    }
  ];

  return (
    <div className="header-stats-grid">
      {items.map((item, idx) => (
        <div key={idx} className="stat-metric-cell">
          <div className="stat-cell-label">
            {item.icon}
            <span>{item.label}</span>
          </div>
          <div className={`stat-cell-value ${item.color}`}>{item.value}</div>
        </div>
      ))}
    </div>
  );
};
