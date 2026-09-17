import {
  UserProfile,
  PersonalInformation,
  ContactInformation,
  FinancialPreferences,
  NotificationPreferences,
  AppearancePreferences,
  SecurityPreferences,
  AccountItem
} from '../types/profile';
import { INITIAL_DEMO_PROFILE } from './mockData';
import { ApiClient } from './apiClient';

function getProfileStorageKey(): string {
  try {
    const userStr = localStorage.getItem('moneymate_user');
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u && (u.id || u.username)) return `moneymate_profile_${u.id || u.username}`;
    }
  } catch {}
  return 'moneymate_profile_guest';
}

export const CLEAN_USER_PROFILE: UserProfile = {
  id: '',
  personal: {
    fullName: 'MoneyMate Member',
    firstName: 'Member',
    lastName: '',
    username: 'user',
    dateOfBirth: '',
    gender: 'Prefer not to say',
    avatarUrl: '',
    bio: 'Personal Money Ledger & Wealth Tracking'
  },
  contact: {
    email: '',
    mobile: '',
    altMobile: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: ''
  },
  financial: {
    currency: 'INR',
    currencySymbol: '₹',
    defaultAccountId: 'acc_cash_01',
    monthlyIncome: 0,
    monthlyBudget: 0,
    savingsTarget: 0,
    financialGoal: 'Systematic Personal Wealth Building',
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
    defaultTab: 'dashboard',
    animationsEnabled: true
  },
  security: {
    hasPin: false,
    twoFactorAuth: false,
    maskBalances: false,
    maskAccountNumbers: true,
    lastLogin: 'Active Today',
    activeSessions: []
  },
  accounts: [],
  stats: {
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    totalBillsPaid: 0,
    totalEmiPaid: 0,
    totalChitPayments: 0,
    totalCreditCardPayments: 0,
    moneyLent: 0,
    moneyReceived: 0,
    moneyBorrowed: 0,
    moneyRepaid: 0,
    activeBills: 0,
    activeEmis: 0,
    creditCardsCount: 0,
    accountsCount: 0
  },
  memberSince: new Date().toISOString().split('T')[0],
  tier: 'Private Wealth Member',
  kycVerified: false,
  updatedAt: new Date().toISOString()
};

export function ensureValidProfile(raw?: Partial<UserProfile> | null): UserProfile {
  let isUday = false;
  try {
    const userStr = localStorage.getItem('moneymate_user');
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u && (u.username === 'udaypedakota' || u.id === 'user_uday_01')) {
        isUday = true;
      }
    }
  } catch {}

  const base = isUday ? INITIAL_DEMO_PROFILE : CLEAN_USER_PROFILE;
  if (!raw) return { ...base };

  return {
    ...base,
    ...raw,
    personal: {
      ...base.personal,
      ...(raw.personal || {})
    },
    contact: {
      ...base.contact,
      ...(raw.contact || {})
    },
    financial: {
      ...base.financial,
      ...(raw.financial || {})
    },
    notifications: {
      ...base.notifications,
      ...(raw.notifications || {})
    },
    appearance: {
      ...base.appearance,
      ...(raw.appearance || {})
    },
    security: {
      ...base.security,
      ...(raw.security || {}),
      activeSessions: Array.isArray(raw.security?.activeSessions)
        ? raw.security.activeSessions
        : (base.security?.activeSessions || [])
    },
    accounts: Array.isArray(raw.accounts)
      ? raw.accounts
      : (base.accounts || []),
    stats: {
      ...base.stats,
      ...(raw.stats || {})
    }
  };
}

export class ProfileService {
  static async getProfile(): Promise<UserProfile> {
    const storageKey = getProfileStorageKey();
    try {
      const serverProfile = await ApiClient.getProfile();
      if (serverProfile && (serverProfile.personal || serverProfile.id)) {
        const validated = ensureValidProfile(serverProfile);
        try {
          localStorage.setItem(storageKey, JSON.stringify(validated));
        } catch (e) {
          console.warn('LocalStorage quota warning:', e);
        }
        return validated;
      }
    } catch {
      // Fallback to local
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return ensureValidProfile(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    return ensureValidProfile(null);
  }

  static async saveProfile(profile: UserProfile): Promise<UserProfile> {
    const storageKey = getProfileStorageKey();
    const updated = {
      ...profile,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage quota warning while saving profile:', e);
    }

    try {
      await ApiClient.updateProfile(updated);
    } catch {
      // ignore
    }

    window.dispatchEvent(new CustomEvent('zenith_profile_updated', { detail: updated }));
    return updated;
  }

  static async updateFullProfile(partial: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated: UserProfile = {
      ...current,
      ...partial,
      personal: {
        ...current.personal,
        ...(partial.personal || {})
      },
      contact: {
        ...current.contact,
        ...(partial.contact || {})
      },
      financial: {
        ...current.financial,
        ...(partial.financial || {})
      },
      notifications: {
        ...current.notifications,
        ...(partial.notifications || {})
      },
      appearance: {
        ...current.appearance,
        ...(partial.appearance || {})
      },
      security: {
        ...current.security,
        ...(partial.security || {})
      }
    };
    return await this.saveProfile(updated);
  }

  static async updatePersonal(personal: PersonalInformation): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated = {
      ...current,
      personal: { ...personal }
    };
    return await this.saveProfile(updated);
  }

  static async updateContact(contact: ContactInformation): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated = {
      ...current,
      contact: { ...contact }
    };
    return await this.saveProfile(updated);
  }

  static async updateFinancial(financial: FinancialPreferences): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated = {
      ...current,
      financial: { ...financial }
    };
    return await this.saveProfile(updated);
  }

  static async updateNotifications(notifications: NotificationPreferences): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated = {
      ...current,
      notifications: { ...notifications }
    };
    return await this.saveProfile(updated);
  }

  static async updateAppearance(appearance: AppearancePreferences): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated = {
      ...current,
      appearance: { ...appearance }
    };
    return await this.saveProfile(updated);
  }

  static async updateSecurity(security: SecurityPreferences): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated = {
      ...current,
      security: { ...security }
    };
    return await this.saveProfile(updated);
  }

  static async addAccount(account: AccountItem): Promise<UserProfile> {
    const current = await this.getProfile();
    const accounts = [...current.accounts, account];
    const creditCardsCount = accounts.filter((a) => a.type === 'credit_card').length;
    const accountsCount = accounts.length;

    try {
      await ApiClient.addAccount(account);
    } catch {}

    return await this.saveProfile({
      ...current,
      accounts,
      stats: {
        ...current.stats,
        accountsCount,
        creditCardsCount
      }
    });
  }

  static async updateAccount(account: AccountItem): Promise<UserProfile> {
    const current = await this.getProfile();
    const accounts = current.accounts.map((a) => (a.id === account.id ? account : a));
    try {
      await ApiClient.updateAccount(account.id, account);
    } catch {}
    return await this.saveProfile({ ...current, accounts });
  }

  static async deleteAccount(accountId: string): Promise<UserProfile> {
    const current = await this.getProfile();
    const accounts = current.accounts.filter((a) => a.id !== accountId);
    const creditCardsCount = accounts.filter((a) => a.type === 'credit_card').length;
    const accountsCount = accounts.length;
    try {
      await ApiClient.deleteAccount(accountId);
    } catch {}
    return await this.saveProfile({
      ...current,
      accounts,
      stats: { ...current.stats, accountsCount, creditCardsCount }
    });
  }

  static async uploadAvatar(base64Image: string): Promise<UserProfile> {
    const current = await this.getProfile();
    try {
      await ApiClient.uploadAvatar(base64Image);
    } catch {}
    return await this.saveProfile({
      ...current,
      personal: {
        ...current.personal,
        avatarUrl: base64Image
      }
    });
  }

  static async removeAvatar(): Promise<UserProfile> {
    const current = await this.getProfile();
    try {
      await ApiClient.uploadAvatar('');
    } catch {}
    return await this.saveProfile({
      ...current,
      personal: {
        ...current.personal,
        avatarUrl: ''
      }
    });
  }

  static async exportData(): Promise<string> {
    const profile = await this.getProfile();
    return JSON.stringify({ app: 'MoneyMate - Uday Pedakota', profile, exportedAt: new Date().toISOString() }, null, 2);
  }

  static async importData(jsonString: string): Promise<UserProfile> {
    const parsed = JSON.parse(jsonString);
    const profileData: UserProfile = parsed.profile || parsed;
    return await this.saveProfile(profileData);
  }

  static async resetDemoProfile(): Promise<UserProfile> {
    localStorage.removeItem(getProfileStorageKey());
    try {
      await ApiClient.resetData();
    } catch {}
    return await this.saveProfile(INITIAL_DEMO_PROFILE);
  }
}
