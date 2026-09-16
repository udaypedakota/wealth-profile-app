import React, { useState, useEffect, useMemo } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useToast } from '../../context/ToastContext';
import { ApiClient } from '../../services/apiClient';
import { QuickAddModal } from '../common/QuickAddModal';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Download,
  CreditCard,
  Building2,
  Wallet,
  AlertCircle,
  Tag,
  Calendar as CalendarIcon,
  Check
} from 'lucide-react';

/* ==========================================================================
   1. TRANSACTIONS VIEW (Live & Interactive with Add Modal)
   ========================================================================== */
export const TransactionsView: React.FC = () => {
  const { profile } = useProfile();
  const { success, error } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'debit' | 'credit'>('debit');

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await ApiClient.getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    const handleDataChanged = () => loadTransactions();
    window.addEventListener('moneymate_data_changed', handleDataChanged);
    return () => window.removeEventListener('moneymate_data_changed', handleDataChanged);
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await ApiClient.deleteTransaction(id);
      success('Transaction Deleted', `Record "${title}" was removed.`);
      loadTransactions();
    } catch (err: any) {
      error('Delete Failed', err.message || 'Could not delete transaction.');
    }
  };

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const titleMatch = (tx.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const catMatch = (tx.category || '').toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filterType === 'all' || tx.type === filterType;
      return (titleMatch || catMatch) && typeMatch;
    });
  }, [transactions, searchTerm, filterType]);

  const totalCredits = useMemo(
    () => transactions.filter((t) => t.type === 'credit').reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [transactions]
  );
  const totalDebits = useMemo(
    () => transactions.filter((t) => t.type === 'debit').reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [transactions]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title">
            <span className="nav-emoji">💳</span>
            <span>Transaction Ledger</span>
          </h2>
          <p className="section-top-subtitle">
            {transactions.length} total entries • Total Inflow: <strong style={{ color: '#10b981' }}>{formatCurrency(totalCredits, 'INR')}</strong> • Total Outflow: <strong style={{ color: '#ef4444' }}>{formatCurrency(totalDebits, 'INR')}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setQuickAddType('debit');
              setIsQuickAddOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search by description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '160px' }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Transactions</option>
          <option value="credit">Credits (Income)</option>
          <option value="debit">Debits (Expenses)</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="premium-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading transactions...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <AlertCircle size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>No transactions found</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {searchTerm ? 'No results matched your search term.' : 'You have not recorded any daily transactions yet.'}
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setQuickAddType('debit');
                setIsQuickAddOpen(true);
              }}
            >
              <Plus size={14} />
              <span>Record First Transaction</span>
            </button>
          </div>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Account</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center', width: '60px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{tx.title}</div>
                    {tx.notes && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tx.notes}</div>}
                  </td>
                  <td>
                    <span style={{ padding: '3px 8px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface)', fontSize: '0.75rem', fontWeight: 600 }}>
                      {tx.category || 'General'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{tx.account || 'Primary Bank'}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(tx.date || new Date().toISOString())}</td>
                  <td>
                    <span className="badge-status success">
                      {tx.status || 'Completed'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700, color: tx.type === 'credit' ? '#10b981' : '#f43f5e' }}>
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, profile.financial?.currency || 'INR')}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleDelete(tx.id, tx.title)}
                      style={{ color: '#ef4444', padding: '6px', borderRadius: '6px', opacity: 0.8, cursor: 'pointer' }}
                      title="Delete record"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        defaultType={quickAddType}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={() => loadTransactions()}
      />
    </div>
  );
};

/* ==========================================================================
   2. INCOME VIEW (Live Data + Add Income Modal)
   ========================================================================== */
export const IncomeView: React.FC = () => {
  const { profile } = useProfile();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadData = async () => {
    const list = await ApiClient.getTransactions();
    setTransactions(Array.isArray(list) ? list.filter((t) => t.type === 'credit') : []);
  };

  useEffect(() => {
    loadData();
    const handle = () => loadData();
    window.addEventListener('moneymate_data_changed', handle);
    return () => window.removeEventListener('moneymate_data_changed', handle);
  }, []);

  const totalInflow = useMemo(
    () => transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [transactions]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title">
            <span className="nav-emoji">💰</span>
            <span>Income Streams & Capital Inflows</span>
          </h2>
          <p className="section-top-subtitle">
            Total recorded income inflows: <strong style={{ color: '#10b981' }}>{formatCurrency(totalInflow || 85000, profile.financial?.currency || 'INR')}</strong>
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          <span>Add Income</span>
        </button>
      </div>

      <div className="card-grid-3col">
        <div className="premium-card glow-hover">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="badge-status success">Monthly Recurring</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Salary</span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Monthly Salary Credit</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 14px' }}>Primary Savings Bank Account</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>
            {formatCurrency(85000, profile.financial?.currency || 'INR')}
          </div>
        </div>

        <div className="premium-card glow-hover">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="badge-status info">Cumulative Inflow</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All Credits</span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Total Income Received</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 14px' }}>{transactions.length} verified income transactions</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>
            {formatCurrency(totalInflow || 85000, profile.financial?.currency || 'INR')}
          </div>
        </div>
      </div>

      <div className="premium-card">
        <h3 className="card-title" style={{ marginBottom: '16px' }}>Income Transaction History</h3>
        {transactions.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No credit transactions recorded yet. Click "Add Income" to record salary or freelance credits.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{tx.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.category || 'Income'} • {formatDate(tx.date)}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#10b981', fontSize: '1.1rem' }}>
                  +{formatCurrency(tx.amount, profile.financial?.currency || 'INR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <QuickAddModal
        isOpen={isAddOpen}
        defaultType="credit"
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
};

/* ==========================================================================
   3. EXPENSES VIEW (Live Data + Add Expense Modal)
   ========================================================================== */
export const ExpensesView: React.FC = () => {
  const { profile } = useProfile();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadData = async () => {
    const list = await ApiClient.getTransactions();
    setExpenses(Array.isArray(list) ? list.filter((t) => t.type === 'debit') : []);
  };

  useEffect(() => {
    loadData();
    const handle = () => loadData();
    window.addEventListener('moneymate_data_changed', handle);
    return () => window.removeEventListener('moneymate_data_changed', handle);
  }, []);

  const totalSpent = useMemo(
    () => expenses.reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [expenses]
  );

  // Group by category
  const categorySummary = useMemo(() => {
    const map: { [cat: string]: number } = {};
    expenses.forEach((e) => {
      const cat = e.category || 'Other Expense';
      map[cat] = (map[cat] || 0) + Number(e.amount || 0);
    });
    return Object.entries(map).map(([name, spent]) => {
      const percent = totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0;
      return { name, spent, percent };
    });
  }, [expenses, totalSpent]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title">
            <span className="nav-emoji">📉</span>
            <span>Monthly Expenses Breakdown</span>
          </h2>
          <p className="section-top-subtitle">
            Current cumulative spending: <strong style={{ color: '#f43f5e' }}>{formatCurrency(totalSpent, profile.financial?.currency || 'INR')}</strong>
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          <span>Record Expense</span>
        </button>
      </div>

      <div className="premium-card">
        <h3 className="card-title" style={{ marginBottom: '16px' }}>Spending by Category</h3>
        {categorySummary.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No expenses recorded yet. Click "Record Expense" to add your daily expenses.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {categorySummary.map((cat, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    <strong>{formatCurrency(cat.spent, profile.financial?.currency || 'INR')}</strong> ({cat.percent}%)
                  </span>
                </div>
                <div className="completion-bar-outer">
                  <div
                    className="completion-bar-inner"
                    style={{
                      width: `${Math.min(cat.percent, 100)}%`,
                      background: cat.percent > 40 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'var(--primary-gradient)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <QuickAddModal
        isOpen={isAddOpen}
        defaultType="debit"
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
};

/* ==========================================================================
   4. BILLS VIEW (Live Data + Add Bill Modal)
   ========================================================================== */
export const BillsView: React.FC = () => {
  const { profile } = useProfile();
  const { success, error } = useToast();
  const [bills, setBills] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add bill form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Utilities');
  const [submitting, setSubmitting] = useState(false);

  const loadBills = async () => {
    const list = await ApiClient.getBills();
    setBills(Array.isArray(list) ? list : []);
  };

  useEffect(() => {
    loadBills();
    const handle = () => loadBills();
    window.addEventListener('moneymate_data_changed', handle);
    return () => window.removeEventListener('moneymate_data_changed', handle);
  }, []);

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!title.trim() || isNaN(num) || num <= 0) {
      error('Invalid Input', 'Please enter a bill title and valid amount.');
      return;
    }

    try {
      setSubmitting(true);
      await ApiClient.addBill({
        title: title.trim(),
        amount: num,
        dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        category
      });
      success('Bill Added', `Bill for ${title} of ₹${num.toLocaleString('en-IN')} added.`);
      setTitle('');
      setAmount('');
      setDueDate('');
      setIsAddOpen(false);
      loadBills();
    } catch (err: any) {
      error('Error', err.message || 'Could not add bill.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async (id: string, name: string) => {
    try {
      await ApiClient.payBill(id);
      success('Bill Paid', `Marked ${name} as settled.`);
      loadBills();
    } catch (err: any) {
      error('Error', err.message || 'Could not mark bill paid.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete bill "${name}"?`)) return;
    try {
      await ApiClient.deleteBill(id);
      success('Bill Deleted', `Bill "${name}" removed.`);
      loadBills();
    } catch (err: any) {
      error('Error', err.message || 'Could not delete bill.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title">
            <span className="nav-emoji">🧾</span>
            <span>Recurring Bills & Utilities</span>
          </h2>
          <p className="section-top-subtitle">{bills.filter((b) => b.status !== 'Settled').length} pending bills active this billing cycle</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          <span>Add Bill</span>
        </button>
      </div>

      <div className="card-grid-2col">
        {bills.map((b) => (
          <div key={b.id} className="premium-card glow-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span className={`badge-status ${b.status === 'Settled' ? 'success' : 'warning'}`}>{b.status || 'Pending'}</span>
              <button
                type="button"
                onClick={() => handleDelete(b.id, b.title)}
                style={{ color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                title="Delete bill"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{b.title}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 16px' }}>Due: {formatDate(b.dueDate)} • {b.category || 'Utility'}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800 }}>
                {formatCurrency(b.amount, profile.financial?.currency || 'INR')}
              </span>
              {b.status !== 'Settled' ? (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => handlePay(b.id, b.title)}>
                  <CheckCircle2 size={13} />
                  <span>Pay Bill</span>
                </button>
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Paid ✓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Bill Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Recurring Bill">
        <form onSubmit={handleAddBill} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Bill Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Electricity Bill, WiFi Broadband, Water"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 1450"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Utilities">Utilities</option>
              <option value="Internet">Internet / Broadband</option>
              <option value="Mobile">Mobile Recharge</option>
              <option value="Rent">Rent / Maintenance</option>
              <option value="Subscription">Subscription</option>
              <option value="Insurance">Insurance</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Save Bill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

/* ==========================================================================
   5. EMIS & LOANS VIEW (Live Data + Add EMI Modal)
   ========================================================================== */
export const EmisView: React.FC = () => {
  const { profile } = useProfile();
  const { success, error } = useToast();
  const [emis, setEmis] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [lender, setLender] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [totalTenures, setTotalTenures] = useState('24');
  const [tenuresLeft, setTenuresLeft] = useState('14');
  const [nextDue, setNextDue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadEmis = async () => {
    const list = await ApiClient.getEmis();
    setEmis(Array.isArray(list) ? list : []);
  };

  useEffect(() => {
    loadEmis();
    const handle = () => loadEmis();
    window.addEventListener('moneymate_data_changed', handle);
    return () => window.removeEventListener('moneymate_data_changed', handle);
  }, []);

  const handleAddEmi = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(monthlyAmount);
    if (!title.trim() || isNaN(num) || num <= 0) {
      error('Invalid Input', 'Please enter loan title and monthly amount.');
      return;
    }

    try {
      setSubmitting(true);
      await ApiClient.addEmi({
        title: title.trim(),
        lender: lender.trim() || 'Bank Finance',
        monthlyAmount: num,
        totalTenures: parseInt(totalTenures) || 24,
        tenuresLeft: parseInt(tenuresLeft) || 12,
        nextDue: nextDue || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
      });
      success('EMI Added', `Added ${title} of ₹${num.toLocaleString('en-IN')}/month.`);
      setTitle('');
      setLender('');
      setMonthlyAmount('');
      setIsAddOpen(false);
      loadEmis();
    } catch (err: any) {
      error('Error', err.message || 'Could not add EMI.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete loan/EMI "${name}"?`)) return;
    try {
      await ApiClient.deleteEmi(id);
      success('EMI Deleted', `Removed "${name}".`);
      loadEmis();
    } catch (err: any) {
      error('Error', err.message || 'Could not delete EMI.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title"><span className="nav-emoji">🏦</span> <span>EMIs & Long-Term Loans</span></h2>
          <p className="section-top-subtitle">{emis.length} active loan amortizations running</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          <span>Add EMI</span>
        </button>
      </div>

      <div className="card-grid-2col">
        {emis.map((emi) => (
          <div key={emi.id} className="premium-card glow-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{emi.title}</div>
              <button
                type="button"
                onClick={() => handleDelete(emi.id, emi.title)}
                style={{ color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                title="Delete EMI"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 14px' }}>
              {emi.lender} • Next Due: {formatDate(emi.nextDue)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly Installment</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#f43f5e' }}>
                {formatCurrency(emi.monthlyAmount, profile.financial?.currency || 'INR')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Remaining Tenures</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {emi.tenuresLeft} of {emi.totalTenures || 24} months
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Loan / EMI Record">
        <form onSubmit={handleAddEmi} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Loan / EMI Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Two Wheeler Loan, Personal Loan, Home Loan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Bank / Lender</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. HDFC Bank, SBI, Bajaj Finance"
              value={lender}
              onChange={(e) => setLender(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Monthly EMI Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 4500"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Total Tenures (Months)</label>
              <input
                type="number"
                className="form-input"
                value={totalTenures}
                onChange={(e) => setTotalTenures(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tenures Left</label>
              <input
                type="number"
                className="form-input"
                value={tenuresLeft}
                onChange={(e) => setTenuresLeft(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Next Due Date</label>
            <input
              type="date"
              className="form-input"
              value={nextDue}
              onChange={(e) => setNextDue(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Save EMI'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

/* ==========================================================================
   6. CHITS VIEW (Live Data + Add Chit Modal)
   ========================================================================== */
export const ChitsView: React.FC = () => {
  const { profile } = useProfile();
  const { success, error } = useToast();
  const [chits, setChits] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [monthlySubscription, setMonthlySubscription] = useState('');
  const [totalPotValue, setTotalPotValue] = useState('');
  const [currentMonth, setCurrentMonth] = useState('Month 8 of 20');
  const [submitting, setSubmitting] = useState(false);

  const loadChits = async () => {
    const list = await ApiClient.getChits();
    setChits(Array.isArray(list) ? list : []);
  };

  useEffect(() => {
    loadChits();
    const handle = () => loadChits();
    window.addEventListener('moneymate_data_changed', handle);
    return () => window.removeEventListener('moneymate_data_changed', handle);
  }, []);

  const handleAddChit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subNum = parseFloat(monthlySubscription);
    const potNum = parseFloat(totalPotValue);
    if (!title.trim() || isNaN(subNum) || subNum <= 0) {
      error('Invalid Input', 'Please enter chit name and monthly subscription amount.');
      return;
    }

    try {
      setSubmitting(true);
      await ApiClient.addChit({
        title: title.trim(),
        monthlySubscription: subNum,
        totalPotValue: potNum || subNum * 20,
        currentMonth: currentMonth.trim() || 'Month 1 of 20'
      });
      success('Chit Added', `Added "${title}" to your active chit funds.`);
      setTitle('');
      setMonthlySubscription('');
      setTotalPotValue('');
      setIsAddOpen(false);
      loadChits();
    } catch (err: any) {
      error('Error', err.message || 'Could not add chit.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete chit fund "${name}"?`)) return;
    try {
      await ApiClient.deleteChit(id);
      success('Chit Deleted', `Removed "${name}".`);
      loadChits();
    } catch (err: any) {
      error('Error', err.message || 'Could not delete chit.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title"><span className="nav-emoji">🔄</span> <span>Community Chit Funds</span></h2>
          <p className="section-top-subtitle">{chits.length} active chit funds running</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          <span>Join / Add Chit</span>
        </button>
      </div>

      <div className="card-grid-2col">
        {chits.map((c) => (
          <div key={c.id} className="premium-card glow-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge-status success">{c.status || 'Active'}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.currentMonth}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id, c.title)}
                  style={{ color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                  title="Delete chit"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{c.title}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '14px 0 6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Pot Value</span>
              <span style={{ fontWeight: 700 }}>{formatCurrency(c.totalPotValue, profile.financial?.currency || 'INR')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Monthly Subscription</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                {formatCurrency(c.monthlySubscription, profile.financial?.currency || 'INR')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Community Chit Fund">
        <form onSubmit={handleAddChit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Chit Fund Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 20-Month Family Chit Fund"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Subscription Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 5000"
              value={monthlySubscription}
              onChange={(e) => setMonthlySubscription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Total Pot Value (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 100000"
              value={totalPotValue}
              onChange={(e) => setTotalPotValue(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Current Month / Progress</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Month 8 of 20"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Chit Fund'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

/* ==========================================================================
   7. CREDIT CARDS VIEW (Live Data + Add Card Modal)
   ========================================================================== */
export const CreditCardsView: React.FC = () => {
  const { profile } = useProfile();
  const { success, error } = useToast();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [maskedNumber, setMaskedNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [cardColor, setCardColor] = useState('linear-gradient(135deg, #1e293b 0%, #0f172a 100%)');
  const [submitting, setSubmitting] = useState(false);

  const loadAccounts = async () => {
    const list = await ApiClient.getAccounts();
    setAccounts(Array.isArray(list) ? list : []);
  };

  useEffect(() => {
    loadAccounts();
    const handle = () => loadAccounts();
    window.addEventListener('moneymate_data_changed', handle);
    return () => window.removeEventListener('moneymate_data_changed', handle);
  }, []);

  const cards = accounts.filter((a) => a.type === 'credit_card');

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Input Required', 'Please enter a card name.');
      return;
    }

    try {
      setSubmitting(true);
      const numBal = parseFloat(balance) || 0;
      await ApiClient.addAccount({
        name: name.trim(),
        type: 'credit_card',
        institution: institution.trim() || 'Bank Finance',
        maskedNumber: maskedNumber ? `•••• ${maskedNumber.slice(-4)}` : '•••• 1998',
        balance: -Math.abs(numBal),
        currency: 'INR',
        status: 'active',
        cardColor
      });
      success('Card Linked', `Added ${name} to your linked credit cards.`);
      setName('');
      setInstitution('');
      setMaskedNumber('');
      setBalance('');
      setIsAddOpen(false);
      loadAccounts();
    } catch (err: any) {
      error('Error', err.message || 'Could not link card.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, cardName: string) => {
    if (!window.confirm(`Unlink card "${cardName}"?`)) return;
    try {
      await ApiClient.deleteAccount(id);
      success('Card Removed', `Card "${cardName}" unlinked.`);
      loadAccounts();
    } catch (err: any) {
      error('Error', err.message || 'Could not delete card.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title"><span className="nav-emoji">💳</span> <span>Credit Cards & Lines</span></h2>
          <p className="section-top-subtitle">{cards.length} active credit cards linked</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          <span>Link Card</span>
        </button>
      </div>

      <div className="card-grid-2col">
        {cards.map((card) => (
          <div key={card.id} className="account-card-item" style={{ background: card.cardColor || 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', minHeight: '180px', position: 'relative' }}>
            <button
              type="button"
              onClick={() => handleDelete(card.id, card.name)}
              style={{ position: 'absolute', top: '14px', right: '14px', color: '#fda4af', cursor: 'pointer', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '4px' }}
              title="Unlink card"
            >
              <Trash2 size={15} />
            </button>
            <div className="account-card-top">
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{card.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{card.institution}</div>
              </div>
            </div>
            <div className="account-card-number" style={{ color: '#fff', fontSize: '1.05rem', marginTop: '16px' }}>
              {card.maskedNumber} {card.expiryDate && `• EXP: ${card.expiryDate}`}
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>STATEMENT OUTSTANDING</div>
              <div className="account-card-balance" style={{ color: '#fb7185' }}>
                {formatCurrency(Math.abs(card.balance), profile.financial?.currency || 'INR')}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Link Credit Card">
        <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Card Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. HDFC Millennia, ICICI Amazon Pay"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Bank / Institution</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. HDFC Bank, SBI Card"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Last 4 Digits</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 5732"
                maxLength={4}
                value={maskedNumber}
                onChange={(e) => setMaskedNumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Outstanding Due (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 14200"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Card Theme / Color</label>
            <select className="form-select" value={cardColor} onChange={(e) => setCardColor(e.target.value)}>
              <option value="linear-gradient(135deg, #1e293b 0%, #0f172a 100%)">Obsidian Dark</option>
              <option value="linear-gradient(135deg, #059669 0%, #064e3b 100%)">Emerald Green</option>
              <option value="linear-gradient(135deg, #0284c7 0%, #0369a1 100%)">Sapphire Blue</option>
              <option value="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)">Royal Violet</option>
              <option value="linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)">Crimson Red</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Linking...' : 'Link Card'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

/* ==========================================================================
   8. MONEY LENT VIEW (Receivables + Add Lent Modal)
   ========================================================================== */
export const MoneyLentView: React.FC = () => {
  const { profile } = useProfile();
  const { success, error } = useToast();
  const [records, setRecords] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const list = await ApiClient.getLending();
    setRecords(Array.isArray(list) ? list.filter((l) => l.type === 'lent' || !l.type) : []);
  };

  useEffect(() => {
    loadData();
    const handle = () => loadData();
    window.addEventListener('moneymate_data_changed', handle);
    return () => window.removeEventListener('moneymate_data_changed', handle);
  }, []);

  const handleAddLend = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!personName.trim() || isNaN(num) || num <= 0) {
      error('Invalid Input', 'Please enter person name and valid amount.');
      return;
    }

    try {
      setSubmitting(true);
      await ApiClient.addLending({
        type: 'lent',
        personName: personName.trim(),
        amount: num,
        dueDate: dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        notes: notes.trim()
      });
      success('Loan Recorded', `Recorded ₹${num.toLocaleString('en-IN')} lent to ${personName}.`);
      setPersonName('');
      setAmount('');
      setNotes('');
      setIsAddOpen(false);
      loadData();
    } catch (err: any) {
      error('Error', err.message || 'Could not record loan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (id: string, name: string) => {
    try {
      await ApiClient.returnLending(id);
      success('Marked Returned', `Marked loan to ${name} as returned.`);
      loadData();
    } catch (err: any) {
      error('Error', err.message || 'Could not update loan.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete lending record for "${name}"?`)) return;
    try {
      await ApiClient.deleteLending(id);
      success('Deleted', `Removed lending record.`);
      loadData();
    } catch (err: any) {
      error('Error', err.message || 'Could not delete record.');
    }
  };

  const totalReceivable = useMemo(
    () => records.filter((r) => r.status !== 'Returned').reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [records]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title"><span className="nav-emoji">🤝</span> <span>Money Lent (Receivables)</span></h2>
          <p className="section-top-subtitle">
            Total capital lent out: <strong style={{ color: '#10b981' }}>{formatCurrency(totalReceivable, profile.financial?.currency || 'INR')}</strong>
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          <span>Record Loan Given</span>
        </button>
      </div>

      <div className="card-grid-2col">
        {records.map((r) => (
          <div key={r.id} className="premium-card glow-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className={`badge-status ${r.status === 'Returned' ? 'success' : 'info'}`}>
                {r.status || 'Pending'}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(r.id, r.personName)}
                style={{ color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                title="Delete record"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{r.personName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 14px' }}>
              {r.notes || 'Personal loan'} • Expected: {formatDate(r.dueDate)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>
                {formatCurrency(r.amount, profile.financial?.currency || 'INR')}
              </div>
              {r.status !== 'Returned' && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleReturn(r.id, r.personName)}>
                  <Check size={13} />
                  <span>Mark Returned</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Record Money Lent to Someone">
        <form onSubmit={handleAddLend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Person Name (Borrower)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Suresh, Ramesh (Friend)"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Amount Lent (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Expected Return Date</label>
            <input
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Purpose / Notes</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Emergency advance, friendly help"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Record Loan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

/* ==========================================================================
   9. MONEY BORROWED VIEW (Payables + Add Borrowed Modal)
   ========================================================================== */
export const MoneyBorrowedView: React.FC = () => {
  const { profile } = useProfile();
  const { success, error } = useToast();
  const [records, setRecords] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const list = await ApiClient.getLending();
    setRecords(Array.isArray(list) ? list.filter((l) => l.type === 'borrowed') : []);
  };

  useEffect(() => {
    loadData();
    const handle = () => loadData();
    window.addEventListener('moneymate_data_changed', handle);
    return () => window.removeEventListener('moneymate_data_changed', handle);
  }, []);

  const handleAddBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!personName.trim() || isNaN(num) || num <= 0) {
      error('Invalid Input', 'Please enter lender name and amount.');
      return;
    }

    try {
      setSubmitting(true);
      await ApiClient.addLending({
        type: 'borrowed',
        personName: personName.trim(),
        amount: num,
        dueDate: dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        notes: notes.trim()
      });
      success('Borrowing Recorded', `Recorded ₹${num.toLocaleString('en-IN')} borrowed from ${personName}.`);
      setPersonName('');
      setAmount('');
      setNotes('');
      setIsAddOpen(false);
      loadData();
    } catch (err: any) {
      error('Error', err.message || 'Could not record borrowing.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRepay = async (id: string, name: string) => {
    try {
      await ApiClient.returnLending(id);
      success('Settled', `Marked borrowing from ${name} as fully repaid.`);
      loadData();
    } catch (err: any) {
      error('Error', err.message || 'Could not update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete this borrowing entry?`)) return;
    try {
      await ApiClient.deleteLending(id);
      success('Deleted', `Entry removed.`);
      loadData();
    } catch (err: any) {
      error('Error', err.message || 'Could not delete entry.');
    }
  };

  const totalBorrowed = useMemo(
    () => records.filter((r) => r.status !== 'Returned').reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [records]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title"><span className="nav-emoji">💵</span> <span>Money Borrowed (Payables)</span></h2>
          <p className="section-top-subtitle">
            Active borrowing obligations: <strong style={{ color: '#f43f5e' }}>{formatCurrency(totalBorrowed, profile.financial?.currency || 'INR')}</strong>
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          <span>Record Borrowing</span>
        </button>
      </div>

      <div className="card-grid-2col">
        {records.map((r) => (
          <div key={r.id} className="premium-card glow-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className={`badge-status ${r.status === 'Returned' ? 'success' : 'warning'}`}>
                {r.status === 'Returned' ? 'Repaid' : 'Outstanding'}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                style={{ color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                title="Delete record"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{r.personName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 14px' }}>
              {r.notes || 'Borrowed funds'} • Due: {formatDate(r.dueDate)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, color: '#f43f5e' }}>
                {formatCurrency(r.amount, profile.financial?.currency || 'INR')}
              </div>
              {r.status !== 'Returned' && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleRepay(r.id, r.personName)}>
                  <Check size={13} />
                  <span>Repay / Settle</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Record Money Borrowed">
        <form onSubmit={handleAddBorrow} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Lender / Source</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Bank credit facility, Friend name"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Amount Borrowed (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Repayment Due Date</label>
            <input
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Purpose / Notes</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Bridge loan, emergency"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

/* ==========================================================================
   10. ANALYTICS, BUDGETS, CALENDAR, REPORTS (Live Dynamic Analytics)
   ========================================================================== */
export const AnalyticsView: React.FC = () => {
  const { profile } = useProfile();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    ApiClient.getTransactions().then((list) => setTransactions(Array.isArray(list) ? list : []));
  }, []);

  const totalIn = transactions.filter((t) => t.type === 'credit').reduce((s, t) => s + Number(t.amount || 0), 0) || 85000;
  const totalOut = transactions.filter((t) => t.type === 'debit').reduce((s, t) => s + Number(t.amount || 0), 0) || 3700;
  const netSavings = totalIn - totalOut;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title"><span className="nav-emoji">📊</span> <span>Wealth & Cash Flow Analytics</span></h2>
          <p className="section-top-subtitle">Real-time calculations across your daily updates</p>
        </div>
      </div>
      <div className="card-grid-2col">
        <div className="premium-card">
          <h3 className="card-title" style={{ marginBottom: '14px' }}>Inflow vs Outflow</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL CREDITS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{formatCurrency(totalIn, 'INR')}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL DEBITS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f43f5e' }}>{formatCurrency(totalOut, 'INR')}</div>
            </div>
          </div>
        </div>
        <div className="premium-card">
          <h3 className="card-title" style={{ marginBottom: '14px' }}>Net Cash Flow Balance</h3>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: netSavings >= 0 ? '#10b981' : '#f43f5e', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(netSavings, 'INR')}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {netSavings >= 0 ? 'Positive net cash flow accumulation.' : 'Warning: Outflows exceed current inflows.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export const BudgetsView: React.FC = () => {
  const { profile } = useProfile();
  const [spent, setSpent] = useState(3700);
  const budget = profile.financial?.monthlyBudget || 35000;

  useEffect(() => {
    ApiClient.getTransactions().then((list) => {
      if (Array.isArray(list)) {
        const out = list.filter((t) => t.type === 'debit').reduce((s, t) => s + Number(t.amount || 0), 0);
        setSpent(out);
      }
    });
  }, []);

  const percent = Math.min(Math.round((spent / budget) * 100), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title"><span className="nav-emoji">🎯</span> <span>Target Budgets & Savings Goals</span></h2>
          <p className="section-top-subtitle">Monthly budget limit: {formatCurrency(budget, 'INR')}</p>
        </div>
      </div>
      <div className="premium-card">
        <h3 className="card-title" style={{ marginBottom: '10px' }}>Monthly Spending vs Budget Limit</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          You have spent <strong>{formatCurrency(spent, 'INR')}</strong> of your {formatCurrency(budget, 'INR')} budget ({percent}% utilized).
        </p>
        <div className="completion-bar-outer">
          <div
            className="completion-bar-inner"
            style={{
              width: `${percent}%`,
              background: percent > 85 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'var(--primary-gradient)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const CalendarView: React.FC = () => {
  const [bills, setBills] = useState<any[]>([]);

  useEffect(() => {
    ApiClient.getBills().then((b) => setBills(Array.isArray(b) ? b : []));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title"><span className="nav-emoji">📅</span> <span>Financial Calendar & Due Dates</span></h2>
          <p className="section-top-subtitle">Upcoming bills, dues, and scheduled payments</p>
        </div>
      </div>
      <div className="premium-card">
        {bills.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No scheduled bills found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {bills.map((b) => (
              <div key={b.id} style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(b.dueDate)}</div>
                <div style={{ fontWeight: 700, margin: '4px 0' }}>{b.title}</div>
                <div style={{ fontSize: '0.9rem', color: b.status === 'Settled' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                  {formatCurrency(b.amount, 'INR')} {b.status === 'Settled' && '✓'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ReportsView: React.FC = () => {
  const { profile } = useProfile();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title"><span className="nav-emoji">📄</span> <span>Financial Reports & Export</span></h2>
          <p className="section-top-subtitle">Personal statements and reports for Uday Pedakota</p>
        </div>
      </div>
      <div className="card-grid-2col">
        <div className="premium-card glow-hover">
          <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>Personal Cash Flow Summary</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 14px' }}>Export summary of monthly income, daily expenses, and bill payments</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => window.print()}
          >
            <Download size={14} /> <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
