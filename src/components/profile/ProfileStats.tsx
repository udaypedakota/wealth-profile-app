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
  onNavigateTab?: (tabId: string) => void;
  onOpenAccounts?: () => void;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  stats,
  currency,
  onNavigateTab,
  onOpenAccounts
}) => {
  const items = [
    {
      label: 'Transactions',
      value: stats.totalTransactions.toLocaleString(),
      icon: <ArrowUpDown size={14} />,
      color: '',
      onClick: () => onNavigateTab?.('transactions'),
      hint: 'View ledger'
    },
    {
      label: 'Total Income',
      value: formatCurrency(stats.totalIncome, currency),
      icon: <TrendingUp size={14} color="#10b981" />,
      color: 'positive',
      onClick: () => onNavigateTab?.('income'),
      hint: 'Income streams'
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(stats.totalExpenses, currency),
      icon: <TrendingDown size={14} color="#f43f5e" />,
      color: 'negative',
      onClick: () => onNavigateTab?.('transactions'),
      hint: 'Expense entries'
    },
    {
      label: 'Active EMIs',
      value: `${stats.activeEmis} Active`,
      icon: <CalendarClock size={14} color="#f59e0b" />,
      color: '',
      onClick: () => onNavigateTab?.('emis'),
      hint: 'Loans & EMIs'
    },
    {
      label: 'Active Bills',
      value: `${stats.activeBills} Scheduled`,
      icon: <ReceiptText size={14} color="#3b82f6" />,
      color: '',
      onClick: () => onNavigateTab?.('bills'),
      hint: 'Recurring bills'
    },
    {
      label: 'Credit Cards',
      value: `${stats.creditCardsCount} Cards`,
      icon: <CreditCard size={14} color="#8b5cf6" />,
      color: '',
      onClick: () => onNavigateTab?.('credit_cards'),
      hint: 'Card statements'
    },
    {
      label: 'Connected Accounts',
      value: `${stats.accountsCount} ${stats.accountsCount === 1 ? 'Account' : 'Accounts'}`,
      icon: <Building2 size={14} color="#06b6d4" />,
      color: '',
      onClick: onOpenAccounts,
      hint: 'Manage accounts'
    }
  ];

  return (
    <div className="header-stats-grid">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="stat-metric-cell"
          style={{ cursor: item.onClick ? 'pointer' : 'default', transition: 'transform 0.15s ease, background 0.15s ease' }}
          onClick={item.onClick}
          title={item.hint ? `Click to ${item.hint.toLowerCase()}` : undefined}
          role="button"
          tabIndex={0}
        >
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
