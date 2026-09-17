import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useProfile } from '../../context/ProfileContext';
import { useToast } from '../../context/ToastContext';
import {
  PersonalInformation,
  ContactInformation,
  FinancialPreferences,
  Gender,
  CurrencyCode
} from '../../types/profile';
import { User, Mail, Landmark, Check } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'personal' | 'contact' | 'financial';
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'personal'
}) => {
  const { profile, updateProfileData } = useProfile();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'financial'>(initialTab);

  // Local form states
  const [personalData, setPersonalData] = useState<PersonalInformation>(profile.personal);
  const [contactData, setContactData] = useState<ContactInformation>(profile.contact);
  const [financialData, setFinancialData] = useState<FinancialPreferences>(profile.financial);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state whenever modal opens or profile changes
  useEffect(() => {
    if (isOpen) {
      setPersonalData(profile.personal);
      setContactData(profile.contact);
      setFinancialData(profile.financial);
      setActiveTab(initialTab);
    }
  }, [isOpen, profile, initialTab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!personalData.fullName.trim()) {
      error('Validation Error', 'Full legal name is required.');
      setActiveTab('personal');
      return;
    }
    if (!contactData.email.trim() || !contactData.email.includes('@')) {
      error('Validation Error', 'A valid email address is required.');
      setActiveTab('contact');
      return;
    }
    if (!contactData.mobile.trim()) {
      error('Validation Error', 'Primary mobile number is required.');
      setActiveTab('contact');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProfileData({
        personal: personalData,
        contact: contactData,
        financial: financialData
      });

      success('Profile Saved', 'Your changes have been saved to MongoDB Atlas cloud and applied across devices.');
      onClose();
    } catch {
      error('Save Failed', 'Could not save profile updates. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Client Profile"
      maxWidth="720px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isSubmitting}>
            <Check size={16} />
            <span>{isSubmitting ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>
        </>
      }
    >
      <div>
        {/* Modal Tabs Header */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <User size={16} />
            <span>Personal Info</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <Mail size={16} />
            <span>Contact & Address</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'financial' ? 'active' : ''}`}
            onClick={() => setActiveTab('financial')}
          >
            <Landmark size={16} />
            <span>Financial Preferences</span>
          </button>
        </div>

        {/* Tab 1: Personal Info */}
        {activeTab === 'personal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Full Legal Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={personalData.fullName}
                  onChange={(e) => {
                    const fullName = e.target.value;
                    const parts = fullName.trim().split(' ');
                    setPersonalData({
                      ...personalData,
                      fullName,
                      firstName: parts[0] || personalData.firstName,
                      lastName: parts.slice(1).join(' ') || personalData.lastName
                    });
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Username *</label>
                <input
                  type="text"
                  className="form-input"
                  value={personalData.username}
                  onChange={(e) => setPersonalData({ ...personalData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={personalData.firstName}
                  onChange={(e) => setPersonalData({ ...personalData, firstName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={personalData.lastName}
                  onChange={(e) => setPersonalData({ ...personalData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-input"
                  value={personalData.dateOfBirth}
                  onChange={(e) => setPersonalData({ ...personalData, dateOfBirth: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={personalData.gender}
                  onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value as Gender })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Biographical Note / About Me</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={personalData.bio}
                onChange={(e) => setPersonalData({ ...personalData, bio: e.target.value })}
                placeholder="Brief summary of your background, portfolio interests, or family office..."
              />
            </div>
          </div>
        )}

        {/* Tab 2: Contact & Address */}
        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Primary Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Mobile Phone *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={contactData.mobile}
                  onChange={(e) => setContactData({ ...contactData, mobile: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Alternate Mobile / WhatsApp</label>
                <input
                  type="tel"
                  className="form-input"
                  value={contactData.altMobile}
                  onChange={(e) => setContactData({ ...contactData, altMobile: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">PIN / ZIP Postal Code *</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactData.zipCode}
                  onChange={(e) => setContactData({ ...contactData, zipCode: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Street Address & Landmark</label>
              <input
                type="text"
                className="form-input"
                value={contactData.address}
                onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                placeholder="Suite, building, street..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactData.city}
                  onChange={(e) => setContactData({ ...contactData, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State / Province</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactData.state}
                  onChange={(e) => setContactData({ ...contactData, state: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactData.country}
                  onChange={(e) => setContactData({ ...contactData, country: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Financial Preferences */}
        {activeTab === 'financial' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Operating Currency</label>
                <select
                  className="form-select"
                  value={financialData.currency}
                  onChange={(e) => {
                    const curr = e.target.value as CurrencyCode;
                    const symbols: Record<string, string> = {
                      INR: '₹',
                      USD: '$',
                      EUR: '€',
                      GBP: '£',
                      AED: 'AED',
                      SGD: 'S$'
                    };
                    setFinancialData({
                      ...financialData,
                      currency: curr,
                      currencySymbol: symbols[curr] || '₹'
                    });
                  }}
                >
                  <option value="INR">Indian Rupee (₹ INR)</option>
                  <option value="USD">US Dollar ($ USD)</option>
                  <option value="EUR">Euro (€ EUR)</option>
                  <option value="GBP">British Pound (£ GBP)</option>
                  <option value="AED">UAE Dirham (AED)</option>
                  <option value="SGD">Singapore Dollar (S$ SGD)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Default Payment Rail</label>
                <select
                  className="form-select"
                  value={financialData.preferredPaymentMethod}
                  onChange={(e) =>
                    setFinancialData({
                      ...financialData,
                      preferredPaymentMethod: e.target.value as any
                    })
                  }
                >
                  <option value="UPI">UPI Instant Rails</option>
                  <option value="Net Banking">Net Banking / IMPS</option>
                  <option value="Auto-Debit">Automated e-Mandate (NACH)</option>
                  <option value="Credit Card">Corporate / Metal Credit Card</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Monthly Inflow ({financialData.currencySymbol})</label>
                <input
                  type="number"
                  className="form-input"
                  value={financialData.monthlyIncome}
                  onChange={(e) =>
                    setFinancialData({ ...financialData, monthlyIncome: Number(e.target.value) })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expense Budget ({financialData.currencySymbol})</label>
                <input
                  type="number"
                  className="form-input"
                  value={financialData.monthlyBudget}
                  onChange={(e) =>
                    setFinancialData({ ...financialData, monthlyBudget: Number(e.target.value) })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Savings ({financialData.currencySymbol})</label>
                <input
                  type="number"
                  className="form-input"
                  value={financialData.savingsTarget}
                  onChange={(e) =>
                    setFinancialData({ ...financialData, savingsTarget: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Risk Appetite</label>
                <select
                  className="form-select"
                  value={financialData.riskAppetite}
                  onChange={(e) =>
                    setFinancialData({ ...financialData, riskAppetite: e.target.value as any })
                  }
                >
                  <option value="Conservative">Conservative (Capital Preservation)</option>
                  <option value="Moderate">Moderate (Balanced Yield & Growth)</option>
                  <option value="Aggressive">Aggressive (High Alpha & Equities)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tax Filing Status</label>
                <select
                  className="form-select"
                  value={financialData.taxFilingStatus}
                  onChange={(e) =>
                    setFinancialData({ ...financialData, taxFilingStatus: e.target.value as any })
                  }
                >
                  <option value="Individual">Individual Resident</option>
                  <option value="HUF">Hindu Undivided Family (HUF)</option>
                  <option value="Corporate">Corporate / Private Trust</option>
                  <option value="Non-Resident">Non-Resident Indian (NRI)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Core Financial Milestone / Goal Description</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={financialData.financialGoal}
                onChange={(e) => setFinancialData({ ...financialData, financialGoal: e.target.value })}
                placeholder="e.g. Commercial real-estate portfolio acquisition & early financial freedom"
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
