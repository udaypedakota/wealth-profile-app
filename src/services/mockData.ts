import { UserProfile } from '../types/profile';

export const INITIAL_DEMO_PROFILE: UserProfile = {
  id: 'usr_uday_9908',
  personal: {
    fullName: 'Uday Pedakota',
    firstName: 'Uday',
    lastName: 'Pedakota',
    username: 'uday_pedakota',
    dateOfBirth: '1998-03-31',
    gender: 'Male',
    avatarUrl: '',
    bio: 'Personal Wealth & Daily Money Manager. Real-time tracking of daily expenses, income, bills, and systematic savings.'
  },
  contact: {
    email: 'peddakotaudaykumar@gmail.com',
    mobile: '9908660573',
    altMobile: '',
    address: 'Pedakota Residence',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    zipCode: '530001'
  },
  financial: {
    currency: 'INR',
    currencySymbol: '₹',
    defaultAccountId: 'acc_cash_01',
    monthlyIncome: 85000,
    monthlyBudget: 35000,
    savingsTarget: 30000,
    financialGoal: 'Long-term Financial Independence & Systematic Asset Growth',
    preferredPaymentMethod: 'UPI',
    riskAppetite: 'Moderate',
    taxFilingStatus: 'Individual'
  },
  notifications: {
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
  },
  appearance: {
    theme: 'dark',
    density: 'comfortable',
    accentColor: 'emerald',
    defaultTab: 'overview',
    animationsEnabled: true
  },
  security: {
    hasPin: true,
    twoFactorAuth: true,
    maskBalances: false,
    maskAccountNumbers: true,
    lastLogin: 'Today, 02:45 PM IST',
    activeSessions: [
      {
        id: 'sess_1',
        deviceName: 'Workstation Desktop (Primary)',
        browser: 'Google Chrome 128.0',
        os: 'Windows 11 Pro',
        ip: '103.112.48.91',
        location: 'Bhubaneswar, India',
        lastActive: 'Active Now',
        isCurrent: true
      },
      {
        id: 'sess_2',
        deviceName: 'Apple iPhone 15 Pro Max',
        browser: 'Safari Mobile 17.4',
        os: 'iOS 18.1',
        ip: '103.112.48.92',
        location: 'Bhubaneswar, India',
        lastActive: '42 mins ago',
        isCurrent: false
      }
    ]
  },
  accounts: [
    {
      id: 'acc_hdfc_01',
      name: 'HDFC Wealth Imperial Salary',
      type: 'bank',
      institution: 'HDFC Bank Ltd.',
      maskedNumber: '•••• 8912',
      balance: 1428500,
      currency: 'INR',
      status: 'primary',
      cardColor: 'linear-gradient(135deg, #004c8f 0%, #001e3d 100%)'
    },
    {
      id: 'acc_icici_02',
      name: 'ICICI Private Wealth Savings',
      type: 'savings',
      institution: 'ICICI Bank',
      maskedNumber: '•••• 4201',
      balance: 892400,
      currency: 'INR',
      status: 'active',
      cardColor: 'linear-gradient(135deg, #b83214 0%, #571203 100%)'
    },
    {
      id: 'acc_amex_03',
      name: 'American Express Platinum Metal',
      type: 'credit_card',
      institution: 'American Express',
      maskedNumber: '•••• 1008',
      balance: -48600, // current statement outstanding
      currency: 'INR',
      status: 'active',
      expiryDate: '11/29',
      cardColor: 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)'
    },
    {
      id: 'acc_infinia_04',
      name: 'HDFC Infinia Metal Card',
      type: 'credit_card',
      institution: 'HDFC Bank',
      maskedNumber: '•••• 7741',
      balance: -72150, // outstanding
      currency: 'INR',
      status: 'active',
      expiryDate: '06/28',
      cardColor: 'linear-gradient(135deg, #111827 0%, #030712 100%)'
    },
    {
      id: 'acc_cash_05',
      name: 'Liquid Emergency Reserve Cash',
      type: 'cash',
      institution: 'Vault / Self-Held',
      maskedNumber: 'CASH-VAULT',
      balance: 150000,
      currency: 'INR',
      status: 'active',
      cardColor: 'linear-gradient(135deg, #065f46 0%, #022c22 100%)'
    }
  ],
  stats: {
    totalTransactions: 342,
    totalIncome: 4200000,
    totalExpenses: 1640000,
    totalSavings: 2560000,
    totalBillsPaid: 480000,
    totalEmiPaid: 720000,
    totalChitPayments: 360000,
    totalCreditCardPayments: 540000,
    moneyLent: 250000,
    moneyReceived: 180000,
    moneyBorrowed: 500000,
    moneyRepaid: 450000,
    activeEmis: 2,
    activeBills: 6,
    creditCardsCount: 2,
    accountsCount: 5
  },
  memberSince: '2021-04-15',
  tier: 'Private Wealth Elite (Diamond Tier)',
  kycVerified: true,
  updatedAt: new Date().toISOString()
};
