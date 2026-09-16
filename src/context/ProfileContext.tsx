import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserProfile,
  PersonalInformation,
  ContactInformation,
  FinancialPreferences,
  NotificationPreferences,
  AppearancePreferences,
  SecurityPreferences,
  AccountItem,
  ProfileCompletionItem
} from '../types/profile';
import { ProfileService } from '../services/profileService';
import { INITIAL_DEMO_PROFILE } from '../services/mockData';

interface ProfileContextType {
  profile: UserProfile;
  loading: boolean;
  completionPercentage: number;
  completionItems: ProfileCompletionItem[];
  updatePersonal: (personal: PersonalInformation) => Promise<void>;
  updateContact: (contact: ContactInformation) => Promise<void>;
  updateFinancial: (financial: FinancialPreferences) => Promise<void>;
  updateNotifications: (notifications: NotificationPreferences) => Promise<void>;
  updateAppearance: (appearance: AppearancePreferences) => Promise<void>;
  updateSecurity: (security: SecurityPreferences) => Promise<void>;
  addAccount: (account: AccountItem) => Promise<void>;
  updateAccount: (account: AccountItem) => Promise<void>;
  deleteAccount: (accountId: string) => Promise<void>;
  uploadAvatar: (dataUrl: string) => Promise<void>;
  removeAvatar: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (jsonStr: string) => Promise<void>;
  resetDemoData: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_DEMO_PROFILE);
  const [loading, setLoading] = useState<boolean>(true);

  // Load profile on mount
  const refreshProfile = useCallback(async () => {
    try {
      const data = await ProfileService.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();

    // Listen to custom cross-tab or cross-component sync events
    const handleProfileSync = (event: Event) => {
      const customEv = event as CustomEvent<UserProfile>;
      if (customEv.detail) {
        setProfile(customEv.detail);
      }
    };

    window.addEventListener('zenith_profile_updated', handleProfileSync);
    return () => window.removeEventListener('zenith_profile_updated', handleProfileSync);
  }, [refreshProfile]);

  // Actions
  const updatePersonal = useCallback(async (personal: PersonalInformation) => {
    const updated = await ProfileService.updatePersonal(personal);
    setProfile(updated);
  }, []);

  const updateContact = useCallback(async (contact: ContactInformation) => {
    const updated = await ProfileService.updateContact(contact);
    setProfile(updated);
  }, []);

  const updateFinancial = useCallback(async (financial: FinancialPreferences) => {
    const updated = await ProfileService.updateFinancial(financial);
    setProfile(updated);
  }, []);

  const updateNotifications = useCallback(async (notifications: NotificationPreferences) => {
    const updated = await ProfileService.updateNotifications(notifications);
    setProfile(updated);
  }, []);

  const updateAppearance = useCallback(async (appearance: AppearancePreferences) => {
    const updated = await ProfileService.updateAppearance(appearance);
    setProfile(updated);
  }, []);

  const updateSecurity = useCallback(async (security: SecurityPreferences) => {
    const updated = await ProfileService.updateSecurity(security);
    setProfile(updated);
  }, []);

  const addAccount = useCallback(async (account: AccountItem) => {
    const updated = await ProfileService.addAccount(account);
    setProfile(updated);
  }, []);

  const updateAccount = useCallback(async (account: AccountItem) => {
    const updated = await ProfileService.updateAccount(account);
    setProfile(updated);
  }, []);

  const deleteAccount = useCallback(async (accountId: string) => {
    const updated = await ProfileService.deleteAccount(accountId);
    setProfile(updated);
  }, []);

  const uploadAvatar = useCallback(async (dataUrl: string) => {
    const updated = await ProfileService.uploadAvatar(dataUrl);
    setProfile(updated);
  }, []);

  const removeAvatar = useCallback(async () => {
    const updated = await ProfileService.removeAvatar();
    setProfile(updated);
  }, []);

  const exportData = useCallback(async () => {
    return await ProfileService.exportData();
  }, []);

  const importData = useCallback(async (jsonStr: string) => {
    const updated = await ProfileService.importData(jsonStr);
    setProfile(updated);
  }, []);

  const resetDemoData = useCallback(async () => {
    const updated = await ProfileService.resetDemoProfile();
    setProfile(updated);
  }, []);

  // Compute profile completion dynamic checklist and overall percentage
  const { completionPercentage, completionItems } = useMemo(() => {
    const items: ProfileCompletionItem[] = [
      {
        id: 'avatar',
        title: 'Profile Picture',
        description: 'Upload high-resolution profile photo',
        completed: Boolean(profile.personal.avatarUrl && profile.personal.avatarUrl.trim().length > 0),
        weight: 15,
        category: 'personal'
      },
      {
        id: 'personal_identity',
        title: 'Personal Identity',
        description: 'Full name, username, DOB & bio description',
        completed: Boolean(
          profile.personal.fullName &&
          profile.personal.username &&
          profile.personal.dateOfBirth &&
          profile.personal.bio &&
          profile.personal.bio.length > 10
        ),
        weight: 15,
        category: 'personal'
      },
      {
        id: 'contact_info',
        title: 'Verified Contact Details',
        description: 'Primary email, mobile number & alternate phone',
        completed: Boolean(profile.contact.email && profile.contact.mobile && profile.contact.altMobile),
        weight: 15,
        category: 'contact'
      },
      {
        id: 'residential_address',
        title: 'Residential Address',
        description: 'Street address, city, state and PIN/ZIP code',
        completed: Boolean(
          profile.contact.address &&
          profile.contact.city &&
          profile.contact.state &&
          profile.contact.zipCode
        ),
        weight: 15,
        category: 'contact'
      },
      {
        id: 'financial_preferences',
        title: 'Wealth & Budget Targets',
        description: 'Monthly income, budget limit & savings target',
        completed: Boolean(
          profile.financial.monthlyIncome > 0 &&
          profile.financial.monthlyBudget > 0 &&
          profile.financial.savingsTarget > 0 &&
          profile.financial.financialGoal
        ),
        weight: 15,
        category: 'financial'
      },
      {
        id: 'linked_accounts',
        title: 'Connected Accounts & Cards',
        description: 'Link at least 2 bank accounts or credit cards',
        completed: profile.accounts.length >= 2,
        weight: 15,
        category: 'financial'
      },
      {
        id: 'security_setup',
        title: 'Security & 2-Factor Auth',
        description: 'Security PIN configured and 2FA enabled',
        completed: Boolean(profile.security.hasPin && profile.security.twoFactorAuth),
        weight: 10,
        category: 'security'
      }
    ];

    const completedWeight = items.reduce((sum, item) => (item.completed ? sum + item.weight : sum), 0);
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const percentage = Math.round((completedWeight / totalWeight) * 100);

    return {
      completionPercentage: percentage,
      completionItems: items
    };
  }, [profile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        completionPercentage,
        completionItems,
        updatePersonal,
        updateContact,
        updateFinancial,
        updateNotifications,
        updateAppearance,
        updateSecurity,
        addAccount,
        updateAccount,
        deleteAccount,
        uploadAvatar,
        removeAvatar,
        exportData,
        importData,
        resetDemoData,
        refreshProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
