import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Sun,
  Moon,
  Landmark,
  CheckCircle2
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { error, success } = useToast();

  const [usernameOrEmail, setUsernameOrEmail] = useState('udaypedakota');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      error('Input Required', 'Please enter your username and password.');
      return;
    }

    try {
      await login(usernameOrEmail.trim(), password.trim());
      success('Welcome back, Uday!', 'Signed into your MoneyMate Private Wealth account.');
    } catch (err: any) {
      error('Authentication Failed', err.message || 'Incorrect credentials. Please verify your password.');
    }
  };



  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-app)',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      {/* Floating Theme Toggle in Top Right */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10 }}>
        <button
          type="button"
          className="nav-icon-btn"
          style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-card)',
            boxShadow: 'var(--shadow-sm)',
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-full)'
          }}
          onClick={toggleTheme}
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {resolvedTheme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#3b82f6" />}
        </button>
      </div>

      {/* Main Luxury Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '980px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-glass-heavy)',
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 1
        }}
      >
        {/* Left Side: Animated Luxury 3D Fintech Visual Art */}
        <div
          style={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%)',
            borderRight: '1px solid var(--border-subtle)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 2px 10px var(--primary-glow)'
                }}
              >
                <Landmark size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  MoneyMate
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Private Wealth
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
              The ultra-clean personal money ledger and daily expense tracking suite designed exclusively for Uday Pedakota.
            </p>
          </div>

          {/* Animated 3D Artwork Image with Floating Animation */}
          <div style={{ margin: '24px 0', textAlign: 'center', position: 'relative' }}>
            <style>{`
              @keyframes floatFintechCard {
                0%, 100% {
                  transform: translateY(0px) rotate(0deg);
                }
                50% {
                  transform: translateY(-8px) rotate(1deg);
                }
              }
              .floating-fintech-img {
                animation: floatFintechCard 4s ease-in-out infinite;
                transition: transform 0.3s ease;
              }
            `}</style>
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                maxWidth: '320px',
                margin: '0 auto'
              }}
            >
              <img
                src="/assets/fintech_auth_hero.jpg"
                alt="MoneyMate Private Wealth"
                className="floating-fintech-img"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: 'var(--radius-lg)'
                }}
              />
            </div>
          </div>

          {/* Cloud Status Footer Badge */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <ShieldCheck size={18} color="#10b981" />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>
              <strong>MongoDB Atlas Cloud Active</strong>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Direct encrypted persistence with cluster0.khqhjse
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean, Stylish Login Form */}
        <div style={{ padding: '44px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                marginBottom: '10px'
              }}
            >
              <Sparkles size={12} />
              <span>Private Access Portal</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Sign In to Your Ledger
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Enter your credentials to manage your daily money updates.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Username / Email */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                Username or Email
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={17}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '40px', fontSize: '0.92rem' }}
                  placeholder="udaypedakota or email"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password with Eye Toggle */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '40px', paddingRight: '42px', fontSize: '0.92rem' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <span>Remember session</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                marginTop: '8px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: '0 4px 18px var(--primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Private Wealth</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
