import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { validateAndReadImage, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '../../utils/imageValidators';
import { useToast } from '../../context/ToastContext';
import { UploadCloud, Image as ImageIcon, Trash2, Check, AlertCircle } from 'lucide-react';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl?: string;
  fullName: string;
  onSave: (dataUrl: string) => Promise<void>;
  onRemove: () => Promise<void>;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  fullName,
  onSave,
  onRemove
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileSizeText, setFileSizeText] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { success, error } = useToast();

  const handleFileProcess = async (file: File) => {
    setIsProcessing(true);
    const result = await validateAndReadImage(file);
    setIsProcessing(false);

    if (!result.isValid) {
      error('Upload Failed', result.error || 'Invalid image file.');
      return;
    }

    if (result.dataUrl) {
      setPreviewUrl(result.dataUrl);
      setSelectedFileName(file.name);
      setFileSizeText(
        result.compressedSizeKb
          ? `${result.compressedSizeKb} KB (Optimized)`
          : `${(file.size / 1024).toFixed(1)} KB`
      );
      success('Image Ready', 'Click "Apply Photo" to save your profile picture.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    if (!previewUrl) return;
    try {
      setIsProcessing(true);
      await onSave(previewUrl);
      success('Profile Photo Updated', 'Your new photo has been saved.');
      handleClose();
    } catch (err: any) {
      console.error('Save photo error:', err);
      error('Save Failed', err?.message || 'Unable to save profile photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsProcessing(true);
      await onRemove();
      success('Photo Removed', 'Default initials avatar restored.');
      handleClose();
    } catch {
      error('Remove Failed', 'Unable to remove photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setPreviewUrl(null);
    setSelectedFileName(null);
    setFileSizeText(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  const displayImage = previewUrl || currentAvatarUrl;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Profile Picture"
      maxWidth="540px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            {currentAvatarUrl && (
              <button
                type="button"
                className="btn btn-outline"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                onClick={handleRemove}
                disabled={isProcessing}
              >
                <Trash2 size={16} />
                Remove Photo
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={isProcessing}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!previewUrl || isProcessing}
            >
              <Check size={16} />
              {isProcessing ? 'Saving...' : 'Apply Photo'}
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Preview Area */}
        <div className="avatar-preview-box">
          {displayImage ? (
            <img src={displayImage} alt={fullName} className="avatar-preview-img" />
          ) : (
            <div
              className="avatar-preview-img"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-surface)',
                color: 'var(--text-muted)'
              }}
            >
              <ImageIcon size={48} />
            </div>
          )}

          {previewUrl && selectedFileName && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {selectedFileName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {fileSizeText} • Ready to upload
              </div>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />

        {/* Drag & Drop Container */}
        <div
          className={`dropzone-container ${isDragging ? 'drag-active' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud
            size={38}
            style={{ margin: '0 auto 12px', color: isDragging ? 'var(--primary)' : 'var(--text-muted)' }}
          />
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Click to upload, or drag and drop
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Supported formats: JPG, JPEG, PNG (Max {MAX_IMAGE_SIZE_MB}MB)
          </div>
        </div>

        {/* Validation note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            padding: '10px 14px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <AlertCircle size={16} color="var(--primary)" />
          <span>Image is safely stored locally in your browser session for privacy and speed.</span>
        </div>
      </div>
    </Modal>
  );
};
