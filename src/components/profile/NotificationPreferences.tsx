import React from 'react';
import { NotificationPreferences as INotificationPreferences } from '../../types/profile';
import { useToast } from '../../context/ToastContext';
import {
  Bell,
  CalendarClock,
  CreditCard,
  Receipt,
  Layers,
  AlertTriangle,
  Lightbulb,
  Check
} from 'lucide-react';

interface NotificationPreferencesProps {
  notifications?: INotificationPreferences;
  onUpdate: (notifications: INotificationPreferences) => Promise<void>;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  notifications: rawNotifications,
  onUpdate
}) => {
  const notifications: INotificationPreferences = rawNotifications || {
    billReminders: true,
    emiAlerts: true,
    chitPayments: true,
    creditCardDues: true,
    upcomingPayments: true,
    overduePayments: true,
    budgetAlerts: true,
    financialInsights: true,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true
  };
  const { success } = useToast();

  const handleToggle = async (key: keyof INotificationPreferences) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key]
    };
    await onUpdate(updated);
    success('Preferences Saved', 'Notification setting updated.');
  };

  const handleSetAll = async (value: boolean) => {
    const updated: INotificationPreferences = {
      ...notifications,
      billReminders: value,
      emiAlerts: value,
      chitPayments: value,
      creditCardDues: value,
      upcomingPayments: value,
      overduePayments: value,
      budgetAlerts: value,
      financialInsights: value
    };
    await onUpdate(updated);
    success('Preferences Updated', value ? 'All alerts enabled.' : 'All alerts muted.');
  };

  const alertItems: Array<{
    key: keyof INotificationPreferences;
    title: string;
    desc: string;
    icon: React.ReactNode;
  }> = [
    {
      key: 'billReminders',
      title: 'Scheduled Bill Reminders',
      desc: 'Get notified 3 days before utilities, broadband, and recurring subscriptions are due',
      icon: <Receipt size={18} color="#3b82f6" />
    },
    {
      key: 'emiAlerts',
      title: 'Active EMI & Loan Due Alerts',
      desc: 'Proactive reminders for home, auto, and personal loan installment debits',
      icon: <CalendarClock size={18} color="#8b5cf6" />
    },
    {
      key: 'chitPayments',
      title: 'Chit Fund Installment Reminders',
      desc: 'Reminders for community chit fund monthly subscriptions and auction dates',
      icon: <Layers size={18} color="#eab308" />
    },
    {
      key: 'creditCardDues',
      title: 'Credit Card Due Dates & Statement Alerts',
      desc: 'Timely notifications for minimum and total statement balances to avoid interest charges',
      icon: <CreditCard size={18} color="#ec4899" />
    },
    {
      key: 'upcomingPayments',
      title: 'Upcoming Settlement Reminders',
      desc: 'Early warnings for scheduled auto-debits and peer repayment obligations',
      icon: <Bell size={18} color="#10b981" />
    },
    {
      key: 'overduePayments',
      title: 'Overdue & Late Payment Alerts',
      desc: 'High priority urgent alerts for any payment that has missed its due date',
      icon: <AlertTriangle size={18} color="#ef4444" />
    },
    {
      key: 'budgetAlerts',
      title: 'Budget Threshold Alerts (80% / 100%)',
      desc: 'Instant notifications when your monthly category spending reaches target threshold',
      icon: <AlertTriangle size={18} color="#f59e0b" />
    },
    {
      key: 'financialInsights',
      title: 'Wealth Insights & Weekly Digests',
      desc: 'AI-curated weekly financial health report, cash-flow leaks, and savings opportunities',
      icon: <Lightbulb size={18} color="#06b6d4" />
    }
  ];

  return (
    <div className="premium-card glow-hover">
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="card-icon-bubble">
            <Bell size={22} />
          </div>
          <div>
            <h3 className="card-title">Notification & Alert Preferences</h3>
            <p className="card-subtitle">
              Configure reminder triggers for bills, EMIs, chits, card dues, and payment alerts
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleSetAll(true)}
          >
            <Check size={14} />
            <span>Enable All</span>
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleSetAll(false)}
          >
            <span>Mute All</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Reminder & Activity Triggers
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
          {alertItems.map((item) => (
            <div key={item.key} className="toggle-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flexShrink: 0 }}>{item.icon}</div>
                <div className="toggle-info">
                  <div className="toggle-title">{item.title}</div>
                  <div className="toggle-desc">{item.desc}</div>
                </div>
              </div>

              <label className="switch-control">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => handleToggle(item.key)}
                />
                <span className="switch-slider" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
