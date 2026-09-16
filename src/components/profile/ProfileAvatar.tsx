import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { getInitials } from '../../utils/formatters';

interface ProfileAvatarProps {
  avatarUrl?: string;
  fullName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onEditClick?: () => void;
  showStatusDot?: boolean;
  className?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatarUrl,
  fullName,
  size = 'md',
  editable = false,
  onEditClick,
  showStatusDot = false,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(fullName);

  const hasValidImage = Boolean(avatarUrl && avatarUrl.trim().length > 0 && !imageError);

  return (
    <div className={`avatar-container avatar-${size} ${className}`}>
      {hasValidImage ? (
        <img
          src={avatarUrl}
          alt={fullName}
          className="avatar-image"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="avatar-fallback" aria-label={fullName}>
          {initials}
        </div>
      )}

      {showStatusDot && <span className="avatar-status-dot" title="Account Active & Verified" />}

      {editable && (
        <button
          type="button"
          className="avatar-upload-trigger"
          onClick={onEditClick}
          aria-label="Upload or change profile picture"
        >
          <div className="avatar-upload-icon-circle">
            <Camera size={18} />
          </div>
          <span className="avatar-upload-text">Change</span>
        </button>
      )}
    </div>
  );
};
