import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiClient } from '../services/apiClient';

interface AuthUser {
  id?: string;
  username: string;
  email: string;
  fullName: string;
  tier?: string;
}

interface RegisterParams {
  fullName: string;
  username: string;
  email?: string;
  mobile?: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  token: string | null;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (data: RegisterParams) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('moneymate_token'));
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('moneymate_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      const storedToken = localStorage.getItem('moneymate_token');
      setToken(storedToken);
      try {
        const saved = localStorage.getItem('moneymate_user');
        setCurrentUser(saved ? JSON.parse(saved) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener('moneymate_auth_changed', handleAuthChange);
    return () => window.removeEventListener('moneymate_auth_changed', handleAuthChange);
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.login(usernameOrEmail, password);
      if (res && res.success) {
        const authToken = res.token || `token_${Date.now()}`;
        const user = res.user || {
          id: `user_${Date.now()}`,
          username: usernameOrEmail,
          email: `${usernameOrEmail}@moneymate.app`,
          fullName: usernameOrEmail
        };

        localStorage.setItem('moneymate_token', authToken);
        localStorage.setItem('moneymate_user', JSON.stringify(user));
        setToken(authToken);
        setCurrentUser(user);
        window.dispatchEvent(new CustomEvent('moneymate_auth_changed'));
        window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
      } else {
        throw new Error(res.error || 'Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterParams) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.register(data);
      if (res && res.success) {
        const authToken = res.token || `token_${Date.now()}`;
        const user = res.user;

        localStorage.setItem('moneymate_token', authToken);
        localStorage.setItem('moneymate_user', JSON.stringify(user));
        setToken(authToken);
        setCurrentUser(user);
        window.dispatchEvent(new CustomEvent('moneymate_auth_changed'));
        window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
      } else {
        throw new Error(res.error || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    ApiClient.logout();
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        currentUser,
        token,
        login,
        register,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
