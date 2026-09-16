export type Gender = 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say';

export interface PersonalInformation {
  fullName: string;
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  gender: Gender;
  avatarUrl: string; // Base64 data URL or external URL; empty string for initials avatar
  bio: string;
}

export interface ContactInformation {
  email: string;
  mobile: string;
  altMobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD';

export interface FinancialPreferences {
  currency: CurrencyCode;
  currencySymbol: string;
  defaultAccountId: string;
  monthlyIncome: number;
  monthlyBudget: number;
  savingsTarget: number;
  financialGoal: string;
  preferredPaymentMethod: 'UPI' | 'Net Banking' | 'Auto-Debit' | 'Credit Card';
  riskAppetite: 'Conservative' | 'Moderate' | 'Aggressive';
  taxFilingStatus: 'Individual' | 'HUF' | 'Corporate' | 'Non-Resident';
}

export interface NotificationPreferences {
  billReminders: boolean;
  emiAlerts: boolean;
  chitPayments: boolean;
  creditCardDues: boolean;
  upcomingPayments: boolean;
  overduePayments: boolean;
  budgetAlerts: boolean;
  financialInsights: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export type ThemeMode = 'dark' | 'light' | 'system';
export type DashboardDensity = 'comfortable' | 'compact' | 'spacious';
export type AccentColor = 'emerald' | 'sapphire' | 'gold' | 'violet' | 'cyan';

export interface AppearancePreferences {
  theme: ThemeMode;
  density: DashboardDensity;
  accentColor: AccentColor;
  defaultTab: string;
  animationsEnabled: boolean;
}

export interface SessionDevice {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityPreferences {
  hasPin: boolean;
  twoFactorAuth: boolean;
  maskBalances: boolean;
  maskAccountNumbers: boolean;
  lastLogin: string;
  activeSessions: SessionDevice[];
}

export type AccountType = 'bank' | 'savings' | 'credit_card' | 'cash' | 'wallet';
export type AccountStatus = 'primary' | 'active' | 'linked';

export interface AccountItem {
  id: string;
  name: string;
  type: AccountType;
  maskedNumber: string;
  balance: number;
  currency: CurrencyCode;
  status: AccountStatus;
  institution: string;
  cardColor?: string;
  expiryDate?: string;
}

export interface ProfileStatistics {
  totalTransactions: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalBillsPaid: number;
  totalEmiPaid: number;
  totalChitPayments: number;
  totalCreditCardPayments: number;
  moneyLent: number;
  moneyReceived: number;
  moneyBorrowed: number;
  moneyRepaid: number;
  activeEmis: number;
  activeBills: number;
  creditCardsCount: number;
  accountsCount: number;
}

export interface UserProfile {
  id: string;
  personal: PersonalInformation;
  contact: ContactInformation;
  financial: FinancialPreferences;
  notifications: NotificationPreferences;
  appearance: AppearancePreferences;
  security: SecurityPreferences;
  accounts: AccountItem[];
  stats: ProfileStatistics;
  memberSince: string;
  tier: string;
  kycVerified: boolean;
  updatedAt: string;
}

export interface ProfileCompletionItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  weight: number;
  category: 'personal' | 'contact' | 'financial' | 'security';
}
