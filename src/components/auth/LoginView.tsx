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
  Mail,
  Phone,
  UserPlus,
  CheckCircle2
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, register, isLoading } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { error, success } = useToast();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  // Sign In States
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register States
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      error('Input Required', 'Please enter your username and password.');
      return;
    }

    try {
      await login(usernameOrEmail.trim(), password.trim());
      success('Welcome back!', 'Signed into your MoneyMate Private Wealth account.');
    } catch (err: any) {
      error('Authentication Failed', err.message || 'Incorrect credentials. Please verify your password.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim()) {
      error('Full Name Required', 'Please enter your full name.');
      return;
    }
    if (!regUsername.trim()) {
      error('Username Required', 'Please choose a username.');
      return;
    }
    if (regPassword.length < 4) {
      error('Password Too Short', 'Password must be at least 4 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      error('Password Mismatch', 'Passwords do not match. Please re-enter.');
      return;
    }

    try {
      await register({
        fullName: regFullName.trim(),
        username: regUsername.trim().toLowerCase(),
        email: regEmail.trim().toLowerCase() || `${regUsername.trim().toLowerCase()}@moneymate.app`,
        mobile: regMobile.trim(),
        password: regPassword.trim()
      });
      success('Account Created Successfully!', `Welcome to MoneyMate, ${regFullName}! Your isolated personal workspace is ready.`);
    } catch (err: any) {
      error('Registration Failed', err.message || 'Could not create account. Username or email may already be taken.');
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
          maxWidth: '1000px',
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
                  Private Wealth Network
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
              The ultra-clean personal money ledger & daily expense tracking suite with private isolated workspaces for you and your friends.
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
              <strong>MongoDB Atlas Multi-Tenant Isolated</strong>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Each member receives a 100% private, encrypted ledger
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Switcher & Clean Modern Form */}
        <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Tab Switcher Header */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-card)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px'
            }}
          >
            <button
              type="button"
              onClick={() => setMode('signin')}
              style={{
                flex: 1,
                padding: '9px 16px',
                fontSize: '0.86rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'calc(var(--radius-md) - 2px)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: mode === 'signin' ? 'var(--primary-gradient)' : 'transparent',
                color: mode === 'signin' ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: mode === 'signin' ? '0 2px 8px var(--primary-glow)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              style={{
                flex: 1,
                padding: '9px 16px',
                fontSize: '0.86rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'calc(var(--radius-md) - 2px)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: mode === 'register' ? 'var(--primary-gradient)' : 'transparent',
                color: mode === 'register' ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: mode === 'register' ? '0 2px 8px var(--primary-glow)' : 'none'
              }}
            >
              Create Account
            </button>
          </div>

          {mode === 'signin' ? (
            /* ================= SIGN IN VIEW ================= */
            <div>
              <div style={{ marginBottom: '24px' }}>
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
                    marginBottom: '8px'
                  }}
                >
                  <Sparkles size={12} />
                  <span>Private Access Portal</span>
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                  Sign In to Your Ledger
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Enter your credentials to access your financial dashboard.
                </p>
              </div>

              <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                      placeholder="Username or email address"
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
                    marginTop: '6px',
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

                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  New friend or member?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Create your account &rarr;
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ================= CREATE ACCOUNT / SIGN UP VIEW ================= */
            <div>
              <div style={{ marginBottom: '20px' }}>
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
                    marginBottom: '8px'
                  }}
                >
                  <UserPlus size={12} />
                  <span>Free Member Registration</span>
                </div>
                <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                  Create Your Private Ledger
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Start tracking your expenses, chits, EMIs, and credit cards in 100% privacy.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User
                      size={16}
                      style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
                      placeholder="e.g. Ravi Kumar"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Username & Email in 2 columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                      Username *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.88rem' }}
                      placeholder="e.g. ravikumar"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                      Mobile (Optional)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone
                        size={15}
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                      />
                      <input
                        type="tel"
                        className="form-input"
                        style={{ paddingLeft: '34px', fontSize: '0.88rem' }}
                        placeholder="9876543210"
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                    Email Address (Optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={16}
                      style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    />
                    <input
                      type="email"
                      className="form-input"
                      style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
                      placeholder="ravi@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                      Create Password *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={regShowPassword ? 'text' : 'password'}
                        className="form-input"
                        style={{ fontSize: '0.88rem', paddingRight: '32px' }}
                        placeholder="Min 4 chars"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                        onClick={() => setRegShowPassword(!regShowPassword)}
                      >
                        {regShowPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                      Confirm Password *
                    </label>
                    <input
                      type={regShowPassword ? 'text' : 'password'}
                      className="form-input"
                      style={{ fontSize: '0.88rem' }}
                      placeholder="Repeat password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Features Checkmarks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '4px 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="#10b981" />
                    <span>Instant private workspace (Starter Cash & Bank accounts included)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="#10b981" />
                    <span>Your records and balances are completely private to your login</span>
                  </div>
                </div>

                {/* Register Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    marginTop: '4px',
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
                    <span>Creating your workspace...</span>
                  ) : (
                    <>
                      <span>Create My Private Account</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Sign In here &rarr;
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
