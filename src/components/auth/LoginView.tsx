import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sun,
  Moon,
  Landmark,
  CheckCircle2,
  FileText,
  LineChart,
  Target
} from 'lucide-react';

// ============================================================================
// 1. POTTED PLANT ARTWORK (Supports Desktop & Mobile Views)
// ============================================================================
const PottedPlant: React.FC<{ variant?: 'desktop' | 'mobile' }> = ({ variant = 'desktop' }) => {
  if (variant === 'mobile') {
    return (
      <div
        style={{
          position: 'absolute',
          right: '14px',
          top: '-86px',
          width: '68px',
          height: '130px',
          pointerEvents: 'none',
          zIndex: 12
        }}
      >
        <svg viewBox="0 0 130 240" fill="none" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 8px 18px rgba(15, 23, 42, 0.22))' }}>
          {/* Plant Leaves */}
          <path d="M65 170 C65 110 60 50 65 24 C72 50 78 110 65 170 Z" fill="#14b8a6" opacity="0.95" />
          <path d="M65 24 C60 55 58 115 65 170 C64 125 61 70 65 24 Z" fill="#0d9488" opacity="0.4" />

          {/* Top Left Leaf */}
          <path d="M65 155 C52 110 28 75 14 68 C12 88 28 128 55 160 Z" fill="#2dd4bf" opacity="0.9" />
          <path d="M65 155 C55 125 36 95 14 68 C24 85 45 120 65 155 Z" fill="#0f766e" opacity="0.25" />

          {/* Top Right Leaf */}
          <path d="M65 155 C78 110 102 75 116 68 C118 88 102 128 75 160 Z" fill="#2dd4bf" opacity="0.9" />
          <path d="M65 155 C75 125 94 95 116 68 C106 85 85 120 65 155 Z" fill="#0f766e" opacity="0.25" />

          {/* Mid Left Leaf */}
          <path d="M65 168 C44 140 16 118 6 120 C8 138 30 158 58 172 Z" fill="#14b8a6" opacity="0.92" />
          {/* Mid Right Leaf */}
          <path d="M65 168 C86 140 114 118 124 120 C122 138 100 158 72 172 Z" fill="#14b8a6" opacity="0.92" />

          {/* Ceramic White Planter Pot */}
          <path d="M44 170 L86 170 L81 230 L49 230 Z" fill="#ffffff" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.12))" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="41" y="166" width="48" height="7" rx="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <ellipse cx="65" cy="232" rx="20" ry="4" fill="rgba(15, 23, 42, 0.16)" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="login-plant-wrapper"
      style={{
        position: 'absolute',
        right: '-88px',
        bottom: '12px',
        width: '125px',
        height: '240px',
        pointerEvents: 'none',
        zIndex: 10
      }}
    >
      <svg viewBox="0 0 130 240" fill="none" style={{ width: '100%', height: '100%' }}>
        {/* Plant Leaves */}
        {/* Tall central leaf */}
        <path d="M65 170 C65 110 60 50 65 24 C72 50 78 110 65 170 Z" fill="#14b8a6" opacity="0.95" />
        <path d="M65 24 C60 55 58 115 65 170 C64 125 61 70 65 24 Z" fill="#0d9488" opacity="0.4" />

        {/* Top Left Leaf */}
        <path d="M65 155 C52 110 28 75 14 68 C12 88 28 128 55 160 Z" fill="#2dd4bf" opacity="0.9" />
        <path d="M65 155 C55 125 36 95 14 68 C24 85 45 120 65 155 Z" fill="#0f766e" opacity="0.25" />

        {/* Top Right Leaf */}
        <path d="M65 155 C78 110 102 75 116 68 C118 88 102 128 75 160 Z" fill="#2dd4bf" opacity="0.9" />
        <path d="M65 155 C75 125 94 95 116 68 C106 85 85 120 65 155 Z" fill="#0f766e" opacity="0.25" />

        {/* Mid Left Leaf */}
        <path d="M65 168 C44 140 16 118 6 120 C8 138 30 158 58 172 Z" fill="#14b8a6" opacity="0.92" />

        {/* Mid Right Leaf */}
        <path d="M65 168 C86 140 114 118 124 120 C122 138 100 158 72 172 Z" fill="#14b8a6" opacity="0.92" />

        {/* Ceramic White Planter Pot */}
        <path d="M44 170 L86 170 L81 230 L49 230 Z" fill="#ffffff" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.08))" stroke="#e2e8f0" strokeWidth="1.5" />
        {/* Pot Rim */}
        <rect x="41" y="166" width="48" height="7" rx="3.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.2" />
        {/* Pot Shadow */}
        <ellipse cx="65" cy="232" rx="20" ry="4" fill="rgba(15, 23, 42, 0.08)" />
      </svg>
    </div>
  );
};

// ============================================================================
// 2. CENTER FINTECH GRAPHIC (Blue card with curve graph + 4 floating badges)
// ============================================================================
const FintechCenterArt: React.FC = () => (
  <div style={{ position: 'relative', width: '380px', height: '220px', margin: '8px 0' }}>
    {/* Floating Ambient Circles */}
    <div
      style={{
        position: 'absolute',
        top: '-15px',
        left: '-15px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(56, 189, 248, 0.22)',
        filter: 'blur(4px)'
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '-15px',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: 'rgba(186, 230, 253, 0.35)',
        filter: 'blur(3px)'
      }}
    />

    {/* Main Royal Blue Floating Card */}
    <div
      className="anim-desktop-card"
      style={{
        position: 'absolute',
        left: '25px',
        top: '15px',
        width: '320px',
        height: '185px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #0284c7 0%, #0052cc 50%, #1e40af 100%)',
        boxShadow: '0 20px 42px rgba(9, 92, 229, 0.38)',
        padding: '18px 20px',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid rgba(255, 255, 255, 0.28)',
        transform: 'rotate(-2deg)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.05em' }}>MONEYMATE</div>
          <div style={{ fontSize: '0.62rem', opacity: 0.85, letterSpacing: '0.04em' }}>YOUR WEALTH JOURNEY</div>
        </div>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Landmark size={15} />
        </div>
      </div>

      {/* Upward Line Graph with Gradient Area & Bars matching Image 1 */}
      <div style={{ position: 'relative', width: '100%', height: '80px', margin: '4px 0' }}>
        <svg viewBox="0 0 280 80" fill="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          {/* Under-bars */}
          <rect x="25" y="55" width="12" height="25" rx="3" fill="url(#barGrad)" />
          <rect x="70" y="45" width="12" height="35" rx="3" fill="url(#barGrad)" />
          <rect x="115" y="38" width="12" height="42" rx="3" fill="url(#barGrad)" />
          <rect x="160" y="28" width="12" height="52" rx="3" fill="url(#barGrad)" />
          <rect x="205" y="16" width="12" height="64" rx="3" fill="url(#barGrad)" />
          <rect x="250" y="6" width="12" height="74" rx="3" fill="#ffffff" opacity="0.9" />

          {/* Area under curve */}
          <path
            d="M 10 70 Q 70 65 120 45 T 255 12 L 255 80 L 10 80 Z"
            fill="url(#chartAreaGrad)"
          />

          {/* Glowing smooth growth curve */}
          <path
            d="M 10 70 Q 70 65 120 45 T 255 12"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="drop-shadow(0 2px 6px rgba(255, 255, 255, 0.5))"
          />

          {/* Glowing Growth Dots */}
          <circle cx="10" cy="70" r="3.5" fill="#ffffff" />
          <circle cx="120" cy="45" r="3.5" fill="#ffffff" />
          <circle cx="190" cy="24" r="3.5" fill="#ffffff" />
          <circle cx="255" cy="12" r="5" fill="#ffffff" stroke="#0052cc" strokeWidth="2" />
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', opacity: 0.9 }}>
        <span>₹ 45,000 Inflow</span>
        <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.62rem' }}>
          Active Vault
        </span>
      </div>
    </div>

    {/* 1. Top Left Tile: Mint Squircle with Green Trending Arrow */}
    <div
      className="anim-desktop-badge-tl"
      style={{
        position: 'absolute',
        left: '2px',
        top: '2px',
        width: '46px',
        height: '46px',
        borderRadius: '14px',
        background: '#ffffff',
        boxShadow: '0 10px 24px rgba(16, 185, 129, 0.22), 0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'rotate(-8deg)',
        zIndex: 10
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          background: '#dcfce7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#10b981'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      </div>
    </div>

    {/* 2. Top Right Tile: Soft Blue Squircle with 3D Wallet */}
    <div
      className="anim-desktop-wallet"
      style={{
        position: 'absolute',
        right: '25px',
        top: '-8px',
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: '#ffffff',
        boxShadow: '0 10px 24px rgba(2, 132, 199, 0.22), 0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid rgba(2, 132, 199, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'rotate(6deg)',
        zIndex: 10
      }}
    >
      <div
        style={{
          width: '34px',
          height: '24px',
          borderRadius: '6px',
          background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '4px',
          boxShadow: '0 2px 6px rgba(2, 132, 199, 0.4)'
        }}
      >
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
      </div>
    </div>

    {/* 3. Bottom Right Tile: 3D Golden Rupee Coin */}
    <div
      className="anim-desktop-coin"
      style={{
        position: 'absolute',
        right: '8px',
        bottom: '40px',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        boxShadow: '0 10px 20px rgba(217, 119, 6, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: 800,
        fontSize: '1.2rem',
        border: '2.5px solid #fef3c7',
        transform: 'rotate(10deg)',
        zIndex: 10
      }}
    >
      ₹
    </div>

    {/* 4. Bottom Left Tile: White Squircle with Blue Doc */}
    <div
      className="anim-desktop-doc"
      style={{
        position: 'absolute',
        left: '32px',
        bottom: '-10px',
        width: '44px',
        height: '44px',
        borderRadius: '13px',
        background: '#ffffff',
        boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0284c7',
        transform: 'rotate(-4deg)',
        zIndex: 10
      }}
    >
      <FileText size={20} />
    </div>
  </div>
);

// ============================================================================
// 3. 3D WALLET & COINS ILLUSTRATION (For Mobile View)
// ============================================================================
const WalletArt: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <div style={{ position: 'relative', width: `${size}px`, height: `${size * 0.78}px`, margin: '0 auto' }}>
    <svg viewBox="0 0 220 170" fill="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      {/* Background Soft Glow */}
      <circle className="anim-glow-pulse" cx="110" cy="85" r="75" fill="rgba(56, 189, 248, 0.22)" filter="blur(22px)" />

      {/* Tropical Green Leaves behind wallet */}
      <path className="anim-leaf-left" d="M48 85 C22 45 36 15 75 12 C68 45 62 72 48 85 Z" fill="#2dd4bf" opacity="0.95" />
      <path d="M48 85 C32 55 45 30 75 12 C65 40 58 68 48 85 Z" fill="#0f766e" opacity="0.35" />
      <path d="M52 105 C18 90 14 60 42 42 C48 68 52 90 52 105 Z" fill="#14b8a6" opacity="0.95" />
      <path className="anim-leaf-right" d="M172 85 C198 45 184 15 145 12 C152 45 158 72 172 85 Z" fill="#2dd4bf" opacity="0.95" />
      <path d="M172 85 C188 55 175 30 145 12 C155 40 162 68 172 85 Z" fill="#0f766e" opacity="0.35" />
      <path d="M168 105 C202 90 206 60 178 42 C172 68 168 90 168 105 Z" fill="#14b8a6" opacity="0.95" />

      {/* Gold Coin Top Right */}
      <g className="anim-coin-1" transform="translate(140, 24)">
        <circle cx="24" cy="24" r="22" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="2.5" filter="drop-shadow(0 6px 12px rgba(217, 119, 6, 0.35))" />
        <circle cx="24" cy="24" r="18" fill="none" stroke="#fef3c7" strokeWidth="1" strokeDasharray="3 2" />
        <text x="24" y="30" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="800" fontFamily="sans-serif">₹</text>
      </g>

      {/* Gold Coin Bottom Right */}
      <g className="anim-coin-2" transform="translate(158, 98)">
        <circle cx="20" cy="20" r="18" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="2" filter="drop-shadow(0 4px 8px rgba(217, 119, 6, 0.35))" />
        <text x="20" y="25" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="sans-serif">₹</text>
      </g>

      {/* Gold Coin Bottom Left */}
      <g className="anim-coin-3" transform="translate(24, 98)">
        <circle cx="18" cy="18" r="16" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="2" filter="drop-shadow(0 4px 8px rgba(217, 119, 6, 0.3))" />
        <text x="18" y="23" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800" fontFamily="sans-serif">₹</text>
      </g>

      {/* 3D Blue Leather Wallet */}
      <g className="anim-wallet" transform="translate(46, 36) rotate(-3)">
        {/* Wallet Back Body */}
        <rect x="0" y="6" width="124" height="86" rx="16" fill="#1d4ed8" filter="drop-shadow(0 14px 28px rgba(9, 92, 229, 0.38))" />

        {/* Credit Card Peeking Out */}
        <rect className="anim-card-peek" x="16" y="-12" width="92" height="52" rx="8" fill="linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)" stroke="#ffffff" strokeWidth="1.2" />
        <rect x="24" y="-4" width="22" height="5" rx="2" fill="#ffffff" opacity="0.75" />

        {/* Wallet Front Flap */}
        <rect x="0" y="16" width="124" height="76" rx="16" fill="url(#walletGrad)" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.5" />

        {/* Curved Pocket Line */}
        <path d="M0 28 Q62 48 124 28 L124 44 Q62 64 0 44 Z" fill="#2563eb" opacity="0.55" />

        {/* Clasp / Metal Button */}
        <g transform="translate(56, 54)">
          <rect x="0" y="0" width="20" height="20" rx="10" fill="#1e40af" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="5" fill="#60a5fa" />
        </g>
      </g>

      {/* Gradients */}
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// ============================================================================
// 4. MAIN LOGIN VIEW COMPONENT
// ============================================================================
export const LoginView: React.FC = () => {
  const { login, register, isLoading } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { error, success } = useToast();

  const isDark = resolvedTheme === 'dark';
  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  // Sign In inputs
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register inputs
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
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
      success('Signed In', 'Welcome to MoneyMate Private Wealth.');
    } catch (err: any) {
      error('Authentication Failed', err.message || 'Incorrect credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regUsername.trim() || !regPassword.trim()) {
      error('Required Fields', 'Please fill in your name, username, and password.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      error('Password Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      await register({
        fullName: regFullName.trim(),
        username: regUsername.trim().toLowerCase(),
        email: regEmail.trim().toLowerCase() || `${regUsername.trim().toLowerCase()}@moneymate.app`,
        password: regPassword.trim()
      });
      success('Account Created', `Welcome to MoneyMate, ${regFullName}!`);
    } catch (err: any) {
      error('Registration Failed', err.message || 'Could not create account.');
    }
  };

  return (
    <div
      className="login-container-root"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 65% 35%, #0b1933 0%, #060c18 55%, #030712 100%)'
          : 'linear-gradient(135deg, #e0f2fe 0%, #edf5ff 35%, #f1f7ff 70%, #e2eefd 100%)',
        color: isDark ? '#f8fafc' : '#0f294a',
        transition: 'background 0.35s ease, color 0.35s ease'
      }}
    >
      {/* Decorative Flowing Wave Ribbons & Floating Bubbles (Desktop Only) */}
      <div
        className="desktop-only-waves"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%' }}
        >
          <path
            d="M 320 520 C 480 440 640 330 840 370 C 1040 410 1190 330 1440 280"
            stroke={isDark ? "rgba(56, 189, 248, 0.12)" : "rgba(56, 189, 248, 0.4)"}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 340 550 C 500 470 660 360 860 400 C 1060 440 1210 360 1440 310"
            stroke={isDark ? "rgba(37, 99, 235, 0.1)" : "rgba(37, 99, 235, 0.25)"}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 360 580 C 520 500 680 390 880 430 C 1080 470 1230 390 1440 340"
            stroke={isDark ? "rgba(56, 189, 248, 0.08)" : "rgba(56, 189, 248, 0.22)"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Ambient floating bubbles matching Image 1 (Desktop Only) */}
        <div
          style={{
            position: 'absolute',
            left: '320px',
            top: '320px',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(56, 189, 248, 0.25)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '420px',
            top: '210px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: isDark ? 'rgba(56, 189, 248, 0.06)' : 'rgba(186, 230, 253, 0.45)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '470px',
            top: '250px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(56, 189, 248, 0.3)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '450px',
            top: '180px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: isDark ? 'rgba(56, 189, 248, 0.05)' : 'rgba(56, 189, 248, 0.25)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Decorative Background Glowing Ambient Light Orbs */}
      <div
        className="login-bg-orb-1"
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(219, 234, 254, 0.05) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />
      <div
        className="login-bg-orb-2"
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-5%',
          width: '750px',
          height: '750px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(9, 92, 229, 0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(9, 92, 229, 0.16) 0%, rgba(219, 234, 254, 0.04) 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }}
      />

      {/* Functional Interactive Theme Toggle in Top Right */}
      <div style={{ position: 'absolute', top: '16px', right: '20px', zIndex: 40 }}>
        <button
          type="button"
          className="nav-icon-btn"
          style={{
            background: isDark ? '#1e293b' : '#ffffff',
            border: isDark ? '1px solid #334155' : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.25s ease'
          }}
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Sun size={19} color="#f59e0b" /> : <Moon size={19} color="#095ce5" />}
        </button>
      </div>

      {/* =======================================================================
          VIEW 1: MOBILE LOGIN SCREEN (Pixel-accurate match to User Reference Mockup)
          Active on screens < 820px or narrow mobile viewports
          ======================================================================= */}
      <div className="login-mobile-view">
        {/* Top Header & 3D Illustration */}
        <div className="login-mobile-top">
          {/* Bank App Icon */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0052cc 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 20px rgba(0, 82, 204, 0.32)',
              marginBottom: '8px'
            }}
          >
            <Landmark size={25} />
          </div>

          {/* Brand Name */}
          <div
            style={{
              fontWeight: 800,
              fontSize: '1.5rem',
              color: isDark ? '#f8fafc' : '#0f294a',
              letterSpacing: '-0.02em',
              lineHeight: 1.15
            }}
          >
            MoneyMate
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#0052cc',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: '3px'
            }}
          >
            Private Wealth
          </div>

          {/* 3D Blue Leather Wallet with Coins & Leaves */}
          <div style={{ marginTop: '14px', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
            <WalletArt size={235} />
          </div>
        </div>

        {/* Bottom Flush Card Sheet */}
        <div
          className="login-mobile-card"
          style={{
            position: 'relative',
            background: isDark ? '#0f172a' : '#ffffff',
            borderTop: isDark ? '1px solid #1e293b' : 'none'
          }}
        >
          {/* 3D Potted Green Plant on Mobile (Resting at top-right corner of card) */}
          <PottedPlant variant="mobile" />

          {mode === 'signin' ? (
            <>
              {/* Card Header */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2
                  style={{
                    fontSize: '1.48rem',
                    fontWeight: 800,
                    color: isDark ? '#f8fafc' : '#0f294a',
                    letterSpacing: '-0.02em',
                    margin: 0
                  }}
                >
                  Welcome Back!
                </h2>
                <p
                  style={{
                    fontSize: '0.84rem',
                    color: isDark ? '#94a3b8' : '#64748b',
                    margin: '5px 0 0'
                  }}
                >
                  Sign in to manage your wealth
                </p>
              </div>

              <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Username or Email Input */}
                <div style={{ position: 'relative' }}>
                  <User
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8'
                    }}
                  />
                  <input
                    type="text"
                    className="login-input"
                    style={{
                      width: '100%',
                      padding: '13px 16px 13px 44px',
                      fontSize: '0.92rem',
                      borderRadius: '14px',
                      border: isDark ? '1px solid #334155' : '1.5px solid #e2e8f0',
                      background: isDark ? '#1e293b' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f294a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Username or Email"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Input */}
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8'
                    }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="login-input"
                    style={{
                      width: '100%',
                      padding: '13px 44px 13px 44px',
                      fontSize: '0.92rem',
                      borderRadius: '14px',
                      border: isDark ? '1px solid #334155' : '1.5px solid #e2e8f0',
                      background: isDark ? '#1e293b' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f294a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', color: isDark ? '#94a3b8' : '#475569' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: '#0052cc', cursor: 'pointer' }}
                    />
                    <span>Remember session</span>
                  </label>
                  <span style={{ color: '#0052cc', fontWeight: 600, cursor: 'pointer' }}>
                    Forgot password?
                  </span>
                </div>

                {/* Pill Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-submit-btn"
                  style={{
                    width: '100%',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px 20px',
                    boxShadow: '0 8px 24px rgba(0, 82, 204, 0.35)',
                    cursor: 'pointer',
                    marginTop: '4px',
                    textAlign: 'center'
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              {/* New Member Link */}
              <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.84rem', color: isDark ? '#94a3b8' : '#64748b' }}>
                New member?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0052cc',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Create your account
                </button>
              </div>

              {/* Mobile Home Indicator bar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '22px' }}>
                <div style={{ width: '134px', height: '4px', borderRadius: '9999px', background: isDark ? '#334155' : '#0f172a', opacity: isDark ? 0.6 : 0.2 }} />
              </div>
            </>
          ) : (
            <>
              {/* Mobile Register Form */}
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f294a', margin: 0 }}>
                  Create Account
                </h2>
                <p style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', margin: '4px 0 0' }}>
                  Register to get your private ledger
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  className="login-input"
                  style={{ width: '100%', padding: '12px 16px', fontSize: '0.9rem', borderRadius: '14px', border: isDark ? '1px solid #334155' : '1.5px solid #e2e8f0', background: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f294a', boxSizing: 'border-box' }}
                  placeholder="Full Name"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="login-input"
                  style={{ width: '100%', padding: '12px 16px', fontSize: '0.9rem', borderRadius: '14px', border: isDark ? '1px solid #334155' : '1.5px solid #e2e8f0', background: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f294a', boxSizing: 'border-box' }}
                  placeholder="Choose Username"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                />
                <input
                  type={regShowPassword ? 'text' : 'password'}
                  className="login-input"
                  style={{ width: '100%', padding: '12px 16px', fontSize: '0.9rem', borderRadius: '14px', border: isDark ? '1px solid #334155' : '1.5px solid #e2e8f0', background: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f294a', boxSizing: 'border-box' }}
                  placeholder="Password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
                <input
                  type={regShowPassword ? 'text' : 'password'}
                  className="login-input"
                  style={{ width: '100%', padding: '12px 16px', fontSize: '0.9rem', borderRadius: '14px', border: isDark ? '1px solid #334155' : '1.5px solid #e2e8f0', background: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f294a', boxSizing: 'border-box' }}
                  placeholder="Confirm Password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-submit-btn"
                  style={{
                    width: '100%',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px 20px',
                    boxShadow: '0 6px 20px rgba(0, 82, 204, 0.35)',
                    cursor: 'pointer',
                    marginTop: '4px'
                  }}
                >
                  Create Account
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.84rem', color: isDark ? '#94a3b8' : '#64748b' }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  style={{ background: 'none', border: 'none', color: '#0052cc', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Sign In
                </button>
              </div>

              {/* Mobile Home Indicator bar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '18px' }}>
                <div style={{ width: '134px', height: '4px', borderRadius: '9999px', background: isDark ? '#334155' : '#0f172a', opacity: isDark ? 0.6 : 0.2 }} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* =======================================================================
          VIEW 2: DESKTOP LOGIN SCREEN (Pixel-accurate match to User Reference Image 1)
          Active on screens >= 820px: Side-by-Side 2 Columns (Hero & Sign-In Card + Plant)
          ======================================================================= */}
      <div className="login-desktop-view">
        {/* Left Column: Wealth Companion Hero & 3D Art */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10 }}>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '13px',
                background: 'linear-gradient(135deg, #095ce5 0%, #0045b5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 6px 18px rgba(9, 92, 229, 0.35)'
              }}
            >
              <Landmark size={23} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.02em', color: isDark ? '#f8fafc' : '#0f294a' }}>
                MoneyMate
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#095ce5', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Private Wealth Network
              </div>
            </div>
          </div>

          {/* Large Hero Title */}
          <h1
            style={{
              fontSize: '2.6rem',
              fontWeight: 800,
              color: isDark ? '#f8fafc' : '#0f294a',
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              margin: '2px 0 0'
            }}
          >
            Your Personal <br />
            <span style={{ color: '#095ce5' }}>Wealth Companion</span>
          </h1>

          <p style={{ fontSize: '0.88rem', color: isDark ? '#94a3b8' : '#475569', lineHeight: 1.6, maxWidth: '440px', margin: 0 }}>
            The ultra-clean personal money ledger & daily expense tracking suite with private isolated workspaces for you and your friends.
          </p>

          {/* 4 Feature Badges (Pill cards matching Image 1) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isDark ? '#0f172a' : '#ffffff',
                padding: '6px 14px',
                borderRadius: '9999px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                border: isDark ? '1px solid #1e293b' : '1px solid rgba(0, 0, 0, 0.06)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: isDark ? '#e2e8f0' : '#1e293b'
              }}
            >
              <ShieldCheck size={14} color="#095ce5" />
              <span>Secure & Private</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isDark ? '#0f172a' : '#ffffff',
                padding: '6px 14px',
                borderRadius: '9999px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                border: isDark ? '1px solid #1e293b' : '1px solid rgba(0, 0, 0, 0.06)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: isDark ? '#e2e8f0' : '#1e293b'
              }}
            >
              <LineChart size={14} color="#8b5cf6" />
              <span>Smart Analytics</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isDark ? '#0f172a' : '#ffffff',
                padding: '6px 14px',
                borderRadius: '9999px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                border: isDark ? '1px solid #1e293b' : '1px solid rgba(0, 0, 0, 0.06)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: isDark ? '#e2e8f0' : '#1e293b'
              }}
            >
              <CheckCircle2 size={14} color="#10b981" />
              <span>Track Everything</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isDark ? '#0f172a' : '#ffffff',
                padding: '6px 14px',
                borderRadius: '9999px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                border: isDark ? '1px solid #1e293b' : '1px solid rgba(0, 0, 0, 0.06)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: isDark ? '#e2e8f0' : '#1e293b'
              }}
            >
              <Target size={14} color="#f59e0b" />
              <span>Plan Your Future</span>
            </div>
          </div>

          {/* 3D Fintech Visual Art (Blue Card + Curved Graph + 4 Badges matching Image 1) */}
          <FintechCenterArt />

          {/* Cloud Status Footer Pill */}
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              background: isDark ? '#0f172a' : '#ffffff',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
              border: isDark ? '1px solid rgba(9, 92, 229, 0.35)' : '1px solid rgba(9, 92, 229, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: 'fit-content'
            }}
          >
            <ShieldCheck size={16} color="#095ce5" />
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f294a' }}>
                MongoDB Atlas Multi-Tenant Isolated
              </div>
              <div style={{ fontSize: '0.68rem', color: isDark ? '#94a3b8' : '#64748b' }}>
                Each member receives a 100% private, encrypted ledger
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean White Floating Card + Potted Plant Container */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
          {/* Main Floating Sign-In Card */}
          <div
            className="login-card-floating"
            style={{
              background: isDark ? '#0f172a' : '#ffffff',
              borderRadius: '26px',
              boxShadow: isDark
                ? '0 24px 60px rgba(0, 0, 0, 0.55), 0 2px 10px rgba(0, 0, 0, 0.3)'
                : '0 20px 50px rgba(15, 23, 42, 0.08), 0 2px 10px rgba(15, 23, 42, 0.04)',
              padding: '36px 32px',
              border: isDark ? '1px solid #1e293b' : '1px solid rgba(0, 0, 0, 0.06)',
              width: '100%',
              boxSizing: 'border-box',
              position: 'relative',
              zIndex: 6,
              transition: 'background 0.3s ease, border-color 0.3s ease'
            }}
          >
            {/* Top Segmented Tabs: Sign In vs Create Account */}
            <div
              style={{
                display: 'flex',
                background: isDark ? '#1e293b' : '#f1f5f9',
                padding: '4px',
                borderRadius: '9999px',
                marginBottom: '24px'
              }}
            >
              <button
                type="button"
                onClick={() => setMode('signin')}
                style={{
                  flex: 1,
                  padding: '9px 16px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: mode === 'signin' ? 'linear-gradient(135deg, #095ce5 0%, #0045b5 100%)' : 'transparent',
                  color: mode === 'signin' ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'),
                  boxShadow: mode === 'signin' ? '0 4px 12px rgba(9, 92, 229, 0.3)' : 'none'
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
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: mode === 'register' ? 'linear-gradient(135deg, #095ce5 0%, #0045b5 100%)' : 'transparent',
                  color: mode === 'register' ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'),
                  boxShadow: mode === 'register' ? '0 4px 12px rgba(9, 92, 229, 0.3)' : 'none'
                }}
              >
                Create Account
              </button>
            </div>

            {mode === 'signin' ? (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f294a', letterSpacing: '-0.02em', margin: 0 }}>
                    Sign In to Your Ledger
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', margin: '4px 0 0' }}>
                    Enter your credentials to access your financial dashboard.
                  </p>
                </div>

                <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {/* Username or Email */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: isDark ? '#cbd5e1' : '#1e293b', marginBottom: '6px' }}>
                      Username or Email
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User
                        size={16}
                        style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                      />
                      <input
                        type="text"
                        className="login-input"
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 40px',
                          fontSize: '0.9rem',
                          borderRadius: '10px',
                          border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                          background: isDark ? '#1e293b' : '#ffffff',
                          color: isDark ? '#f8fafc' : '#0f294a',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        placeholder="Username or email address"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password with Eye Toggle */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontWeight: 600, fontSize: '0.82rem', color: isDark ? '#cbd5e1' : '#1e293b' }}>
                        Password
                      </label>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Lock
                        size={16}
                        style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="login-input"
                        style={{
                          width: '100%',
                          padding: '11px 42px 11px 40px',
                          fontSize: '0.9rem',
                          borderRadius: '10px',
                          border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                          background: isDark ? '#1e293b' : '#ffffff',
                          color: isDark ? '#f8fafc' : '#0f294a',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
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
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: isDark ? '#94a3b8' : '#475569' }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: '#095ce5', cursor: 'pointer' }}
                      />
                      <span>Remember session</span>
                    </label>
                    <span style={{ color: '#095ce5', fontWeight: 600, cursor: 'pointer' }}>
                      Forgot password?
                    </span>
                  </div>

                  {/* Big Blue Sign In Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="login-submit-btn"
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      background: 'linear-gradient(135deg, #095ce5 0%, #0045b5 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '13px 20px',
                      boxShadow: '0 6px 20px rgba(9, 92, 229, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{isLoading ? 'Signing In...' : 'Sign In to Private Wealth'}</span>
                    <ArrowRight size={17} />
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b' }}>
                  New friend or member?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#095ce5',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Create your account →
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '18px' }}>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f294a', margin: 0 }}>
                    Create New Account
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                    Register to get your own isolated personal finance ledger.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: isDark ? '#cbd5e1' : '#1e293b', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', background: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f294a', boxSizing: 'border-box' }}
                      placeholder="e.g. John Doe"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: isDark ? '#cbd5e1' : '#1e293b', marginBottom: '4px' }}>
                      Choose Username *
                    </label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', background: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f294a', boxSizing: 'border-box' }}
                      placeholder="username"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: isDark ? '#cbd5e1' : '#1e293b', marginBottom: '4px' }}>
                      Password *
                    </label>
                    <input
                      type={regShowPassword ? 'text' : 'password'}
                      style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', background: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f294a', boxSizing: 'border-box' }}
                      placeholder="At least 4 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: isDark ? '#cbd5e1' : '#1e293b', marginBottom: '4px' }}>
                      Confirm Password *
                    </label>
                    <input
                      type={regShowPassword ? 'text' : 'password'}
                      style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', background: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f294a', boxSizing: 'border-box' }}
                      placeholder="Re-enter password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      marginTop: '6px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      background: 'linear-gradient(135deg, #095ce5 0%, #0045b5 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px',
                      boxShadow: '0 4px 16px rgba(9, 92, 229, 0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    Create Account & Access Ledger
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b' }}>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      style={{ background: 'none', border: 'none', color: '#095ce5', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Sign In instead
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* 3D Potted Green Plant on Right Edge matching Image 1 */}
          <PottedPlant />
        </div>
      </div>
    </div>
  );
};
