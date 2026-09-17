import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbManager } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json({ limit: '20mb' })); // Support base64 image uploads

// Ensure /api prefix matches even if serverless environment strips it
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

// Helper to extract active userId from request headers or auth token
function getUserId(req) {
  if (req.userId) return req.userId;

  // 1. Check custom header x-user-id
  const headerUserId = req.headers['x-user-id'];
  if (headerUserId && typeof headerUserId === 'string' && headerUserId.trim()) {
    return headerUserId.trim();
  }

  // 2. Check query param ?userId=
  if (req.query && req.query.userId && typeof req.query.userId === 'string') {
    return req.query.userId.trim();
  }

  // 3. Check Authorization header
  const auth = req.headers['authorization'] || '';
  if (auth.startsWith('Bearer moneymate_')) {
    const tokenBody = auth.replace('Bearer moneymate_', '');
    // token format: moneymate_${userId}_${timestamp}
    const lastUnderscore = tokenBody.lastIndexOf('_');
    if (lastUnderscore > 0) {
      const extractedUserId = tokenBody.substring(0, lastUnderscore);
      if (extractedUserId) {
        return extractedUserId;
      }
    }
  }

  return null;
}

// Global Auth guard middleware for all data endpoints
app.use((req, res, next) => {
  const publicPaths = ['/api/health', '/api/auth/login', '/api/auth/register', '/api/auth/logout', '/api/auth/me'];
  const pathOnly = (req.path || req.url.split('?')[0]).toLowerCase();
  if (publicPaths.some((p) => pathOnly === p || pathOnly.startsWith(p + '/'))) {
    return next();
  }
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in to access your financial records.' });
  }
  req.userId = userId;
  next();
});

// Health check
app.get('/api/health', async (req, res) => {
  if (dbManager.initPromise) {
    try {
      await Promise.race([
        dbManager.initPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]);
    } catch {}
  }
  res.json({
    status: 'online',
    app: 'MoneyMate - Multi-User Personal Wealth Server',
    time: new Date().toISOString(),
    isMongo: dbManager.isMongoConnected
  });
});

/* ==========================================================================
   AUTHENTICATION & SESSION (MongoDB Atlas Verified & Multi-User Enabled)
   ========================================================================== */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body || {};
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/Email and Password are required.' });
    }

    const user = await dbManager.findUser(usernameOrEmail);
    if (!user) {
      return res.status(401).json({ error: 'Account not found. Please check your username or email.' });
    }

    // Verify password directly
    if (user.password !== password.trim()) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const userId = user.id || user._id?.toString();
    // Create session token with userId embedded
    const token = `moneymate_${userId}_${Date.now()}`;

    res.json({
      success: true,
      token,
      user: {
        id: userId,
        username: user.username,
        email: user.email,
        fullName: user.fullName || user.username,
        tier: user.tier || 'Private Wealth Member'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, username, email, mobile, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const result = await dbManager.registerUser({
      fullName: fullName || username,
      username,
      email,
      mobile,
      password
    });

    res.status(201).json(result);
  } catch (err) {
    console.warn('Registration error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.json({ authenticated: false, user: null });
    }
    const profile = await dbManager.get('profile', userId);
    res.json({
      authenticated: true,
      user: {
        id: userId,
        fullName: profile?.personal?.fullName || (userId === 'user_uday_01' ? 'Uday Pedakota' : 'MoneyMate Member'),
        username: profile?.personal?.username || (userId === 'user_uday_01' ? 'udaypedakota' : 'user'),
        email: profile?.contact?.email || (userId === 'user_uday_01' ? 'peddakotaudaykumar@gmail.com' : '')
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   PROFILE & PERSONAL INFORMATION (Scoped by User)
   ========================================================================== */
app.get('/api/profile', async (req, res) => {
  try {
    const userId = getUserId(req);
    const profile = await dbManager.get('profile', userId);
    const accounts = await dbManager.get('accounts', userId);
    const transactions = await dbManager.get('transactions', userId);

    // Calculate dynamic stats
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'credit') totalIncome += Number(tx.amount || 0);
      if (tx.type === 'debit') totalExpenses += Number(tx.amount || 0);
    });

    const bills = await dbManager.get('bills', userId);
    const emis = await dbManager.get('emis', userId);
    const creditCards = accounts.filter((a) => a.type === 'credit_card');

    res.json({
      ...profile,
      accounts,
      stats: {
        totalTransactions: transactions.length,
        totalIncome: totalIncome || profile.financial?.monthlyIncome || 0,
        totalExpenses: totalExpenses || 0,
        totalSavings: (totalIncome || profile.financial?.monthlyIncome || 0) - totalExpenses,
        activeBills: bills.filter((b) => b.status !== 'Settled').length,
        activeEmis: emis.length,
        creditCardsCount: creditCards.length,
        accountsCount: accounts.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    const userId = getUserId(req);
    const current = await dbManager.get('profile', userId);
    const updated = {
      ...current,
      ...req.body,
      personal: { ...current.personal, ...(req.body.personal || {}) },
      contact: { ...current.contact, ...(req.body.contact || {}) },
      financial: { ...current.financial, ...(req.body.financial || {}) },
      appearance: { ...current.appearance, ...(req.body.appearance || {}) },
      notifications: { ...current.notifications, ...(req.body.notifications || {}) },
      security: { ...current.security, ...(req.body.security || {}) },
      updatedAt: new Date().toISOString()
    };
    await dbManager.set('profile', updated, userId);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/profile/avatar', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { avatarUrl } = req.body;
    const current = await dbManager.get('profile', userId);
    if (!current.personal) current.personal = {};
    current.personal.avatarUrl = avatarUrl || '';
    current.updatedAt = new Date().toISOString();
    await dbManager.set('profile', current, userId);
    res.json({ success: true, avatarUrl: current.personal.avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   DASHBOARD SUMMARY (Real-time aggregated calculations scoped by User)
   ========================================================================== */
app.get('/api/dashboard', async (req, res) => {
  try {
    const userId = getUserId(req);
    const profile = await dbManager.get('profile', userId);
    const accounts = await dbManager.get('accounts', userId);
    const transactions = await dbManager.get('transactions', userId);
    const bills = await dbManager.get('bills', userId);
    const emis = await dbManager.get('emis', userId);
    const chits = await dbManager.get('chits', userId);
    const lending = await dbManager.get('lending', userId);

    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Credit Cards & Bank Balances
    let totalCashAndBank = 0;
    let totalCreditLimit = 0;
    let totalCreditUsed = 0;

    accounts.forEach((acc) => {
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

    // 2. Bills
    let pendingBillsAmount = 0;
    let settledBillsAmount = 0;
    bills.forEach((b) => {
      const amt = Number(b.amount || 0);
      if (b.status === 'Settled' || b.isPaid) {
        settledBillsAmount += amt;
      } else {
        pendingBillsAmount += amt;
      }
    });

    // 3. Loans & EMIs
    let monthlyEmiTotal = 0;
    let totalLoanAmount = 0;
    emis.forEach((e) => {
      const mEmi = Number(e.monthlyAmount || e.monthlyEmi || 0);
      monthlyEmiTotal += mEmi;
      const tLoan = Number(e.totalLoanAmount || (mEmi * (Number(e.totalTenures) || 24)));
      totalLoanAmount += tLoan;
    });

    // 4. Chits
    let monthlyChitsTotal = 0;
    let totalChitPool = 0;
    let totalChitPaid = 0;
    chits.forEach((c) => {
      const mChit = Number(c.monthlyAmount || c.monthlySubscription || 0);
      monthlyChitsTotal += mChit;
      totalChitPool += Number(c.totalAmount || c.totalPotValue || 0);
      if (Array.isArray(c.payments)) {
        totalChitPaid += c.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
      }
    });
    const remainingChitPool = Math.max(0, totalChitPool - totalChitPaid);

    // 5. Lending & Hand Loans
    let moneyLentTotal = 0;
    let moneyBorrowedTotal = 0;
    lending.forEach((l) => {
      const amt = Number(l.amount || 0);
      if (l.status === 'Pending') {
        if (l.type === 'lent') moneyLentTotal += amt;
        if (l.type === 'borrowed') moneyBorrowedTotal += amt;
      }
    });

    // 6. Today's, Yesterday's & Month's Cash Flow
    let todayExpense = 0;
    let yesterdayExpense = 0;
    let thisMonthExpense = 0;
    let thisMonthIncome = 0;

    const currentMonth = todayStr.substring(0, 7);
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Category breakdown
    const categoryMap = {};
    let totalExpenseCategorized = 0;

    transactions.forEach((tx) => {
      const txDate = tx.date || '';
      const amount = Number(tx.amount || 0);

      if (txDate === todayStr && tx.type === 'debit') {
        todayExpense += amount;
      }
      if (txDate === yesterdayDate && tx.type === 'debit') {
        yesterdayExpense += amount;
      }
      if (txDate.startsWith(currentMonth)) {
        if (tx.type === 'debit') thisMonthExpense += amount;
        if (tx.type === 'credit') thisMonthIncome += amount;
      }
      if (tx.type === 'debit') {
        const cat = tx.category || 'Other Expense';
        categoryMap[cat] = (categoryMap[cat] || 0) + amount;
        totalExpenseCategorized += amount;
      }
    });

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenseCategorized > 0 ? Math.round((amount / totalExpenseCategorized) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const chitsList = chits.map((c) => {
      const totalAmt = Number(c.totalAmount || c.totalPotValue || 0);
      const paid = Array.isArray(c.payments) ? c.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0) : 0;
      return {
        id: c.id,
        name: c.name || c.title || 'Chit Fund',
        totalAmount: totalAmt,
        paidAmount: paid,
        remainingAmount: Math.max(0, totalAmt - paid),
        progressPercent: totalAmt > 0 ? Math.min(100, Math.round((paid / totalAmt) * 100)) : 0,
        monthlyAmount: Number(c.monthlyAmount || c.monthlySubscription || 0),
        status: c.status || 'Active'
      };
    });

    const monthlySalary = Number(profile.financial?.monthlyIncome || 0);
    const totalMonthlyCommitments = monthlyEmiTotal + monthlyChitsTotal + pendingBillsAmount + totalCreditUsed;
    const remainingDisposable = Math.max(0, monthlySalary - (monthlyEmiTotal + monthlyChitsTotal + pendingBillsAmount));

    res.json({
      user: {
        fullName: profile.personal?.fullName || 'MoneyMate Member',
        firstName: profile.personal?.firstName || 'Member',
        avatarUrl: profile.personal?.avatarUrl || '',
        tier: profile.tier || 'Private Wealth Member'
      },
      balances: {
        totalNetWorth: totalCashAndBank - totalCreditUsed,
        totalCashAndBank,
        totalCreditCardDue: totalCreditUsed,
        todayExpense,
        yesterdayExpense,
        thisMonthIncome,
        thisMonthExpense,
        monthlyIncome: monthlySalary,
        monthlyBudget: profile.financial?.monthlyBudget || 35000,
        currencySymbol: profile.financial?.currencySymbol || '₹'
      },
      categoryBreakdown,
      chitsList,
      sectionBreakdowns: {
        creditCards: {
          totalLimit: totalCreditLimit,
          totalUsed: totalCreditUsed,
          available: totalCreditAvailable,
          utilization: creditUtilization,
          count: accounts.filter((a) => a.type === 'credit_card').length
        },
        bills: {
          pendingAmount: pendingBillsAmount,
          settledAmount: settledBillsAmount,
          totalAmount: pendingBillsAmount + settledBillsAmount,
          pendingCount: bills.filter((b) => b.status !== 'Settled').length,
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
          pendingCount: lending.filter((l) => l.status === 'Pending').length
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
        activeBillsCount: bills.filter((b) => b.status !== 'Settled').length,
        activeEmisCount: emis.length,
        activeChitsCount: chits.length,
        creditCardsCount: accounts.filter((a) => a.type === 'credit_card').length,
        moneyLentPending: lending.filter((l) => l.type === 'lent' && l.status === 'Pending').length
      },
      recentTransactions: transactions.slice(0, 8),
      upcomingBills: bills.filter((b) => b.status !== 'Settled').slice(0, 4)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   TRANSACTIONS (Daily money in / out scoped by User)
   ========================================================================== */
app.get('/api/transactions', async (req, res) => {
  try {
    const userId = getUserId(req);
    const transactions = await dbManager.get('transactions', userId);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { title, category, amount, type, account, notes, date } = req.body;

    if (!title || !amount || !type) {
      return res.status(400).json({ error: 'Title, amount, and type (credit/debit) are required.' });
    }

    const newTx = {
      title,
      category: category || (type === 'credit' ? 'Income' : 'Daily Expense'),
      amount: Number(amount),
      type, // 'credit' or 'debit'
      account: account || 'Cash in Hand (Wallet)',
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || '',
      status: 'Completed'
    };

    const saved = await dbManager.addItem('transactions', newTx, userId);

    // Auto-update account balance if matching account exists
    const accounts = await dbManager.get('accounts', userId);
    const matchedAccount = accounts.find((a) => a.name === newTx.account);
    if (matchedAccount) {
      const delta = newTx.type === 'credit' ? newTx.amount : -newTx.amount;
      const newBal = Number(matchedAccount.balance || 0) + delta;
      await dbManager.updateItem('accounts', matchedAccount.id, { balance: newBal }, userId);
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    const result = await dbManager.deleteItem('transactions', req.params.id, userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   BILLS, EMIS, CHITS, LENDING, ACCOUNTS (Scoped by User)
   ========================================================================== */
// Bills
app.get('/api/bills', async (req, res) => {
  const userId = getUserId(req);
  res.json(await dbManager.get('bills', userId));
});

app.post('/api/bills', async (req, res) => {
  const userId = getUserId(req);
  const newBill = await dbManager.addItem('bills', req.body, userId);
  res.status(201).json(newBill);
});

app.patch('/api/bills/:id/pay', async (req, res) => {
  const userId = getUserId(req);
  const updated = await dbManager.updateItem('bills', req.params.id, { status: 'Settled', paidAt: new Date().toISOString() }, userId);
  res.json(updated);
});

app.delete('/api/bills/:id', async (req, res) => {
  const userId = getUserId(req);
  res.json(await dbManager.deleteItem('bills', req.params.id, userId));
});

// EMIs
app.get('/api/emis', async (req, res) => {
  const userId = getUserId(req);
  res.json(await dbManager.get('emis', userId));
});

app.post('/api/emis', async (req, res) => {
  const userId = getUserId(req);
  const newEmi = await dbManager.addItem('emis', req.body, userId);
  res.status(201).json(newEmi);
});

app.delete('/api/emis/:id', async (req, res) => {
  const userId = getUserId(req);
  res.json(await dbManager.deleteItem('emis', req.params.id, userId));
});

// Chits
app.get('/api/chits', async (req, res) => {
  const userId = getUserId(req);
  res.json(await dbManager.get('chits', userId));
});

app.post('/api/chits', async (req, res) => {
  const userId = getUserId(req);
  const chitData = {
    ...req.body,
    payments: req.body.payments || []
  };
  const newChit = await dbManager.addItem('chits', chitData, userId);
  res.status(201).json(newChit);
});

app.put('/api/chits/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    const updated = await dbManager.updateItem('chits', req.params.id, req.body, userId);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/chits/:id', async (req, res) => {
  const userId = getUserId(req);
  res.json(await dbManager.deleteItem('chits', req.params.id, userId));
});

// Add Chit Payment
app.post('/api/chits/:id/payments', async (req, res) => {
  try {
    const userId = getUserId(req);
    const chits = await dbManager.get('chits', userId);
    const chit = chits.find((c) => c.id === req.params.id);
    if (!chit) {
      return res.status(404).json({ error: 'Chit not found' });
    }

    const existingPayments = Array.isArray(chit.payments) ? chit.payments : [];
    const newPayment = {
      id: 'pay_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      monthNumber: req.body.monthNumber || existingPayments.length + 1,
      monthName: req.body.monthName || new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      amount: Number(req.body.amount || 0),
      date: req.body.date || new Date().toISOString().split('T')[0],
      notes: req.body.notes || ''
    };

    const updatedPayments = [newPayment, ...existingPayments];
    await dbManager.updateItem('chits', req.params.id, { payments: updatedPayments }, userId);

    res.status(201).json({ success: true, payment: newPayment, payments: updatedPayments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Chit Payment
app.delete('/api/chits/:id/payments/:paymentId', async (req, res) => {
  try {
    const userId = getUserId(req);
    const chits = await dbManager.get('chits', userId);
    const chit = chits.find((c) => c.id === req.params.id);
    if (!chit) {
      return res.status(404).json({ error: 'Chit not found' });
    }

    const updatedPayments = (chit.payments || []).filter((p) => p.id !== req.params.paymentId);
    await dbManager.updateItem('chits', req.params.id, { payments: updatedPayments }, userId);

    res.json({ success: true, payments: updatedPayments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lending (Money Lent & Borrowed)
app.get('/api/lending', async (req, res) => {
  const userId = getUserId(req);
  res.json(await dbManager.get('lending', userId));
});

app.post('/api/lending', async (req, res) => {
  const userId = getUserId(req);
  const newRecord = await dbManager.addItem('lending', req.body, userId);
  res.status(201).json(newRecord);
});

app.patch('/api/lending/:id/return', async (req, res) => {
  const userId = getUserId(req);
  const updated = await dbManager.updateItem('lending', req.params.id, { status: 'Returned', returnedAt: new Date().toISOString() }, userId);
  res.json(updated);
});

app.delete('/api/lending/:id', async (req, res) => {
  const userId = getUserId(req);
  res.json(await dbManager.deleteItem('lending', req.params.id, userId));
});

// Accounts
app.get('/api/accounts', async (req, res) => {
  const userId = getUserId(req);
  res.json(await dbManager.get('accounts', userId));
});

app.post('/api/accounts', async (req, res) => {
  const userId = getUserId(req);
  const newAcc = await dbManager.addItem('accounts', req.body, userId);
  res.status(201).json(newAcc);
});

app.put('/api/accounts/:id', async (req, res) => {
  const userId = getUserId(req);
  const updated = await dbManager.updateItem('accounts', req.params.id, req.body, userId);
  res.json(updated);
});

app.delete('/api/accounts/:id', async (req, res) => {
  const userId = getUserId(req);
  res.json(await dbManager.deleteItem('accounts', req.params.id, userId));
});

// Reset
app.post('/api/reset', async (req, res) => {
  const resetData = await dbManager.resetAll();
  res.json({ success: true, data: resetData });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 MoneyMate Server running at http://localhost:${PORT}`);
  });
}

export default app;
