import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Use reliable DNS servers for MongoDB Atlas SRV resolution on Windows only
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {}
}

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
      monthlyIncome: 60000,
      monthlyBudget: 35000,
      savingsTarget: 25000,
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
      balance: 0,
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
      balance: 0,
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
  ],
  transactions: [
    {
      id: 'tx_1',
      title: 'Monthly Salary Credit',
      category: 'Salary',
      amount: 60000,
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

// Clean starter profile template for standard / new registered members (Zero data leakage from Uday)
export const CLEAN_USER_PROFILE_TEMPLATE = {
  personal: {
    fullName: '',
    firstName: '',
    lastName: '',
    username: '',
    age: null,
    dateOfBirth: '',
    gender: '',
    avatarUrl: '',
    bio: 'Personal Money Ledger & Wealth Tracking'
  },
  contact: {
    email: '',
    mobile: '',
    altMobile: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: ''
  },
  financial: {
    currency: 'INR',
    currencySymbol: '₹',
    defaultAccountId: '',
    monthlyIncome: 0,
    monthlyBudget: 0,
    savingsTarget: 0,
    financialGoal: 'Personal Wealth Building & Systematic Savings',
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
    hasPin: false,
    twoFactorAuth: false,
    maskBalances: false,
    maskAccountNumbers: true,
    lastLogin: 'Active Today',
    activeSessions: []
  },
  memberSince: new Date().toISOString().split('T')[0],
  tier: 'Private Wealth Member',
  kycVerified: false,
  accounts: [],
  updatedAt: new Date().toISOString()
};

const DIRECT_MONGO_URI = 'mongodb://udaypedakota:Uday8329@ac-f5pro8o-shard-00-00.khqhjse.mongodb.net:27017,ac-f5pro8o-shard-00-01.khqhjse.mongodb.net:27017,ac-f5pro8o-shard-00-02.khqhjse.mongodb.net:27017/wealthapp?ssl=true&replicaSet=atlas-12ok2r-shard-0&authSource=admin&retryWrites=true&w=majority';
const SRV_MONGO_URI = 'mongodb+srv://udaypedakota:Uday8329@cluster0.khqhjse.mongodb.net/wealthapp?retryWrites=true&w=majority&appName=Cluster0';

class DatabaseManager {
  constructor() {
    this.mongoClient = global._mongoClient || null;
    this.mongoDb = global._mongoDb || null;
    this.isMongoConnected = !!(global._mongoClient && global._mongoDb);
    this.initPromise = this.init();
  }

  async init() {
    if (global._mongoDb && global._mongoClient) {
      this.mongoClient = global._mongoClient;
      this.mongoDb = global._mongoDb;
      this.isMongoConnected = true;
      return;
    }

    const urisToTry = [];
    if (process.env.MONGODB_URI) urisToTry.push(process.env.MONGODB_URI);
    // Direct URI connects fast and has zero SRV/UDP dependencies on cloud/serverless
    urisToTry.push(DIRECT_MONGO_URI);
    urisToTry.push(SRV_MONGO_URI);

    const uniqueUris = [...new Set(urisToTry)];

    for (const uri of uniqueUris) {
      try {
        console.log('Connecting to MongoDB Atlas cluster...');
        this.mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
        await this.mongoClient.connect();
        this.mongoDb = this.mongoClient.db('wealthapp');
        this.isMongoConnected = true;
        global._mongoClient = this.mongoClient;
        global._mongoDb = this.mongoDb;
        console.log('✅ Connected successfully to MongoDB Atlas!');
        break;
      } catch (err) {
        console.warn('⚠️ MongoDB Atlas connection attempt failed, trying fallback URI:', err.message);
      }
    }

    if (this.isMongoConnected && this.mongoDb) {
      try {
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

        // Ensure chits collection is seeded with 3L Chit if empty
        const chitsCol = this.mongoDb.collection('chits');
        const chitCount = await chitsCol.countDocuments();
        if (chitCount === 0 && INITIAL_DATABASE.chits && INITIAL_DATABASE.chits.length > 0) {
          await chitsCol.insertMany(INITIAL_DATABASE.chits);
          console.log('✅ Seeded initial 3L Chit to MongoDB Atlas!');
        }

        // Ensure all collections are seeded if empty
        for (const colName of ['accounts', 'bills', 'emis', 'lending', 'transactions']) {
          const col = this.mongoDb.collection(colName);
          const count = await col.countDocuments();
          if (count === 0 && INITIAL_DATABASE[colName] && INITIAL_DATABASE[colName].length > 0) {
            await col.insertMany(INITIAL_DATABASE[colName]);
            console.log(`✅ Seeded initial ${colName} to MongoDB Atlas!`);
          }
        }

        // Ensure profile monthlyIncome is set to 60000
        await profileCol.updateOne(
          { id: 'uday_pedakota_01' },
          { $set: { 'financial.monthlyIncome': 60000 } }
        );

        // Ensure credit card accounts exist and have creditLimit, usedAmount, availableLimit
        const accountsCol = this.mongoDb.collection('accounts');
        const hasCard = await accountsCol.findOne({ type: 'credit_card' });
        if (!hasCard) {
          await accountsCol.insertOne({
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
          });
          console.log('✅ Seeded initial Credit Card to MongoDB Atlas!');
        } else {
          await accountsCol.updateMany(
            { type: 'credit_card', creditLimit: { $exists: false } },
            { $set: { creditLimit: 100000, usedAmount: 0, availableLimit: 100000, dueDate: '15th of every month', statementDate: '2nd of every month' } }
          );
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

  // Multi-Tenant Get Collection / Entity scoped by userId
  async get(key, userId = 'user_uday_01') {
    if (this.initPromise) await this.initPromise;
    const isUday = !userId || userId === 'user_uday_01';

    if (this.isMongoConnected && this.mongoDb) {
      try {
        const col = this.mongoDb.collection(key);
        if (key === 'profile') {
          let doc;
          if (isUday) {
            doc = await col.findOne({ $or: [{ id: 'uday_pedakota_01' }, { userId: 'user_uday_01' }] });
          } else {
            doc = await col.findOne({ userId });
          }

          const base = isUday ? INITIAL_DATABASE.profile : CLEAN_USER_PROFILE_TEMPLATE;

          if (!doc) {
            let registeredUser = null;
            try {
              registeredUser = await this.mongoDb.collection('users').findOne({ id: userId });
            } catch {}

            return {
              ...base,
              id: 'profile_' + userId,
              userId,
              personal: {
                ...base.personal,
                fullName: registeredUser?.fullName || 'MoneyMate Member',
                firstName: (registeredUser?.fullName || 'Member').split(' ')[0],
                lastName: (registeredUser?.fullName || '').split(' ').slice(1).join(' ') || '',
                username: registeredUser?.username || 'user'
              },
              contact: {
                ...base.contact,
                email: registeredUser?.email || '',
                mobile: registeredUser?.mobile || ''
              },
              financial: { ...base.financial },
              appearance: { ...base.appearance },
              security: { ...base.security },
              notifications: { ...base.notifications }
            };
          }

          return {
            ...base,
            ...doc,
            personal: { ...base.personal, ...(doc.personal || {}) },
            contact: { ...base.contact, ...(doc.contact || {}) },
            financial: { ...base.financial, ...(doc.financial || {}) },
            appearance: { ...base.appearance, ...(doc.appearance || {}) },
            security: { ...base.security, ...(doc.security || {}) },
            notifications: { ...base.notifications, ...(doc.notifications || {}) }
          };
        }

        const query = isUday
          ? { $or: [{ userId: 'user_uday_01' }, { userId: { $exists: false } }] }
          : { userId };
        return await col.find(query).toArray();
      } catch (e) {
        console.warn('Mongo read error, reading local fallback', e);
      }
    }

    const db = this.readLocalDb();
    if (key === 'profile') {
      let doc;
      if (isUday) {
        doc = db.profile || INITIAL_DATABASE.profile;
      } else if (db.profiles && db.profiles[userId]) {
        doc = db.profiles[userId];
      }
      const base = isUday ? INITIAL_DATABASE.profile : CLEAN_USER_PROFILE_TEMPLATE;
      if (!doc) {
        let registeredUser = null;
        if (Array.isArray(db.users)) {
          registeredUser = db.users.find((u) => u.id === userId);
        }
        return {
          ...base,
          id: 'profile_' + userId,
          userId,
          personal: {
            ...base.personal,
            fullName: registeredUser?.fullName || 'MoneyMate Member',
            firstName: (registeredUser?.fullName || 'Member').split(' ')[0],
            lastName: (registeredUser?.fullName || '').split(' ').slice(1).join(' ') || '',
            username: registeredUser?.username || 'user'
          },
          contact: {
            ...base.contact,
            email: registeredUser?.email || '',
            mobile: registeredUser?.mobile || ''
          },
          financial: { ...base.financial },
          appearance: { ...base.appearance },
          security: { ...base.security },
          notifications: { ...base.notifications }
        };
      }
      return {
        ...base,
        ...doc,
        personal: { ...base.personal, ...(doc.personal || {}) },
        contact: { ...base.contact, ...(doc.contact || {}) },
        financial: { ...base.financial, ...(doc.financial || {}) },
        appearance: { ...base.appearance, ...(doc.appearance || {}) },
        security: { ...base.security, ...(doc.security || {}) },
        notifications: { ...base.notifications, ...(doc.notifications || {}) }
      };
    }
    const allItems = isUday ? (db[key] || INITIAL_DATABASE[key] || []) : (db[key] || []);
    if (!Array.isArray(allItems)) return [];
    return allItems.filter((i) => (isUday ? (!i.userId || i.userId === 'user_uday_01') : i.userId === userId));
  }

  // Multi-Tenant Save / Update Entity scoped by userId
  async set(key, value, userId = 'user_uday_01') {
    if (this.initPromise) await this.initPromise;
    const isUday = !userId || userId === 'user_uday_01';

    if (this.isMongoConnected && this.mongoDb) {
      try {
        const col = this.mongoDb.collection(key);
        const { _id, ...cleanValue } = value || {};
        if (key === 'profile') {
          if (isUday) {
            await col.updateOne(
              { id: 'uday_pedakota_01' },
              { $set: { ...cleanValue, id: 'uday_pedakota_01', userId: 'user_uday_01' } },
              { upsert: true }
            );
          } else {
            await col.updateOne(
              { userId },
              { $set: { ...cleanValue, userId } },
              { upsert: true }
            );
          }
          console.log(`✅ [MongoDB Atlas] Successfully persisted ${key} for ${userId}`);
        } else {
          // If setting other direct objects
          await col.updateOne(
            isUday ? { id: cleanValue.id || 'primary' } : { userId, id: cleanValue.id || 'primary' },
            { $set: cleanValue },
            { upsert: true }
          );
        }
      } catch (e) {
        console.warn('⚠️ Mongo write error:', e.message);
      }
    }

    const db = this.readLocalDb();
    if (key === 'profile') {
      if (isUday) {
        db.profile = value;
      } else {
        if (!db.profiles) db.profiles = {};
        db.profiles[userId] = value;
      }
    } else {
      db[key] = value;
    }
    this.writeLocalDb(db);
    return value;
  }

  // Add Item to Array Collection with userId
  async addItem(collectionKey, item, userId = 'user_uday_01') {
    if (this.initPromise) await this.initPromise;
    const effectiveUserId = userId || 'user_uday_01';
    const { _id, ...cleanItem } = item || {};
    const newItem = {
      ...cleanItem,
      id: item.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: effectiveUserId,
      createdAt: new Date().toISOString()
    };

    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection(collectionKey).insertOne(newItem);
        console.log(`✅ [MongoDB Atlas] Inserted item into ${collectionKey}: ${newItem.id}`);
      } catch (e) {
        console.warn('⚠️ Mongo insert error:', e.message);
      }
    }

    const db = this.readLocalDb();
    if (!Array.isArray(db[collectionKey])) {
      db[collectionKey] = [];
    }
    db[collectionKey].unshift(newItem);
    this.writeLocalDb(db);
    return newItem;
  }

  // Delete Item from Array Collection scoped by userId
  async deleteItem(collectionKey, itemId, userId = 'user_uday_01') {
    if (this.initPromise) await this.initPromise;
    const isUday = !userId || userId === 'user_uday_01';
    const query = isUday ? { id: itemId } : { id: itemId, userId };

    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection(collectionKey).deleteOne(query);
        console.log(`✅ [MongoDB Atlas] Deleted item from ${collectionKey}: ${itemId}`);
      } catch (e) {
        console.warn('⚠️ Mongo delete error:', e.message);
      }
    }

    const db = this.readLocalDb();
    if (Array.isArray(db[collectionKey])) {
      db[collectionKey] = db[collectionKey].filter((i) => i.id !== itemId);
      this.writeLocalDb(db);
    }
    return { success: true, id: itemId };
  }

  // Update Item in Array Collection scoped by userId
  async updateItem(collectionKey, itemId, partialUpdate, userId = 'user_uday_01') {
    if (this.initPromise) await this.initPromise;
    const isUday = !userId || userId === 'user_uday_01';
    const query = isUday ? { id: itemId } : { id: itemId, userId };
    const { _id, ...cleanPartial } = partialUpdate || {};

    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection(collectionKey).updateOne(query, { $set: cleanPartial });
        console.log(`✅ [MongoDB Atlas] Updated item in ${collectionKey}: ${itemId}`);
      } catch (e) {
        console.warn('⚠️ Mongo update error:', e.message);
      }
    }

    const db = this.readLocalDb();
    if (Array.isArray(db[collectionKey])) {
      db[collectionKey] = db[collectionKey].map((i) => (i.id === itemId ? { ...i, ...cleanPartial } : i));
      this.writeLocalDb(db);
    }
    return partialUpdate;
  }

  // User Authentication: Find by username or email
  async findUser(usernameOrEmail) {
    if (this.initPromise) await this.initPromise;
    const queryStr = (usernameOrEmail || '').trim();
    if (!queryStr) return null;

    if (this.isMongoConnected && this.mongoDb) {
      try {
        const usersCol = this.mongoDb.collection('users');
        const escaped = queryStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const user = await usersCol.findOne({
          $or: [
            { username: { $regex: new RegExp(`^${escaped}$`, 'i') } },
            { email: { $regex: new RegExp(`^${escaped}$`, 'i') } }
          ]
        });
        if (user) return user;
      } catch (e) {
        console.warn('Mongo findUser error:', e);
      }
    }

    // Local fallback with default Uday user guaranteed
    const localDb = this.readLocalDb();
    const defaultUsers = [
      {
        id: 'user_uday_01',
        username: 'udaypedakota',
        email: 'peddakotaudaykumar@gmail.com',
        password: 'Uday8329',
        fullName: 'Uday Pedakota'
      }
    ];

    let users = defaultUsers;
    if (Array.isArray(localDb.users) && localDb.users.length > 0) {
      users = [...localDb.users];
      if (!users.some((u) => u.username === 'udaypedakota')) {
        users.push(defaultUsers[0]);
      }
    }

    return (
      users.find(
        (u) =>
          (u.username && u.username.toLowerCase() === queryStr.toLowerCase()) ||
          (u.email && u.email.toLowerCase() === queryStr.toLowerCase())
      ) || null
    );
  }

  // Register New User & Setup isolated workspace
  async registerUser({ fullName, username, email, mobile, password }) {
    if (this.initPromise) await this.initPromise;
    const cleanUsername = (username || '').trim().toLowerCase();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (fullName || cleanUsername).trim();

    if (!cleanUsername || !password) {
      throw new Error('Username and Password are required.');
    }

    const existing = await this.findUser(cleanUsername);
    if (existing) {
      throw new Error('An account with this username already exists. Please choose a different username.');
    }

    if (cleanEmail) {
      const existingEmail = await this.findUser(cleanEmail);
      if (existingEmail) {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newUser = {
      id: userId,
      username: cleanUsername,
      email: cleanEmail || `${cleanUsername}@moneymate.app`,
      mobile: mobile ? mobile.trim() : '',
      password: password.trim(),
      fullName: cleanName,
      tier: 'Private Wealth Member',
      createdAt: new Date().toISOString()
    };

    // 1. Insert into Users collection
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('users').insertOne(newUser);
      } catch (e) {
        console.warn('Mongo insert user error:', e);
      }
    }

    // 2. Setup user's isolated clean profile (No Uday data leakage)
    const userProfile = {
      ...CLEAN_USER_PROFILE_TEMPLATE,
      id: `profile_${userId}`,
      userId: userId,
      personal: {
        ...CLEAN_USER_PROFILE_TEMPLATE.personal,
        fullName: cleanName,
        firstName: cleanName.split(' ')[0],
        lastName: cleanName.split(' ').slice(1).join(' ') || '',
        username: cleanUsername,
        bio: 'Personal Money Ledger & Wealth Tracking',
        avatarUrl: ''
      },
      contact: {
        ...CLEAN_USER_PROFILE_TEMPLATE.contact,
        email: cleanEmail,
        mobile: mobile ? mobile.trim() : ''
      },
      financial: {
        ...CLEAN_USER_PROFILE_TEMPLATE.financial,
        currency: 'INR',
        currencySymbol: '₹',
        monthlyIncome: 0,
        monthlyBudget: 0,
        savingsTarget: 0,
        financialGoal: 'Personal Wealth Building & Monthly Tracking'
      },
      updatedAt: new Date().toISOString()
    };

    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('profile').insertOne(userProfile);
      } catch (e) {
        console.warn('Mongo insert profile error:', e);
      }
    }

    // 3. Setup user's 2 starter accounts (Cash & Bank) with 0 balance
    const starterCash = {
      id: `acc_${Date.now()}_cash`,
      userId: userId,
      name: 'Cash in Hand (Wallet)',
      type: 'cash',
      institution: 'Physical Wallet',
      maskedNumber: 'CASH',
      balance: 0,
      currency: 'INR',
      status: 'primary',
      cardColor: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)'
    };

    const starterBank = {
      id: `acc_${Date.now()}_bank`,
      userId: userId,
      name: 'Primary Savings Bank',
      type: 'bank',
      institution: 'Primary Bank',
      maskedNumber: '•••• 1234',
      balance: 0,
      currency: 'INR',
      status: 'active',
      cardColor: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
    };

    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('accounts').insertMany([starterCash, starterBank]);
      } catch (e) {
        console.warn('Mongo insert starter accounts error:', e);
      }
    }

    // Also update local DB fallback
    const localDb = this.readLocalDb();
    if (!Array.isArray(localDb.users)) localDb.users = [];
    localDb.users.push(newUser);
    if (!localDb.profiles) localDb.profiles = {};
    localDb.profiles[userId] = userProfile;
    if (!Array.isArray(localDb.accounts)) localDb.accounts = [];
    localDb.accounts.push(starterCash, starterBank);
    this.writeLocalDb(localDb);

    // Embed userId into auth token for instant identification
    const token = `moneymate_${userId}_${Date.now()}`;

    return {
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        tier: newUser.tier
      }
    };
  }

  // Reset database back to default initial state
  async resetAll() {
    this.writeLocalDb(INITIAL_DATABASE);
    return INITIAL_DATABASE;
  }
}

export const dbManager = new DatabaseManager();
