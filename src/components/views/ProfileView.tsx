import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { ProfileHeader } from '../profile/ProfileHeader';
import { ProfileCompletion } from '../profile/ProfileCompletion';
import { ProfileInfoCard } from '../profile/ProfileInfoCard';
import { ContactInfoCard } from '../profile/ContactInfoCard';
import { EditProfileModal } from '../profile/EditProfileModal';
import { AccountSummary } from '../profile/AccountSummary';
import { Modal } from '../common/Modal';

interface ProfileViewProps {
  onNavigateTab?: (tabId: any) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigateTab }) => {
  const { profile, addAccount, updateAccount, deleteAccount } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
  const [editTab, setEditTab] = useState<'personal' | 'contact'>('personal');

  const handleOpenEdit = (tab: 'personal' | 'contact' = 'personal') => {
    setEditTab(tab);
    setIsEditModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Luxury Master Profile Header with Clickable Stats */}
      <ProfileHeader
        onEditClick={() => handleOpenEdit('personal')}
        onNavigateTab={onNavigateTab}
        onOpenAccounts={() => setIsAccountsModalOpen(true)}
      />

      {/* Dynamic Profile Completion Gauge */}
      <ProfileCompletion onCompleteClick={() => handleOpenEdit('personal')} />

      {/* Connected Accounts & Cards Section */}
      <div id="connected-accounts-section">
        <AccountSummary
          accounts={profile.accounts}
          currency={profile.financial.currency}
          onAddAccount={addAccount}
          onUpdateAccount={updateAccount}
          onDeleteAccount={deleteAccount}
        />
      </div>

      {/* Personal & Contact Details Cards */}
      <div className="card-grid-2col">
        <ProfileInfoCard
          personal={profile.personal}
          onEditClick={() => handleOpenEdit('personal')}
        />
        <ContactInfoCard
          contact={profile.contact}
          onEditClick={() => handleOpenEdit('contact')}
        />
      </div>

      {/* Master Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTab={editTab}
      />

      {/* Connected Accounts Quick Modal (Opened when clicking Connected Accounts in Header Stats) */}
      <Modal
        isOpen={isAccountsModalOpen}
        onClose={() => setIsAccountsModalOpen(false)}
        title="Manage Connected Accounts & Cards"
        maxWidth="820px"
      >
        <div style={{ padding: '4px 0' }}>
          <AccountSummary
            accounts={profile.accounts}
            currency={profile.financial.currency}
            onAddAccount={addAccount}
            onUpdateAccount={updateAccount}
            onDeleteAccount={deleteAccount}
            isModal={true}
          />
        </div>
      </Modal>
    </div>
  );
};
