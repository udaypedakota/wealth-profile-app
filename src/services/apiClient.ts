// Scoped local storage keys by user
const LOCAL_STORAGE_PREFIX = 'moneymate_local_';

function getCurrentUserId(): string {
  try {
    const userStr = localStorage.getItem('moneymate_user');
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u && (u.id || u.username)) return u.id || u.username;
    }
  } catch {}
  return 'user_uday_01';
}

function getLocal<T>(key: string, fallback: T): T {
  try {
    const userId = getCurrentUserId();
    const item = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${userId}_${key}`) || localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    const userId = getCurrentUserId();
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${userId}_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

// Default initial state for offline / direct browser operations
const DEFAULT_INITIAL_STATE = {
  transactions: [],
  bills: [],
  emis: [],
  chits: [
    {
      id: 'chit_3l_01',
      name: '3L Chit',
      title: '3L Chit',
      totalAmount: 300000,
      totalPotValue: 300000,
      durationMonths: 20,
      monthlyAmount: 15000,
      monthlySubscription: 15000,
      startDate: '2026-09-16',
      status: 'Active',
      payments: []
    }
  ],
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
    },
    {
      id: 'acc_card_03',
      name: 'Primary Credit Card',
      type: 'credit_card',
      institution: 'HDFC / Bank Credit Line',
      maskedNumber: '•••• 1998',
      creditLimit: 100000,
      usedAmount: 0,
      balance: 0,
      availableLimit: 100000,
      dueDate: '15th of every month',
      statementDate: '2nd of every month',
      currency: 'INR',
      status: 'active',
      expiryDate: '03/29',
      cardColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
    }
  ]
};

// Base URL: relative /api works seamlessly on localhost, mobile network IP, and production
const API_BASE = '/api';

export class ApiClient {
  static isCloudConnected: boolean = false;
  static isSyncing: boolean = false;

  static async checkCloudHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const data = await res.json();
        this.isCloudConnected = true;
        window.dispatchEvent(new CustomEvent('moneymate_cloud_status', {
          detail: { online: true, isMongo: !!data.isMongo }
        }));
        return { online: true, isMongo: !!data.isMongo, message: 'Cloud Connected' };
      }
    } catch {}

    // Fallback direct check for local dev
    try {
      const res2 = await fetch('http://localhost:5000/api/health');
      if (res2.ok) {
        const data = await res2.json();
        this.isCloudConnected = true;
        window.dispatchEvent(new CustomEvent('moneymate_cloud_status', {
          detail: { online: true, isMongo: !!data.isMongo }
        }));
        return { online: true, isMongo: !!data.isMongo, message: 'Local Server Connected' };
      }
    } catch {}

    this.isCloudConnected = false;
    window.dispatchEvent(new CustomEvent('moneymate_cloud_status', {
      detail: { online: false, isMongo: false }
    }));
    return { online: false, isMongo: false, message: 'Offline Mode' };
  }

  static async syncLocalToCloud(): Promise<{ success: boolean; message: string; count: number }> {
    if (this.isSyncing) return { success: false, message: 'Sync already in progress', count: 0 };
    
    // Check health first
    const health = await this.checkCloudHealth();
    if (!health.online) {
      return { success: false, message: 'Cloud database is currently unreachable', count: 0 };
    }

    try {
      this.isSyncing = true;
      window.dispatchEvent(new CustomEvent('moneymate_sync_status', { detail: { syncing: true } }));
      let totalSynced = 0;

      // 1. Sync Chits & Chit Payments from mobile phone storage to MongoDB
      const remoteChits = await this.request('/chits');
      const localChits = getLocal<any[]>('chits', []);
      if (Array.isArray(remoteChits) && Array.isArray(localChits)) {
        for (const localChit of localChits) {
          if (!localChit || !localChit.name) continue;
          let matchedRemote = remoteChits.find(
            (rc: any) =>
              rc.id === localChit.id ||
              (rc.name && rc.name.trim().toLowerCase() === localChit.name.trim().toLowerCase())
          );

          if (!matchedRemote) {
            // Chit does not exist on MongoDB Atlas -> Create it!
            const created = await this.request('/chits', {
              method: 'POST',
              body: JSON.stringify({
                name: localChit.name,
                title: localChit.title || localChit.name,
                totalAmount: localChit.totalAmount || localChit.totalPotValue || 0,
                totalPotValue: localChit.totalPotValue || localChit.totalAmount || 0,
                durationMonths: localChit.durationMonths || 20,
                monthlyAmount: localChit.monthlyAmount || localChit.monthlySubscription || 0,
                monthlySubscription: localChit.monthlySubscription || localChit.monthlyAmount || 0,
                startDate: localChit.startDate || new Date().toISOString().split('T')[0],
                status: localChit.status || 'Active',
                payments: []
              })
            });
            if (created) {
              matchedRemote = created;
              totalSynced++;
            }
          }

          // Sync payments for this chit
          if (matchedRemote && Array.isArray(localChit.payments) && localChit.payments.length > 0) {
            const remotePayments = Array.isArray(matchedRemote.payments) ? matchedRemote.payments : [];
            for (const pay of localChit.payments) {
              const payExists = remotePayments.some(
                (rp: any) =>
                  rp.id === pay.id ||
                  (rp.monthName === pay.monthName && Number(rp.amount) === Number(pay.amount))
              );
              if (!payExists) {
                await this.request(`/chits/${matchedRemote.id}/payments`, {
                  method: 'POST',
                  body: JSON.stringify({
                    monthNumber: pay.monthNumber,
                    monthName: pay.monthName,
                    amount: pay.amount,
                    date: pay.date,
                    notes: pay.notes || ''
                  })
                });
                totalSynced++;
              }
            }
          }
        }
      }

      // 2. Sync Transactions
      const remoteTxs = await this.request('/transactions');
      const localTxs = getLocal<any[]>('transactions', []);
      if (Array.isArray(remoteTxs) && Array.isArray(localTxs)) {
        for (const localTx of localTxs) {
          if (!localTx || !localTx.title) continue;
          const exists = remoteTxs.some(
            (rt: any) =>
              rt.id === localTx.id ||
              (rt.title === localTx.title && rt.amount === localTx.amount && rt.date === localTx.date)
          );
          if (!exists) {
            await this.request('/transactions', {
              method: 'POST',
              body: JSON.stringify(localTx)
            });
            totalSynced++;
          }
        }
      }

      // 3. Sync Bills
      const remoteBills = await this.request('/bills');
      const localBills = getLocal<any[]>('bills', []);
      if (Array.isArray(remoteBills) && Array.isArray(localBills)) {
        for (const localBill of localBills) {
          if (!localBill || !localBill.title) continue;
          const exists = remoteBills.some(
            (rb: any) => rb.id === localBill.id || (rb.title === localBill.title && rb.amount === localBill.amount)
          );
          if (!exists) {
            await this.request('/bills', {
              method: 'POST',
              body: JSON.stringify(localBill)
            });
            totalSynced++;
          }
        }
      }

      // Refresh local cache with authoritative data from MongoDB
      const refreshedChits = await this.request('/chits');
      if (Array.isArray(refreshedChits)) setLocal('chits', refreshedChits);

      const refreshedTxs = await this.request('/transactions');
      if (Array.isArray(refreshedTxs)) setLocal('transactions', refreshedTxs);

      const refreshedBills = await this.request('/bills');
      if (Array.isArray(refreshedBills)) setLocal('bills', refreshedBills);

      window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
      window.dispatchEvent(new CustomEvent('moneymate_sync_status', { detail: { syncing: false, count: totalSynced } }));

      return {
        success: true,
        message: totalSynced > 0 ? `Successfully synced ${totalSynced} items to MongoDB Atlas!` : 'Cloud Database is up to date',
        count: totalSynced
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Sync failed', count: 0 };
    } finally {
      this.isSyncing = false;
      window.dispatchEvent(new CustomEvent('moneymate_sync_status', { detail: { syncing: false } }));
    }
  }

  static async request(endpoint: string, options: RequestInit = {}) {
    const userId = getCurrentUserId();
    const token = localStorage.getItem('moneymate_token') || '';
    const authHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    // 1. Primary: relative /api (handled via Vite proxy on local dev or Vercel serverless in production)
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          ...authHeaders,
          ...((options.headers as any) || {})
        }
      });

      if (response.ok) {
        this.isCloudConnected = true;
        return await response.json();
      }
    } catch {
      // Backend not reached via /api -> try direct localhost fallback
    }

    // 2. Direct backend fallback (for standalone dev on localhost)
    try {
      const directResponse = await fetch(`http://localhost:5000/api${endpoint}`, {
        ...options,
        headers: {
          ...authHeaders,
          ...((options.headers as any) || {})
        }
      });
      if (directResponse.ok) {
        this.isCloudConnected = true;
        return await directResponse.json();
      }
    } catch {}

    this.isCloudConnected = false;
    return null; // Signals to use client local fallback
  }

  // Registration for friends and new members
  static async register(userData: { fullName: string; username: string; email?: string; mobile?: string; password: string }) {
    let response: Response | null = null;
    try {
      response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    } catch {
      // Direct backend fallback
      response = await fetch(`http://localhost:5000/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    return data;
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

  // Dashboard Aggregates (100% Dynamic from Database & Synced Cache)
  static async getDashboard() {
    const res = await this.request('/dashboard');
    if (res && res.balances && res.sectionBreakdowns) return res;

    // Local dynamic computation fallback
    const accounts = getLocal<any[]>('accounts', DEFAULT_INITIAL_STATE.accounts);
    const transactions = getLocal<any[]>('transactions', []);
    const bills = getLocal<any[]>('bills', []);
    const emis = getLocal<any[]>('emis', []);
    const chits = getLocal<any[]>('chits', []);
    const lending = getLocal<any[]>('lending', []);
    const profile = getLocal<any>('profile', {});

    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonth = todayStr.substring(0, 7);

    // 1. Accounts & Cards
    let totalCashAndBank = 0;
    let totalCreditLimit = 0;
    let totalCreditUsed = 0;

    accounts.forEach((acc: any) => {
      if (acc.type === 'credit_card') {
        const lim = Number(acc.creditLimit || acc.totalLimit || 0);
        const used = Number(acc.usedAmount !== undefined ? acc.usedAmount : Math.abs(acc.balance || 0));
        totalCreditLimit += lim;
        totalCreditUsed += used;
      } else {
        totalCashAndBank += Number(acc.balance || 0);
      }
    });

    const totalCreditAvailable = Math.max(0, totalCreditLimit - totalCreditUsed);
    const creditUtilization = totalCreditLimit > 0 ? Math.round((totalCreditUsed / totalCreditLimit) * 100) : 0;

    // 2. Transactions
    let todayExpense = 0;
    let thisMonthExpense = 0;
    let thisMonthIncome = 0;

    transactions.forEach((tx: any) => {
      const amt = Number(tx.amount || 0);
      if (tx.date === todayStr && tx.type === 'debit') todayExpense += amt;
      if (tx.date && tx.date.startsWith(currentMonth)) {
        if (tx.type === 'debit') thisMonthExpense += amt;
        if (tx.type === 'credit') thisMonthIncome += amt;
      }
    });

    // 3. Bills
    let pendingBillsAmount = 0;
    let settledBillsAmount = 0;
    bills.forEach((b: any) => {
      const amt = Number(b.amount || 0);
      if (b.status === 'Settled' || b.isPaid) settledBillsAmount += amt;
      else pendingBillsAmount += amt;
    });

    // 4. EMIs
    let monthlyEmiTotal = 0;
    let totalLoanAmount = 0;
    emis.forEach((e: any) => {
      const mEmi = Number(e.monthlyAmount || e.monthlyEmi || 0);
      monthlyEmiTotal += mEmi;
      const tLoan = Number(e.totalLoanAmount || (mEmi * (Number(e.totalTenures) || 24)));
      totalLoanAmount += tLoan;
    });

    // 5. Chits
    let monthlyChitsTotal = 0;
    let totalChitPool = 0;
    let totalChitPaid = 0;
    chits.forEach((c: any) => {
      const mChit = Number(c.monthlyAmount || c.monthlySubscription || 0);
      monthlyChitsTotal += mChit;
      totalChitPool += Number(c.totalAmount || c.totalPotValue || 0);
      if (Array.isArray(c.payments)) {
        totalChitPaid += c.payments.reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0);
      }
    });
    const remainingChitPool = Math.max(0, totalChitPool - totalChitPaid);

    // 6. Lending
    let moneyLentTotal = 0;
    let moneyBorrowedTotal = 0;
    lending.forEach((l: any) => {
      const amt = Number(l.amount || 0);
      if (l.status === 'Pending') {
        if (l.type === 'lent') moneyLentTotal += amt;
        if (l.type === 'borrowed') moneyBorrowedTotal += amt;
      }
    });

    const monthlySalary = Number(profile.financial?.monthlyIncome || 0);
    const totalMonthlyCommitments = monthlyEmiTotal + monthlyChitsTotal + pendingBillsAmount + totalCreditUsed;
    const remainingDisposable = Math.max(0, monthlySalary - (monthlyEmiTotal + monthlyChitsTotal + pendingBillsAmount));

    return {
      user: {
        fullName: profile?.personal?.fullName || 'Uday Pedakota',
        firstName: profile?.personal?.firstName || 'Uday',
        avatarUrl: profile?.personal?.avatarUrl || '',
        tier: profile?.tier || 'Private Wealth Member'
      },
      balances: {
        totalNetWorth: totalCashAndBank - totalCreditUsed,
        totalCashAndBank,
        totalCreditCardDue: totalCreditUsed,
        todayExpense,
        thisMonthIncome,
        thisMonthExpense,
        monthlyIncome: monthlySalary,
        monthlyBudget: profile?.financial?.monthlyBudget || 35000,
        currencySymbol: profile?.financial?.currencySymbol || '₹'
      },
      sectionBreakdowns: {
        creditCards: {
          totalLimit: totalCreditLimit,
          totalUsed: totalCreditUsed,
          available: totalCreditAvailable,
          utilization: creditUtilization,
          count: accounts.filter((a: any) => a.type === 'credit_card').length
        },
        bills: {
          pendingAmount: pendingBillsAmount,
          settledAmount: settledBillsAmount,
          totalAmount: pendingBillsAmount + settledBillsAmount,
          pendingCount: bills.filter((b: any) => b.status !== 'Settled').length,
          totalCount: bills.length
        },
        emis: {
          monthlyTotal: monthlyEmiTotal,
          totalLoanAmount,
          count: emis.length
        },
        chits: {
          monthlyTotal: monthlyChitsTotal,
          totalPool: totalChitPool,
          totalPaid: totalChitPaid,
          remainingPool: remainingChitPool,
          count: chits.length
        },
        lending: {
          lentPending: moneyLentTotal,
          borrowedPending: moneyBorrowedTotal,
          pendingCount: lending.filter((l: any) => l.status === 'Pending').length
        },
        salary: {
          monthlyExpected: monthlySalary,
          actualReceivedThisMonth: thisMonthIncome
        },
        commitments: {
          totalMonthlyCommitments,
          remainingDisposable
        }
      },
      accounts,
      counts: {
        transactionsCount: transactions.length,
        activeBillsCount: bills.filter((b: any) => b.status !== 'Settled').length,
        activeEmisCount: emis.length,
        activeChitsCount: chits.length,
        creditCardsCount: accounts.filter((a: any) => a.type === 'credit_card').length,
        moneyLentPending: lending.filter((l: any) => l.type === 'lent' && l.status === 'Pending').length
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
      // Check if local storage has unsynced chits or extra payments
      const localChits = getLocal<any[]>('chits', []);
      const hasUnsynced = localChits.some(
        (lc) =>
          lc &&
          (!res.some((rc) => rc.id === lc.id || (rc.name && lc.name && rc.name.trim().toLowerCase() === lc.name.trim().toLowerCase())) ||
            (lc.payments?.length || 0) > (res.find((rc) => rc.id === lc.id || rc.name === lc.name)?.payments?.length || 0))
      );
      if (hasUnsynced && !this.isSyncing) {
        setTimeout(() => {
          this.syncLocalToCloud();
        }, 300);
      }
      setLocal('chits', res);
      return res;
    }
    return getLocal('chits', DEFAULT_INITIAL_STATE.chits);
  }

  static async addChit(chit: any) {
    const res = await this.request('/chits', { method: 'POST', body: JSON.stringify(chit) });
    const current = getLocal<any[]>('chits', DEFAULT_INITIAL_STATE.chits);
    const newChit = res || {
      ...chit,
      id: 'chit_' + Date.now(),
      status: 'Active',
      payments: chit.payments || [],
      _isOffline: true
    };
    const existsIdx = current.findIndex((c) => c.id === newChit.id);
    if (existsIdx >= 0) {
      current[existsIdx] = newChit;
    } else {
      current.unshift(newChit);
    }
    setLocal('chits', current);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return newChit;
  }

  static async updateChit(id: string, partial: any) {
    const res = await this.request(`/chits/${id}`, { method: 'PUT', body: JSON.stringify(partial) });
    const current = getLocal<any[]>('chits', DEFAULT_INITIAL_STATE.chits);
    const updated = current.map((c) => (c.id === id ? { ...c, ...partial } : c));
    setLocal('chits', updated);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return res || { ...partial, id };
  }

  static async deleteChit(id: string) {
    await this.request(`/chits/${id}`, { method: 'DELETE' });
    const current = getLocal<any[]>('chits', DEFAULT_INITIAL_STATE.chits);
    setLocal('chits', current.filter((c) => c.id !== id));
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return { success: true };
  }

  static async addChitPayment(chitId: string, payment: any) {
    const res = await this.request(`/chits/${chitId}/payments`, {
      method: 'POST',
      body: JSON.stringify(payment)
    });
    const current = getLocal<any[]>('chits', DEFAULT_INITIAL_STATE.chits);
    const newPayment = res?.payment || {
      id: 'pay_' + Date.now(),
      monthNumber: payment.monthNumber || 1,
      monthName: payment.monthName,
      amount: Number(payment.amount || 0),
      date: payment.date || new Date().toISOString().split('T')[0],
      notes: payment.notes || ''
    };
    const updated = current.map((c) => {
      if (c.id === chitId) {
        const payments = [newPayment, ...(c.payments || [])];
        return { ...c, payments };
      }
      return c;
    });
    setLocal('chits', updated);
    window.dispatchEvent(new CustomEvent('moneymate_data_changed'));
    return res || { success: true, payment: newPayment };
  }

  static async deleteChitPayment(chitId: string, paymentId: string) {
    await this.request(`/chits/${chitId}/payments/${paymentId}`, { method: 'DELETE' });
    const current = getLocal<any[]>('chits', DEFAULT_INITIAL_STATE.chits);
    const updated = current.map((c) => {
      if (c.id === chitId) {
        return {
          ...c,
          payments: (c.payments || []).filter((p: any) => p.id !== paymentId)
        };
      }
      return c;
    });
    setLocal('chits', updated);
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
