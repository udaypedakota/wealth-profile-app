import React from 'react';
import { FinancialPreferences, AccountItem } from '../../types/profile';
import { formatCurrency } from '../../utils/formatters';
import { Landmark, Edit2, Target, DollarSign, CreditCard, ShieldAlert } from 'lucide-react';

interface FinancialProfileCardProps {
  financial: FinancialPreferences;
  accounts: AccountItem[];
  onEditClick: () => void;
}

export const FinancialProfileCard: React.FC<FinancialProfileCardProps> = ({
  financial,
  accounts,
  onEditClick
}) => {
  const defaultAccount = accounts.find((a) => a.id === financial.defaultAccountId) || accounts[0];

  const savingsRate = financial.monthlyIncome > 0
    ? Math.round((financial.savingsTarget / financial.monthlyIncome) * 100)
    : 0;

  return (
    <div className="premium-card glow-hover">
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="card-icon-bubble">
            <Landmark size={22} />
          </div>
          <div>
            <h3 className="card-title">Financial Profile & Preferences</h3>
            <p className="card-subtitle">Default settlement parameters, monthly wealth targets, and fiscal parameters</p>
          </div>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onEditClick}>
          <Edit2 size={14} />
          <span>Edit</span>
        </button>
      </div>

      <div className="info-fields-grid">
        <div className="info-field-item">
          <span className="info-field-label">Base Operating Currency</span>
          <span className="info-field-value highlight">
            {financial.currency} ({financial.currencySymbol})
          </span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Default Settlement Account</span>
          <span className="info-field-value">
            {defaultAccount ? `${defaultAccount.name} (${defaultAccount.maskedNumber})` : 'Primary Bank'}
          </span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Estimated Monthly Inflow</span>
          <span className="info-field-value highlight" style={{ color: '#10b981' }}>
            {formatCurrency(financial.monthlyIncome, financial.currency)}
          </span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Monthly Expense Budget</span>
          <span className="info-field-value highlight" style={{ color: '#f59e0b' }}>
            {formatCurrency(financial.monthlyBudget, financial.currency)}
          </span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Target Monthly Savings</span>
          <span className="info-field-value highlight" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{formatCurrency(financial.savingsTarget, financial.currency)}</span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                fontWeight: 700
              }}
            >
              {savingsRate}% of Income
            </span>
          </span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Preferred Payment Rail</span>
          <span className="info-field-value">{financial.preferredPaymentMethod}</span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Investment Risk Appetite</span>
          <span className="info-field-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} color="var(--primary)" />
            {financial.riskAppetite}
          </span>
        </div>

        <div className="info-field-item">
          <span className="info-field-label">Tax Filing Status</span>
          <span className="info-field-value">{financial.taxFilingStatus}</span>
        </div>

        <div className="info-field-item" style={{ gridColumn: '1 / -1' }}>
          <span className="info-field-label">Core Financial Milestone / Goal</span>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '2px' }}>
            <Target size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span className="info-field-value" style={{ fontWeight: 600 }}>
              {financial.financialGoal || 'Set your long term wealth goals.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
