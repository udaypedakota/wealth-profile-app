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

const STORAGE_KEY = 'uday_wealth_user_profile';

export class ProfileService {
  static async getProfile(): Promise<UserProfile> {
    try {
      const serverProfile = await ApiClient.getProfile();
      if (serverProfile && serverProfile.personal) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverProfile));
        } catch (e) {
          console.warn('LocalStorage quota warning:', e);
        }
        return serverProfile;
      }
    } catch {
      // Fallback to local
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    return INITIAL_DEMO_PROFILE;
  }

  static async saveProfile(profile: UserProfile): Promise<UserProfile> {
    const updated = {
      ...profile,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
    localStorage.removeItem(STORAGE_KEY);
    try {
      await ApiClient.resetData();
    } catch {}
    return await this.saveProfile(INITIAL_DEMO_PROFILE);
  }
}
