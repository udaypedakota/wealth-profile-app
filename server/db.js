import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Use reliable DNS servers for MongoDB Atlas SRV resolution on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial realistic default data for Uday Pedakota
export const INITIAL_DATABASE = {
  profile: {
    id: 'uday_pedakota_01',
    personal: {
      fullName: 'Uday Pedakota',
      firstName: 'Uday',
      lastName: 'Pedakota',
      username: 'uday_pedakota',
      age: 28,
      dateOfBirth: '1998-03-31',
      gender: 'Male',
      avatarUrl: '',
      bio: 'Personal Wealth & Daily Money Ledger. Real-time daily tracking for expenses, income, bills, and investments.'
    },
    contact: {
      email: 'peddakotaudaykumar@gmail.com',
      mobile: '9908660573',
      altMobile: '',
      address: 'Pedakota Residence',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      country: 'India',
      zipCode: '530001'
    },
    financial: {
      currency: 'INR',
      currencySymbol: '₹',
      defaultAccountId: 'acc_cash_01',
      monthlyIncome: 85000,
      monthlyBudget: 35000,
      savingsTarget: 30000,
      financialGoal: 'Long-Term Wealth Building & Systematic Savings',
      preferredPaymentMethod: 'UPI',
      riskAppetite: 'Moderate',
      taxFilingStatus: 'Individual'
    },
    notifications: {
      billReminders: true,
      emiAlerts: true,
      chitPayments: true,
      creditCardDues: true,
      upcomingPayments: true,
      overduePayments: true,
      budgetAlerts: true,
      financialInsights: true,
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true
    },
    appearance: {
      theme: 'dark',
      density: 'comfortable',
      accentColor: 'emerald',
      defaultTab: 'dashboard',
      animationsEnabled: true
    },
    security: {
      hasPin: true,
      twoFactorAuth: false,
      maskBalances: false,
      maskAccountNumbers: true,
      lastLogin: 'Active Today',
      activeSessions: [
        {
          id: 'sess_1',
          deviceName: 'Primary Mobile Device',
          browser: 'Chrome Mobile',
          os: 'Android / iOS',
          ip: '127.0.0.1',
          location: 'Andhra Pradesh, India',
          lastActive: 'Active Now',
          isCurrent: true
        }
      ]
    },
    memberSince: '2024-01-10',
    tier: 'Private Wealth Member',
    kycVerified: true,
    updatedAt: new Date().toISOString()
  },
  accounts: [
    {
      id: 'acc_cash_01',
      name: 'Cash in Hand (Wallet)',
      type: 'cash',
      institution: 'Physical Wallet',
      maskedNumber: 'CASH-WALLET',
      balance: 12500,
      currency: 'INR',
      status: 'primary',
      cardColor: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)'
    },
    {
      id: 'acc_bank_02',
      name: 'Primary Savings Bank Account',
      type: 'bank',
      institution: 'State Bank of India / HDFC',
      maskedNumber: '•••• 5732',
      balance: 68400,
      currency: 'INR',
      status: 'active',
      cardColor: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
    },
    {
      id: 'acc_card_03',
      name: 'Primary Credit Card',
      type: 'credit_card',
      institution: 'Bank Credit Line',
      maskedNumber: '•••• 1998',
      balance: -14200,
      currency: 'INR',
      status: 'active',
      expiryDate: '03/29',
      cardColor: 'linear-gradient(135deg, #374151 0%, #111827 100%)'
    }
  ],
  transactions: [
    {
      id: 'tx_1',
      title: 'Monthly Salary Credit',
      category: 'Salary',
      amount: 85000,
      type: 'credit',
      account: 'Primary Savings Bank Account',
      date: new Date().toISOString().split('T')[0],
      notes: 'Monthly salary inflow',
      status: 'Completed'
    },
    {
      id: 'tx_2',
      title: 'Groceries & Household Supplies',
      category: 'Food & Groceries',
      amount: 3200,
      type: 'debit',
      account: 'Primary Savings Bank Account',
      date: new Date().toISOString().split('T')[0],
      notes: 'Weekly supermarket shopping',
      status: 'Completed'
    },
    {
      id: 'tx_3',
      title: 'Petrol / Fuel Refill',
      category: 'Transportation',
      amount: 500,
      type: 'debit',
      account: 'Cash in Hand (Wallet)',
      date: new Date().toISOString().split('T')[0],
      notes: 'Bike petrol',
      status: 'Completed'
    }
  ],
  bills: [
    {
      id: 'bill_1',
      title: 'Electricity Bill',
      amount: 1450,
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      status: 'Pending',
      category: 'Utilities'
    },
    {
      id: 'bill_2',
      title: 'Mobile Recharge / WiFi Broadband',
      amount: 799,
      dueDate: new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0],
      status: 'Pending',
      category: 'Internet'
    }
  ],
  emis: [
    {
      id: 'emi_1',
      title: 'Two Wheeler / Personal Loan EMI',
      lender: 'Bank Finance',
      monthlyAmount: 4500,
      totalTenures: 24,
      tenuresLeft: 14,
      nextDue: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
      status: 'Active'
    }
  ],
  chits: [
    {
      id: 'chit_1',
      title: '20-Month Family Chit Fund',
      monthlySubscription: 5000,
      totalPotValue: 100000,
      currentMonth: 'Month 8 of 20',
      status: 'Active'
    }
  ],
  lending: [
    {
      id: 'lend_1',
      type: 'lent', // 'lent' or 'borrowed'
      personName: 'Suresh (Friend)',
      amount: 5000,
      date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      notes: 'Emergency medical advance',
      status: 'Pending'
    }
  ]
};

class DatabaseManager {
  constructor() {
    this.mongoClient = null;
    this.mongoDb = null;
    this.isMongoConnected = false;
    this.init();
  }

  async init() {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && mongoUri.startsWith('mongodb')) {
      try {
        console.log('Connecting to MongoDB Atlas cluster...');
        this.mongoClient = new MongoClient(mongoUri);
        await this.mongoClient.connect();
        this.mongoDb = this.mongoClient.db('wealthapp');
        this.isMongoConnected = true;
        console.log('✅ Connected successfully to MongoDB Atlas!');

        // Ensure users collection exists with Uday Pedakota credentials in MongoDB Atlas
        const usersCol = this.mongoDb.collection('users');
        const defaultUser = {
          id: 'user_uday_01',
          username: 'udaypedakota',
          email: 'peddakotaudaykumar@gmail.com',
          password: 'Uday8329',
          fullName: 'Uday Pedakota',
          createdAt: new Date().toISOString()
        };
        const existingUser = await usersCol.findOne({
          $or: [{ username: 'udaypedakota' }, { email: 'peddakotaudaykumar@gmail.com' }]
        });
        if (!existingUser) {
          await usersCol.insertOne(defaultUser);
          console.log('✅ Created user credentials in MongoDB Atlas (username: udaypedakota)!');
        }

        // Automatically seed MongoDB if empty
        const profileCol = this.mongoDb.collection('profile');
        const existing = await profileCol.findOne({ id: 'uday_pedakota_01' });
        if (!existing) {
          console.log('Migrating local data to MongoDB Atlas...');
          const localData = this.readLocalDb();
          await profileCol.insertOne(localData.profile || INITIAL_DATABASE.profile);
          for (const col of ['transactions', 'bills', 'emis', 'chits', 'lending', 'accounts']) {
            const arr = localData[col] || INITIAL_DATABASE[col] || [];
            if (arr.length > 0) {
              await this.mongoDb.collection(col).insertMany(arr);
            }
          }
          console.log('✅ Migrated all records to MongoDB Atlas cloud!');
        }
        return;
      } catch (err) {
        console.warn('⚠️ MongoDB Atlas connection failed, falling back to local file storage:', err.message);
      }
    }

    // Local JSON File DB initialization
    if (!fs.existsSync(DB_FILE)) {
      this.writeLocalDb(INITIAL_DATABASE);
      console.log('✅ Initialized local storage database at:', DB_FILE);
    } else {
      console.log('✅ Local database loaded from:', DB_FILE);
    }
  }

  readLocalDb() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.writeLocalDb(INITIAL_DATABASE);
        return INITIAL_DATABASE;
      }
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading local DB, restoring defaults:', err);
      return INITIAL_DATABASE;
    }
  }

  writeLocalDb(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing local DB:', err);
    }
  }

  // Generic Get Collection / Entity
  async get(key) {
    if (this.isMongoConnected && this.mongoDb) {
      try {
        const col = this.mongoDb.collection(key);
        if (key === 'profile') {
          const doc = await col.findOne({ id: 'uday_pedakota_01' });
          return doc || INITIAL_DATABASE.profile;
        }
        return await col.find({}).toArray();
      } catch (e) {
        console.warn('Mongo read error, reading local fallback', e);
      }
    }
    const db = this.readLocalDb();
    return db[key] || INITIAL_DATABASE[key] || [];
  }

  // Generic Save / Update Entity
  async set(key, value) {
    if (this.isMongoConnected && this.mongoDb) {
      try {
        const col = this.mongoDb.collection(key);
        if (key === 'profile') {
          await col.replaceOne({ id: 'uday_pedakota_01' }, value, { upsert: true });
        }
      } catch (e) {
        console.warn('Mongo write error', e);
      }
    }
    const db = this.readLocalDb();
    db[key] = value;
    this.writeLocalDb(db);
    return value;
  }

  // Add Item to Array Collection
  async addItem(collectionKey, item) {
    const newItem = {
      ...item,
      id: item.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };

    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection(collectionKey).insertOne(newItem);
      } catch (e) {
        console.warn('Mongo insert error', e);
      }
    }

    const db = this.readLocalDb();
    if (!Array.isArray(db[collectionKey])) {
      db[collectionKey] = [];
    }
    db[collectionKey].unshift(newItem); // newest first
    this.writeLocalDb(db);
    return newItem;
  }

  // Delete Item from Array Collection
  async deleteItem(collectionKey, itemId) {
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection(collectionKey).deleteOne({ id: itemId });
      } catch (e) {
        console.warn('Mongo delete error', e);
      }
    }

    const db = this.readLocalDb();
    if (Array.isArray(db[collectionKey])) {
      db[collectionKey] = db[collectionKey].filter((i) => i.id !== itemId);
      this.writeLocalDb(db);
    }
    return { success: true, id: itemId };
  }

  // Update Item in Array Collection
  async updateItem(collectionKey, itemId, partialUpdate) {
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection(collectionKey).updateOne({ id: itemId }, { $set: partialUpdate });
      } catch (e) {
        console.warn('Mongo update error', e);
      }
    }

    const db = this.readLocalDb();
    if (Array.isArray(db[collectionKey])) {
      db[collectionKey] = db[collectionKey].map((i) => (i.id === itemId ? { ...i, ...partialUpdate } : i));
      this.writeLocalDb(db);
    }
    return partialUpdate;
  }

  // User Authentication
  async findUser(usernameOrEmail) {
    const queryStr = (usernameOrEmail || '').trim();
    if (!queryStr) return null;

    if (this.isMongoConnected && this.mongoDb) {
      try {
        const usersCol = this.mongoDb.collection('users');
        const user = await usersCol.findOne({
          $or: [
            { username: { $regex: new RegExp(`^${queryStr}$`, 'i') } },
            { email: { $regex: new RegExp(`^${queryStr}$`, 'i') } }
          ]
        });
        if (user) return user;
      } catch (e) {
        console.warn('Mongo findUser error:', e);
      }
    }

    // Local fallback
    const localDb = this.readLocalDb();
    const users = localDb.users || [
      {
        id: 'user_uday_01',
        username: 'udaypedakota',
        email: 'peddakotaudaykumar@gmail.com',
        password: 'Uday8329',
        fullName: 'Uday Pedakota'
      }
    ];

    return users.find(
      (u) =>
        (u.username && u.username.toLowerCase() === queryStr.toLowerCase()) ||
        (u.email && u.email.toLowerCase() === queryStr.toLowerCase())
    );
  }

  // Reset database back to default initial state
  async resetAll() {
    this.writeLocalDb(INITIAL_DATABASE);
    return INITIAL_DATABASE;
  }
}

export const dbManager = new DatabaseManager();
