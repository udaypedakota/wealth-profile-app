import React from 'react';
import {
  LayoutDashboard,
  User,
  Landmark,
  ShieldCheck,
  Settings2,
  PieChart
} from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview & Statistics', icon: <PieChart size={16} /> },
    { id: 'personal', label: 'Personal & Contact Details', icon: <User size={16} /> },
    { id: 'financial', label: 'Financial Profile & Accounts', icon: <Landmark size={16} /> },
    { id: 'security', label: 'Security & Active Devices', icon: <ShieldCheck size={16} /> },
    { id: 'preferences', label: 'Preferences & My Data', icon: <Settings2 size={16} /> }
  ];

  return (
    <div className="tab-nav-wrapper">
      <div className="tab-nav-list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
