import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useProfile } from '../../context/ProfileContext';
import { ThemeMode, DashboardDensity, AccentColor } from '../../types/profile';
import { useToast } from '../../context/ToastContext';
import { Moon, Sun, Monitor, Sliders, Palette, Check, LayoutDashboard } from 'lucide-react';

export const AppearanceSettings: React.FC = () => {
  const { theme, setTheme, density, setDensity, accent, setAccent } = useTheme();
  const { profile, updateAppearance } = useProfile();
  const { success } = useToast();

  const handleThemeChange = async (newTheme: ThemeMode) => {
    setTheme(newTheme);
    await updateAppearance({
      ...profile.appearance,
      theme: newTheme
    });
    success('Theme Updated', `Switched to ${newTheme} mode.`);
  };

  const handleDensityChange = async (newDensity: DashboardDensity) => {
    setDensity(newDensity);
    await updateAppearance({
      ...profile.appearance,
      density: newDensity
    });
    success('Density Updated', `Display density set to ${newDensity}.`);
  };

  const handleAccentChange = async (newAccent: AccentColor) => {
    setAccent(newAccent);
    await updateAppearance({
      ...profile.appearance,
      accentColor: newAccent
    });
    success('Accent Palette Updated', `Applied ${newAccent} accent color.`);
  };

  const handleTabChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tab = e.target.value;
    await updateAppearance({
      ...profile.appearance,
      defaultTab: tab
    });
    success('Default View Saved', `Default tab set to ${tab}.`);
  };

  const themeOptions: Array<{ mode: ThemeMode; label: string; icon: React.ReactNode; desc: string }> = [
    {
      mode: 'dark',
      label: 'Obsidian Dark',
      icon: <Moon size={20} color="#38bdf8" />,
      desc: 'High-contrast luxury dark surface with subtle ambient glow'
    },
    {
      mode: 'light',
      label: 'Pearl Light',
      icon: <Sun size={20} color="#f59e0b" />,
      desc: 'Crisp daylight interface with soft card elevations'
    },
    {
      mode: 'system',
      label: 'System Sync',
      icon: <Monitor size={20} color="#a855f7" />,
      desc: 'Matches your operating system day / night schedule'
    }
  ];

  const densityOptions: Array<{ mode: DashboardDensity; label: string; desc: string }> = [
    { mode: 'compact', label: 'Compact', desc: 'Higher data density, reduced card padding for power users' },
    { mode: 'comfortable', label: 'Comfortable', desc: 'Standard balanced spacing with optimal legibility' },
    { mode: 'spacious', label: 'Spacious', desc: 'Generous breathing room and larger typography scale' }
  ];

  const accentColors: Array<{ color: AccentColor; hex: string; label: string }> = [
    { color: 'emerald', hex: '#10b981', label: 'Emerald Wealth' },
    { color: 'sapphire', hex: '#3b82f6', label: 'Royal Sapphire' },
    { color: 'gold', hex: '#f59e0b', label: 'Centurion Gold' },
    { color: 'violet', hex: '#8b5cf6', label: 'Imperial Violet' },
    { color: 'cyan', hex: '#06b6d4', label: 'Cyber Cyan' }
  ];

  return (
    <div className="premium-card glow-hover">
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="card-icon-bubble">
            <Palette size={22} />
          </div>
          <div>
            <h3 className="card-title">Appearance & Display Settings</h3>
            <p className="card-subtitle">
              Personalize visual interface themes, color palettes, and information density
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Theme Mode Selection */}
        <div>
          <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
            Visual Color Theme
          </h4>
          <div className="card-grid-3col">
            {themeOptions.map((opt) => (
              <div
                key={opt.mode}
                onClick={() => handleThemeChange(opt.mode)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${theme === opt.mode ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  background: theme === opt.mode ? 'var(--primary-light)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  {opt.icon}
                  {theme === opt.mode && <Check size={18} color="var(--primary)" />}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                  {opt.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accent Color Palettes */}
        <div>
          <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
            Primary Accent Palette
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {accentColors.map((item) => (
              <button
                key={item.color}
                type="button"
                onClick={() => handleAccentChange(item.color)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface)',
                  border: `2px solid ${accent === item.color ? item.hex : 'var(--border-subtle)'}`,
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: item.hex,
                    display: 'inline-block',
                    boxShadow: `0 0 8px ${item.hex}80`
                  }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.label}
                </span>
                {accent === item.color && <Check size={14} color={item.hex} />}
              </button>
            ))}
          </div>
        </div>

        {/* Display Density */}
        <div>
          <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
            Information Density
          </h4>
          <div className="card-grid-3col">
            {densityOptions.map((opt) => (
              <div
                key={opt.mode}
                onClick={() => handleDensityChange(opt.mode)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${density === opt.mode ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  background: density === opt.mode ? 'var(--primary-light)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Sliders size={18} color="var(--primary)" />
                  {density === opt.mode && <Check size={18} color="var(--primary)" />}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                  {opt.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred Initial Tab */}
        <div style={{ maxWidth: '380px' }}>
          <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Preferred Landing Tab
          </h4>
          <select
            className="form-select"
            value={profile.appearance.defaultTab || 'overview'}
            onChange={handleTabChange}
          >
            <option value="overview">Overview & Ledger Statistics</option>
            <option value="personal">Personal & Identity Information</option>
            <option value="financial">Financial Profile & Accounts</option>
            <option value="security">Security & Active Devices</option>
            <option value="preferences">Preferences & My Data</option>
          </select>
        </div>
      </div>
    </div>
  );
};
