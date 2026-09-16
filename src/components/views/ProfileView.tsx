import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { ProfileHeader } from '../profile/ProfileHeader';
import { ProfileCompletion } from '../profile/ProfileCompletion';
import { ProfileInfoCard } from '../profile/ProfileInfoCard';
import { ContactInfoCard } from '../profile/ContactInfoCard';
import { EditProfileModal } from '../profile/EditProfileModal';

export const ProfileView: React.FC = () => {
  const { profile } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState<'personal' | 'contact'>('personal');

  const handleOpenEdit = (tab: 'personal' | 'contact' = 'personal') => {
    setEditTab(tab);
    setIsEditModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Luxury Master Profile Header */}
      <ProfileHeader onEditClick={() => handleOpenEdit('personal')} />

      {/* Dynamic Profile Completion Gauge */}
      <ProfileCompletion onCompleteClick={() => handleOpenEdit('personal')} />

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
    </div>
  );
};
