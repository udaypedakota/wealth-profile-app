import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Check, ArrowRight, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileCompletionProps {
  onCompleteClick: () => void;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onCompleteClick }) => {
  const { completionPercentage, completionItems } = useProfile();

  const handleConfetti = () => {
    if (completionPercentage === 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="completion-card">
      <div className="completion-header-row">
        <div className="completion-score-badge">
          <div
            className="completion-circle-gauge"
            style={{ '--percent': completionPercentage } as React.CSSProperties}
            data-val={`${completionPercentage}%`}
            onClick={handleConfetti}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 className="card-title">Profile Completeness</h3>
              {completionPercentage === 100 ? (
                <span className="verified-badge">
                  <Sparkles size={13} /> 100% Complete
                </span>
              ) : (
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontWeight: 700
                  }}
                >
                  {completionItems.filter((i) => i.completed).length} of {completionItems.length} Milestones
                </span>
              )}
            </div>
            <p className="card-subtitle">
              {completionPercentage === 100
                ? 'Your private banking profile is fully configured and tier verified.'
                : 'Complete all sections to unlock highest tier privileges, automated insights, and advisory.'}
            </p>
            <div className="completion-bar-outer">
              <div className="completion-bar-inner" style={{ width: `${completionPercentage}%` }} />
            </div>
          </div>
        </div>

        {completionPercentage < 100 && (
          <button type="button" className="btn btn-primary" onClick={onCompleteClick}>
            <span>Complete Profile</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      <div className="completion-items-list">
        {completionItems.map((item) => (
          <div key={item.id} className={`completion-item-pill ${item.completed ? 'done' : ''}`}>
            <div className={`completion-check-icon ${item.completed ? 'done' : 'pending'}`}>
              {item.completed && <Check size={12} strokeWidth={3} />}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  color: item.completed ? 'var(--text-primary)' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {item.completed ? 'Verified & Active' : `+${item.weight}% Completeness`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
