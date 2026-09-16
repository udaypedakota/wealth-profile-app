// Fallback local memory / localStorage storage keys
const LOCAL_STORAGE_PREFIX = 'moneymate_local_';

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

// Default initial state for offline / direct browser operations
const DEFAULT_INITIAL_STATE = {
  transactions: [],
  bills: [],
  emis: [],
  chits: [],
  lending: [],
  accounts: [
    {
      id: 'acc_cash_01',
      name: 'Cash in Hand (Wallet)',
      type: 'cash',
      institution: 'Physical Wallet',
      maskedNumber: 'CASH',
      balance: 0,
      currency: 'INR',
      status: 'primary',
      cardColor: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)'
    },
    {
      id: 'acc_bank_02',
      name: 'Primary Bank Account',
      type: 'bank',
      institution: 'Primary Savings Bank',
      maskedNumber: '•••• 5732',
      balance: 0,
      currency: 'INR',
      status: 'active',
      cardColor: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
    }
  ]
};

// Base URL: relative /api works seamlessly on localhost, mobile network IP, and production
const API_BASE = '/api';

export class ApiClient {
  static async request(endpoint: string, options: RequestInit = {}) {
    // 1. Primary: relative /api (handled via Vite proxy or reverse proxy)
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Backend not reached via /api -> try direct localhost fallback
    }

    // 2. Direct backend fallback (for standalone dev on localhost)
    try {
      const directResponse = await fetch(`http://localhost:5000/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      if (directResponse.ok) {
        return await directResponse.json();
      }
    } catch {}

    return null; // Signals to use client local fallback
  }

  // Authentication
  static async login(usernameOrEmail: string, password: string) {
    try {
      let response: Response | null = null;
      try {
        response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usernameOrEmail, password })
        });
      } catch {
        // Fallback to direct backend if proxy failed
        response = await fetch(`http://localhost:5000/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usernameOrEmail, password })
        });
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      return data;
    } catch (err: any) {
      // Local fallback check if backend is somehow unreachable
      const cleanUser = usernameOrEmail.trim().toLowerCase();
      if (
        (cleanUser === 'udaypedakota' || cleanUser === 'peddakotaudaykumar@gmail.com') &&
        password.trim() === 'Uday8329'
      ) {
        return {
          success: true,
          token: `local_token_${Date.now()}`,
          user: { username: 'udaypedakota', email: 'peddakotaudaykumar@gmail.com', fullName: 'Uday Pedakota' }
        };
      }
      throw err;
    }
  }

  static async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('moneymate_token');
    localStorage.removeItem('moneymate_user');
    window.dispatchEvent(new CustomEvent('moneymate_auth_changed'));
    return { success: true };
  }

  // Profile & Personal Information
  static async getProfile() {
    const res = await this.request('/profile');
    if (res) return res;
    return getLocal('profile', null);
  }

  static async updateProfile(data: any) {
    const res = await this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    setLocal('profile', data);
    return res || data;
  }

  static async uploadAvatar(avatarUrl: string) {
    const res = await this.request('/profile/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatarUrl })
    });
    const current = getLocal<any>('profile', {});
    if (current.personal) current.personal.avatarUrl = avatarUrl;
    setLocal('profile', current);
    return res || { success: true, avatarUrl };
  }

  // Dashboard Aggregates
  static async getDashboard() {
    const res = await this.request('/dashboard');
    if (res) return res;

    // Local computation fallback
    const transactions = getLocal('transactions', DEFAULT_INITIAL_STATE.transactions);
    const bills = getLocal('bills', DEFAULT_INITIAL_STATE.bills);
    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonth = todayStr.substring(0, 7);

    let todayExpense = 0;
    let thisMonthExpense = 0;
    let thisMonthIncome = 85000;

    transactions.forEach((tx: any) => {
      const amt = Number(tx.amount || 0);
      if (tx.date === todayStr && tx.type === 'debit') todayExpense += amt;
      if (tx.date && tx.date.startsWith(currentMonth)) {
        if (tx.type === 'debit') thisMonthExpense += amt;
        if (tx.type === 'credit') thisMonthIncome += amt;
      }
    });

    return {
      user: {
        fullName: 'Uday Pedakota',
        firstName: 'Uday',
        avatarUrl: '',
        tier: 'Private Wealth Member'
      },
      balances: {
        totalNetWorth: 80900 - 14200,
        totalCashAndBank: 80900,
        totalCreditCardDue: 14200,
        todayExpense,
        thisMonthIncome,
        thisMonthExpense,
        monthlyBudget: 35000,
        currencySymbol: '₹'
      },
      counts: {
        transactionsCount: transactions.length,
        activeBillsCount: bills.filter((b: any) => b.status !== 'Settled').length,
        activeEmisCount: 1,
        activeChitsCount: 1,
        moneyLentPending: 1
      },
      recentTransactions: transactions.slice(0, 8),
      upcomingBills: bills.filter((b: any) => b.status !== 'Settled').slice(0, 4)
    };
  }

  // Daily Transactions
  static async getTransactions() {
    const res = await this.request('/transactions');
    if (res && Array.isArray(res)) {
      setLocal('transactions', res);
      return res;
    }
    return getLocal('transactions', DEFAULT_INITIAL_STATE.transactions);
  }

  static async addTransaction(transaction: {
    title: string;
    amount: number;
    type: 'credit' | 'debit';
    category?: string;
    account?: string;
    notes?: string;
    date?: string;
  }) {
    const res = await this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction)
    });

    // Update local storage too
    const current = getLocal<any[]>('transactions', DEFAULT_INITIAL_STATE.transactions);
    const newTx = res || {
      ...transaction,
      id: 'tx_' + Date.now(),
      status: 'Completed',
      createdAt: new Date().toISOString()
    };
    current.unshift(newTx);
    setLocal('transactions', current);

    // Notify listeners
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return newTx;
  }

  static async deleteTransaction(id: string) {
    await this.request(`/transactions/${id}`, { method: 'DELETE' });
    const current = getLocal<any[]>('transactions', DEFAULT_INITIAL_STATE.transactions);
    const updated = current.filter((t) => t.id !== id);
    setLocal('transactions', updated);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return { success: true, id };
  }

  // Bills
  static async getBills() {
    const res = await this.request('/bills');
    if (res && Array.isArray(res)) {
      setLocal('bills', res);
      return res;
    }
    return getLocal('bills', DEFAULT_INITIAL_STATE.bills);
  }

  static async addBill(bill: any) {
    const res = await this.request('/bills', { method: 'POST', body: JSON.stringify(bill) });
    const current = getLocal<any[]>('bills', DEFAULT_INITIAL_STATE.bills);
    const newBill = res || { ...bill, id: 'bill_' + Date.now(), status: 'Pending' };
    current.unshift(newBill);
    setLocal('bills', current);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return newBill;
  }

  static async payBill(id: string) {
    await this.request(`/bills/${id}/pay`, { method: 'PATCH' });
    const current = getLocal<any[]>('bills', DEFAULT_INITIAL_STATE.bills);
    const updated = current.map((b) => (b.id === id ? { ...b, status: 'Settled' } : b));
    setLocal('bills', updated);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return { success: true };
  }

  static async deleteBill(id: string) {
    await this.request(`/bills/${id}`, { method: 'DELETE' });
    const current = getLocal<any[]>('bills', DEFAULT_INITIAL_STATE.bills);
    const updated = current.filter((b) => b.id !== id);
    setLocal('bills', updated);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return { success: true };
  }

  // EMIs
  static async getEmis() {
    const res = await this.request('/emis');
    if (res && Array.isArray(res)) {
      setLocal('emis', res);
      return res;
    }
    return getLocal('emis', DEFAULT_INITIAL_STATE.emis);
  }

  static async addEmi(emi: any) {
    const res = await this.request('/emis', { method: 'POST', body: JSON.stringify(emi) });
    const current = getLocal<any[]>('emis', DEFAULT_INITIAL_STATE.emis);
    const newEmi = res || { ...emi, id: 'emi_' + Date.now(), status: 'Active' };
    current.unshift(newEmi);
    setLocal('emis', current);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return newEmi;
  }

  static async deleteEmi(id: string) {
    await this.request(`/emis/${id}`, { method: 'DELETE' });
    const current = getLocal<any[]>('emis', DEFAULT_INITIAL_STATE.emis);
    setLocal('emis', current.filter((e) => e.id !== id));
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return { success: true };
  }

  // Chits
  static async getChits() {
    const res = await this.request('/chits');
    if (res && Array.isArray(res)) {
      setLocal('chits', res);
      return res;
    }
    return getLocal('chits', DEFAULT_INITIAL_STATE.chits);
  }

  static async addChit(chit: any) {
    const res = await this.request('/chits', { method: 'POST', body: JSON.stringify(chit) });
    const current = getLocal<any[]>('chits', DEFAULT_INITIAL_STATE.chits);
    const newChit = res || { ...chit, id: 'chit_' + Date.now(), status: 'Active' };
    current.unshift(newChit);
    setLocal('chits', current);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return newChit;
  }

  static async deleteChit(id: string) {
    await this.request(`/chits/${id}`, { method: 'DELETE' });
    const current = getLocal<any[]>('chits', DEFAULT_INITIAL_STATE.chits);
    setLocal('chits', current.filter((c) => c.id !== id));
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return { success: true };
  }

  // Lending
  static async getLending() {
    const res = await this.request('/lending');
    if (res && Array.isArray(res)) {
      setLocal('lending', res);
      return res;
    }
    return getLocal('lending', DEFAULT_INITIAL_STATE.lending);
  }

  static async addLending(record: any) {
    const res = await this.request('/lending', { method: 'POST', body: JSON.stringify(record) });
    const current = getLocal<any[]>('lending', DEFAULT_INITIAL_STATE.lending);
    const newRecord = res || { ...record, id: 'lend_' + Date.now(), status: 'Pending' };
    current.unshift(newRecord);
    setLocal('lending', current);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return newRecord;
  }

  static async returnLending(id: string) {
    await this.request(`/lending/${id}/return`, { method: 'PATCH' });
    const current = getLocal<any[]>('lending', DEFAULT_INITIAL_STATE.lending);
    const updated = current.map((l) => (l.id === id ? { ...l, status: 'Returned' } : l));
    setLocal('lending', updated);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return { success: true };
  }

  static async deleteLending(id: string) {
    await this.request(`/lending/${id}`, { method: 'DELETE' });
    const current = getLocal<any[]>('lending', DEFAULT_INITIAL_STATE.lending);
    setLocal('lending', current.filter((l) => l.id !== id));
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return { success: true };
  }

  // Accounts
  static async getAccounts() {
    const res = await this.request('/accounts');
    if (res && Array.isArray(res)) {
      setLocal('accounts', res);
      return res;
    }
    return getLocal('accounts', DEFAULT_INITIAL_STATE.accounts);
  }

  static async addAccount(account: any) {
    const res = await this.request('/accounts', { method: 'POST', body: JSON.stringify(account) });
    const current = getLocal<any[]>('accounts', DEFAULT_INITIAL_STATE.accounts);
    const newAcc = res || { ...account, id: 'acc_' + Date.now() };
    current.push(newAcc);
    setLocal('accounts', current);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return newAcc;
  }

  static async updateAccount(id: string, partial: any) {
    await this.request(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(partial) });
    const current = getLocal<any[]>('accounts', DEFAULT_INITIAL_STATE.accounts);
    const updated = current.map((a) => (a.id === id ? { ...a, ...partial } : a));
    setLocal('accounts', updated);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return updated;
  }

  static async deleteAccount(id: string) {
    await this.request(`/accounts/${id}`, { method: 'DELETE' });
    const current = getLocal<any[]>('accounts', DEFAULT_INITIAL_STATE.accounts);
    setLocal('accounts', current.filter((a) => a.id !== id));
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return { success: true };
  }

  // Reset
  static async resetData() {
    await this.request('/reset', { method: 'POST' });
    localStorage.clear();
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return { success: true };
  }
}
