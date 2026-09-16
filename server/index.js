import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbManager } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' })); // Support base64 image uploads

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'MoneyMate - Uday Pedakota Personal Wealth Server',
    time: new Date().toISOString(),
    isMongo: dbManager.isMongoConnected
  });
});

/* ==========================================================================
   AUTHENTICATION & SESSION (MongoDB Atlas Verified)
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

    // Create session token
    const token = `moneymate_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    res.json({
      success: true,
      token,
      user: {
        id: user.id || user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName || 'Uday Pedakota',
        tier: 'Private Wealth Member'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const profile = await dbManager.get('profile');
    res.json({
      authenticated: true,
      user: {
        fullName: profile?.personal?.fullName || 'Uday Pedakota',
        username: profile?.personal?.username || 'udaypedakota',
        email: profile?.contact?.email || 'peddakotaudaykumar@gmail.com'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   PROFILE & PERSONAL INFORMATION
   ========================================================================== */
app.get('/api/profile', async (req, res) => {
  try {
    const profile = await dbManager.get('profile');
    const accounts = await dbManager.get('accounts');
    const transactions = await dbManager.get('transactions');

    // Calculate dynamic stats
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'credit') totalIncome += Number(tx.amount || 0);
      if (tx.type === 'debit') totalExpenses += Number(tx.amount || 0);
    });

    const bills = await dbManager.get('bills');
    const emis = await dbManager.get('emis');
    const creditCards = accounts.filter((a) => a.type === 'credit_card');

    res.json({
      ...profile,
      accounts,
      stats: {
        totalTransactions: transactions.length,
        totalIncome: totalIncome || profile.financial.monthlyIncome,
        totalExpenses: totalExpenses || 3700,
        totalSavings: (totalIncome || profile.financial.monthlyIncome) - totalExpenses,
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
    const current = await dbManager.get('profile');
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
    await dbManager.set('profile', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/profile/avatar', async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    const current = await dbManager.get('profile');
    current.personal.avatarUrl = avatarUrl || '';
    current.updatedAt = new Date().toISOString();
    await dbManager.set('profile', current);
    res.json({ success: true, avatarUrl: current.personal.avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   DASHBOARD SUMMARY (Real-time aggregated calculations)
   ========================================================================== */
app.get('/api/dashboard', async (req, res) => {
  try {
    const profile = await dbManager.get('profile');
    const accounts = await dbManager.get('accounts');
    const transactions = await dbManager.get('transactions');
    const bills = await dbManager.get('bills');
    const emis = await dbManager.get('emis');
    const chits = await dbManager.get('chits');
    const lending = await dbManager.get('lending');

    const todayStr = new Date().toISOString().split('T')[0];

    // Net liquid balance (cash + bank balances)
    let totalCashAndBank = 0;
    let totalCreditCardDue = 0;

    accounts.forEach((acc) => {
      if (acc.type === 'credit_card') {
        totalCreditCardDue += Math.abs(acc.balance || 0);
      } else {
        totalCashAndBank += Number(acc.balance || 0);
      }
    });

    // Today's expenses
    let todayExpense = 0;
    let thisMonthExpense = 0;
    let thisMonthIncome = 0;

    const currentMonth = todayStr.substring(0, 7);

    transactions.forEach((tx) => {
      const txDate = tx.date || '';
      const amount = Number(tx.amount || 0);

      if (txDate === todayStr && tx.type === 'debit') {
        todayExpense += amount;
      }
      if (txDate.startsWith(currentMonth)) {
        if (tx.type === 'debit') thisMonthExpense += amount;
        if (tx.type === 'credit') thisMonthIncome += amount;
      }
    });

    res.json({
      user: {
        fullName: profile.personal.fullName,
        firstName: profile.personal.firstName,
        avatarUrl: profile.personal.avatarUrl,
        tier: profile.tier
      },
      balances: {
        totalNetWorth: totalCashAndBank - totalCreditCardDue,
        totalCashAndBank,
        totalCreditCardDue,
        todayExpense,
        thisMonthIncome,
        thisMonthExpense,
        monthlyBudget: profile.financial.monthlyBudget,
        currencySymbol: profile.financial.currencySymbol || '₹'
      },
      accounts,
      counts: {
        transactionsCount: transactions.length,
        activeBillsCount: bills.filter((b) => b.status !== 'Settled').length,
        activeEmisCount: emis.length,
        activeChitsCount: chits.length,
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
   TRANSACTIONS (Daily money in / out)
   ========================================================================== */
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await dbManager.get('transactions');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
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

    const saved = await dbManager.addItem('transactions', newTx);

    // Auto-update account balance if matching account exists
    const accounts = await dbManager.get('accounts');
    const matchedAccount = accounts.find((a) => a.name === newTx.account);
    if (matchedAccount) {
      const delta = newTx.type === 'credit' ? newTx.amount : -newTx.amount;
      const newBal = Number(matchedAccount.balance || 0) + delta;
      await dbManager.updateItem('accounts', matchedAccount.id, { balance: newBal });
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const result = await dbManager.deleteItem('transactions', req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   BILLS, EMIS, CHITS, LENDING, ACCOUNTS
   ========================================================================== */
// Bills
app.get('/api/bills', async (req, res) => {
  res.json(await dbManager.get('bills'));
});

app.post('/api/bills', async (req, res) => {
  const newBill = await dbManager.addItem('bills', req.body);
  res.status(201).json(newBill);
});

app.patch('/api/bills/:id/pay', async (req, res) => {
  const updated = await dbManager.updateItem('bills', req.params.id, { status: 'Settled', paidAt: new Date().toISOString() });
  res.json(updated);
});

app.delete('/api/bills/:id', async (req, res) => {
  res.json(await dbManager.deleteItem('bills', req.params.id));
});

// EMIs
app.get('/api/emis', async (req, res) => {
  res.json(await dbManager.get('emis'));
});

app.post('/api/emis', async (req, res) => {
  const newEmi = await dbManager.addItem('emis', req.body);
  res.status(201).json(newEmi);
});

app.delete('/api/emis/:id', async (req, res) => {
  res.json(await dbManager.deleteItem('emis', req.params.id));
});

// Chits
app.get('/api/chits', async (req, res) => {
  res.json(await dbManager.get('chits'));
});

app.post('/api/chits', async (req, res) => {
  const newChit = await dbManager.addItem('chits', req.body);
  res.status(201).json(newChit);
});

app.delete('/api/chits/:id', async (req, res) => {
  res.json(await dbManager.deleteItem('chits', req.params.id));
});

// Lending (Money Lent & Borrowed)
app.get('/api/lending', async (req, res) => {
  res.json(await dbManager.get('lending'));
});

app.post('/api/lending', async (req, res) => {
  const newRecord = await dbManager.addItem('lending', req.body);
  res.status(201).json(newRecord);
});

app.patch('/api/lending/:id/return', async (req, res) => {
  const updated = await dbManager.updateItem('lending', req.params.id, { status: 'Returned', returnedAt: new Date().toISOString() });
  res.json(updated);
});

app.delete('/api/lending/:id', async (req, res) => {
  res.json(await dbManager.deleteItem('lending', req.params.id));
});

// Accounts
app.get('/api/accounts', async (req, res) => {
  res.json(await dbManager.get('accounts'));
});

app.post('/api/accounts', async (req, res) => {
  const newAcc = await dbManager.addItem('accounts', req.body);
  res.status(201).json(newAcc);
});

app.put('/api/accounts/:id', async (req, res) => {
  const updated = await dbManager.updateItem('accounts', req.params.id, req.body);
  res.json(updated);
});

app.delete('/api/accounts/:id', async (req, res) => {
  res.json(await dbManager.deleteItem('accounts', req.params.id));
});

// Reset
app.post('/api/reset', async (req, res) => {
  const resetData = await dbManager.resetAll();
  res.json({ success: true, data: resetData });
});

app.listen(PORT, () => {
  console.log(`🚀 MoneyMate Server running at http://localhost:${PORT}`);
});
