import React, { useState, useEffect, useMemo } from 'react';
import { ApiClient } from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';
import { useProfile } from '../../context/ProfileContext';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import {
  CreditCard,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Percent,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Users,
  Copy,
  Check,
  Share2,
  Receipt,
  UserCheck,
  Clock,
  ExternalLink,
  MessageCircle,
  DollarSign
} from 'lucide-react';

export interface CardSplitExpense {
  id: string;
  personName: string;
  isSelf: boolean;
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'settled';
  settledAt?: string;
  phone?: string;
}

export interface CreditCardAccount {
  id: string;
  name: string;
  type: string;
  institution: string;
  maskedNumber: string;
  creditLimit: number;
  usedAmount: number;
  balance?: number;
  availableLimit: number;
  dueDate?: string;
  statementDate?: string;
  currency?: string;
  status: string;
  expiryDate?: string;
  cardColor?: string;
  splits?: CardSplitExpense[];
}

const CARD_COLOR_PRESETS = [
  { name: 'Sleek Obsidian', value: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' },
  { name: 'Midnight Emerald', value: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' },
  { name: 'Royal Crimson', value: 'linear-gradient(135deg, #881337 0%, #be123c 100%)' },
  { name: 'Deep Sapphire', value: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)' },
  { name: 'Graphite Carbon', value: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)' },
  { name: 'Sunset Bronze', value: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)' }
];

export const CreditCardsView: React.FC = () => {
  const { profile } = useProfile();
  const { success, error } = useToast();

  const [accounts, setAccounts] = useState<CreditCardAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CreditCardAccount | null>(null);

  // Add Card Form State
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [usedAmount, setUsedAmount] = useState('');
  const [last4, setLast4] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [statementDate, setStatementDate] = useState('');
  const [cardColor, setCardColor] = useState(CARD_COLOR_PRESETS[0].value);
  const [submitting, setSubmitting] = useState(false);

  // Update Balance Form State
  const [updateUsedVal, setUpdateUsedVal] = useState('');
  const [updateLimitVal, setUpdateLimitVal] = useState('');
  const [updating, setUpdating] = useState(false);

  // Bill Splits & Friend Expense States
  const [selectedCardFilter, setSelectedCardFilter] = useState<string>('all');
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [splitTargetCardId, setSplitTargetCardId] = useState<string>('');
  const [splitPerson, setSplitPerson] = useState('');
  const [splitIsSelf, setSplitIsSelf] = useState(false);
  const [splitAmount, setSplitAmount] = useState('');
  const [splitDesc, setSplitDesc] = useState('');
  const [splitDate, setSplitDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [splitStatus, setSplitStatus] = useState<'pending' | 'settled'>('pending');
  const [autoUpdateUsed, setAutoUpdateUsed] = useState(true);
  const [splitSubmitting, setSplitSubmitting] = useState(false);
  const [editingSplit, setEditingSplit] = useState<{ cardId: string; split: CardSplitExpense } | null>(null);

  // Statement Bill Share Modal State
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [statementTargetCard, setStatementTargetCard] = useState<CreditCardAccount | null>(null);
  const [copiedBill, setCopiedBill] = useState(false);

  const loadCards = async () => {
    try {
      setLoading(true);
      const list = await ApiClient.getAccounts();
      if (Array.isArray(list)) {
        const creditCards = list
          .filter((a: any) => a.type === 'credit_card')
          .map((c: any) => {
            const lim = Number(c.creditLimit || c.totalLimit || 100000);
            const used = Number(c.usedAmount !== undefined ? c.usedAmount : Math.abs(c.balance || 0));
            const avail = Math.max(0, lim - used);

            // Filter out any legacy static dummy data so user can manage purely dynamic swiped records
            const cleanSplits: CardSplitExpense[] = Array.isArray(c.splits)
              ? c.splits.filter((s: any) => !s.id?.startsWith('split_demo_') && !s.personName?.includes('(Friend)'))
              : [];

            // Clean up legacy dummy data in database if found
            if (Array.isArray(c.splits) && c.splits.length !== cleanSplits.length) {
              ApiClient.updateAccount(c.id, { ...c, splits: cleanSplits }).catch(() => {});
            }

            return {
              ...c,
              creditLimit: lim,
              usedAmount: used,
              availableLimit: avail,
              splits: cleanSplits
            };
          });
        setAccounts(creditCards);
      }
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
    const handleDataChanged = () => loadCards();
    window.addEventListener('moneymate_data_changed', handleDataChanged);
    return () => window.removeEventListener('moneymate_data_changed', handleDataChanged);
  }, []);

  // Summary Computations
  const totalLimit = useMemo(
    () => accounts.reduce((sum, c) => sum + (Number(c.creditLimit) || 0), 0),
    [accounts]
  );
  const totalUsed = useMemo(
    () => accounts.reduce((sum, c) => sum + (Number(c.usedAmount) || 0), 0),
    [accounts]
  );
  const totalAvailable = Math.max(0, totalLimit - totalUsed);
  const overallUtilization = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0;

  // Active Card for Bill Split Ledger
  const activeSplitCard = useMemo(() => {
    if (selectedCardFilter === 'all') return null;
    return accounts.find((a) => a.id === selectedCardFilter) || null;
  }, [accounts, selectedCardFilter]);

  // Aggregate splits based on filter
  const displayedSplits = useMemo(() => {
    if (selectedCardFilter === 'all') {
      const all: (CardSplitExpense & { cardName: string; cardMask: string; cardId: string })[] = [];
      accounts.forEach((c) => {
        (c.splits || []).forEach((s) => {
          all.push({ ...s, cardName: c.name, cardMask: c.maskedNumber, cardId: c.id });
        });
      });
      return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    const card = accounts.find((a) => a.id === selectedCardFilter);
    return (card?.splits || []).map((s) => ({
      ...s,
      cardName: card?.name || 'Card',
      cardMask: card?.maskedNumber || '',
      cardId: card?.id || ''
    }));
  }, [accounts, selectedCardFilter]);

  // Split Statistics
  const splitStats = useMemo(() => {
    const list = displayedSplits;
    const total = list.reduce((sum, s) => sum + s.amount, 0);
    const self = list.filter((s) => s.isSelf).reduce((sum, s) => sum + s.amount, 0);
    const friends = list.filter((s) => !s.isSelf).reduce((sum, s) => sum + s.amount, 0);
    const pending = list.filter((s) => !s.isSelf && s.status === 'pending').reduce((sum, s) => sum + s.amount, 0);
    const settled = list.filter((s) => !s.isSelf && s.status === 'settled').reduce((sum, s) => sum + s.amount, 0);
    const pendingCount = list.filter((s) => !s.isSelf && s.status === 'pending').length;

    return { total, self, friends, pending, settled, pendingCount };
  }, [displayedSplits]);

  const handleOpenAdd = () => {
    setName('');
    setInstitution('');
    setCreditLimit('');
    setUsedAmount('');
    setLast4('');
    setDueDate('15th of every month');
    setStatementDate('2nd of every month');
    setCardColor(CARD_COLOR_PRESETS[0].value);
    setIsAddOpen(true);
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const limNum = parseFloat(creditLimit);
    const usedNum = parseFloat(usedAmount) || 0;

    if (!name.trim()) {
      error('Name Required', 'Please enter a card name (e.g. HDFC Regalia).');
      return;
    }
    if (isNaN(limNum) || limNum <= 0) {
      error('Limit Required', 'Please enter total credit limit.');
      return;
    }

    try {
      setSubmitting(true);
      await ApiClient.addAccount({
        name: name.trim(),
        type: 'credit_card',
        institution: institution.trim() || 'Bank Finance',
        maskedNumber: last4 ? `•••• ${last4.slice(-4)}` : '•••• 1998',
        creditLimit: limNum,
        usedAmount: usedNum,
        availableLimit: Math.max(0, limNum - usedNum),
        balance: -Math.abs(usedNum),
        dueDate: dueDate.trim() || '15th of month',
        statementDate: statementDate.trim() || '2nd of month',
        currency: 'INR',
        status: 'active',
        expiryDate: '05/29',
        cardColor,
        splits: []
      });

      success('Card Linked', `Added ${name} with limit ${formatCurrency(limNum, 'INR')}.`);
      setIsAddOpen(false);
      loadCards();
    } catch (err: any) {
      error('Error', err.message || 'Could not link card.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenUpdate = (card: CreditCardAccount) => {
    setSelectedCard(card);
    setUpdateUsedVal(card.usedAmount.toString());
    setUpdateLimitVal(card.creditLimit.toString());
    setIsUpdateOpen(true);
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;

    const newUsed = parseFloat(updateUsedVal) || 0;
    const newLimit = parseFloat(updateLimitVal) || selectedCard.creditLimit;

    try {
      setUpdating(true);
      await ApiClient.updateAccount(selectedCard.id, {
        usedAmount: newUsed,
        creditLimit: newLimit,
        availableLimit: Math.max(0, newLimit - newUsed),
        balance: -Math.abs(newUsed)
      });

      success('Balance Updated', `Updated used balance to ${formatCurrency(newUsed, 'INR')}.`);
      setIsUpdateOpen(false);
      loadCards();
    } catch (err: any) {
      error('Error', err.message || 'Could not update card.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCard = async (id: string, cardName: string) => {
    if (!window.confirm(`Unlink credit card "${cardName}"?`)) return;
    try {
      await ApiClient.deleteAccount(id);
      success('Card Unlinked', `Removed "${cardName}".`);
      loadCards();
    } catch (err: any) {
      error('Error', err.message || 'Could not delete card.');
    }
  };

  // Split Modal Handlers
  const handleOpenAddSplit = (card?: CreditCardAccount) => {
    const target = card || activeSplitCard || accounts[0] || null;
    if (!target) {
      error('No Card Available', 'Please link a credit card first.');
      return;
    }
    setEditingSplit(null);
    setSplitTargetCardId(target.id);
    setSplitPerson('');
    setSplitIsSelf(false);
    setSplitAmount('');
    setSplitDesc('');
    setSplitDate(new Date().toISOString().split('T')[0]);
    setSplitStatus('pending');
    setAutoUpdateUsed(true);
    setIsSplitModalOpen(true);
  };

  const handleOpenEditSplit = (cardId: string, split: CardSplitExpense) => {
    setEditingSplit({ cardId, split });
    setSplitTargetCardId(cardId);
    setSplitIsSelf(split.isSelf);
    setSplitPerson(split.personName);
    setSplitAmount(String(split.amount));
    setSplitDesc(split.description);
    setSplitDate(split.date);
    setSplitStatus(split.status);
    setAutoUpdateUsed(false);
    setIsSplitModalOpen(true);
  };

  const handleSaveSplit = async (e: React.FormEvent) => {
    e.preventDefault();
    const card = accounts.find((a) => a.id === splitTargetCardId);
    if (!card) {
      error('Card Not Found', 'Please select a valid credit card.');
      return;
    }

    const amt = parseFloat(splitAmount);
    if (isNaN(amt) || amt <= 0) {
      error('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    const person = splitIsSelf ? 'Self (Me)' : splitPerson.trim();
    if (!person) {
      error('Person Name Required', 'Please enter who used this card.');
      return;
    }

    if (editingSplit) {
      const origAmt = editingSplit.split.amount;
      const updatedSplits = (card.splits || []).map((s) => {
        if (s.id === editingSplit.split.id) {
          return {
            ...s,
            personName: person,
            isSelf: splitIsSelf,
            amount: amt,
            description: splitDesc.trim() || 'Credit Card Swipe',
            date: splitDate || new Date().toISOString().split('T')[0],
            status: splitIsSelf ? 'settled' : splitStatus
          };
        }
        return s;
      });

      let newUsed = card.usedAmount;
      if (autoUpdateUsed && amt !== origAmt) {
        newUsed = Math.max(0, card.usedAmount - origAmt + amt);
      }

      try {
        setSplitSubmitting(true);
        await ApiClient.updateAccount(card.id, {
          ...card,
          usedAmount: newUsed,
          availableLimit: Math.max(0, card.creditLimit - newUsed),
          balance: -Math.abs(newUsed),
          splits: updatedSplits
        });

        success('Record Updated', `Updated swipe record for ${person}.`);
        setIsSplitModalOpen(false);
        setEditingSplit(null);
        loadCards();
      } catch (err: any) {
        error('Error', err.message || 'Could not update friend expense.');
      } finally {
        setSplitSubmitting(false);
      }
      return;
    }

    const newSplit: CardSplitExpense = {
      id: `split_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      personName: person,
      isSelf: splitIsSelf,
      amount: amt,
      description: splitDesc.trim() || 'Credit Card Swipe',
      date: splitDate || new Date().toISOString().split('T')[0],
      status: splitIsSelf ? 'settled' : splitStatus,
      settledAt: splitIsSelf || splitStatus === 'settled' ? new Date().toISOString() : undefined
    };

    const currentSplits = card.splits || [];
    const updatedSplits = [newSplit, ...currentSplits];

    let newUsed = card.usedAmount;
    if (autoUpdateUsed) {
      newUsed = Math.max(0, card.usedAmount + amt);
    }

    try {
      setSplitSubmitting(true);
      await ApiClient.updateAccount(card.id, {
        ...card,
        usedAmount: newUsed,
        availableLimit: Math.max(0, card.creditLimit - newUsed),
        balance: -Math.abs(newUsed),
        splits: updatedSplits
      });

      success('Expense Recorded', `Added ${formatCurrency(amt, 'INR')} used by ${person} on ${card.name}.`);
      setIsSplitModalOpen(false);
      loadCards();
    } catch (err: any) {
      error('Error', err.message || 'Could not save friend expense.');
    } finally {
      setSplitSubmitting(false);
    }
  };

  const handleToggleSplitStatus = async (cardId: string, splitId: string) => {
    const card = accounts.find((a) => a.id === cardId);
    if (!card) return;

    const currentSplits = card.splits || [];
    const target = currentSplits.find((s) => s.id === splitId);
    if (!target) return;

    const newStatus = target.status === 'pending' ? 'settled' : 'pending';
    const updatedSplits = currentSplits.map((s) => {
      if (s.id === splitId) {
        return {
          ...s,
          status: newStatus,
          settledAt: newStatus === 'settled' ? new Date().toISOString() : undefined
        };
      }
      return s;
    });

    try {
      await ApiClient.updateAccount(card.id, {
        ...card,
        splits: updatedSplits
      });

      if (newStatus === 'settled') {
        success('Marked Settled! 🎉', `${target.personName}'s share of ${formatCurrency(target.amount, 'INR')} is now settled.`);
      } else {
        success('Marked Pending', `${target.personName}'s share is marked as pending.`);
      }
      loadCards();
    } catch (err: any) {
      error('Error', err.message || 'Could not update status.');
    }
  };

  const handleDeleteSplit = async (cardId: string, splitId: string) => {
    const card = accounts.find((a) => a.id === cardId);
    if (!card) return;

    if (!window.confirm('Delete this card swipe record?')) return;

    const updatedSplits = (card.splits || []).filter((s) => s.id !== splitId);
    try {
      await ApiClient.updateAccount(card.id, {
        ...card,
        splits: updatedSplits
      });
      success('Record Deleted', 'Expense record removed.');
      loadCards();
    } catch (err: any) {
      error('Error', err.message || 'Could not delete record.');
    }
  };

  const handleOpenStatementModal = (card: CreditCardAccount) => {
    setStatementTargetCard(card);
    setCopiedBill(false);
    setIsStatementModalOpen(true);
  };

  const generateWhatsAppMessage = (card: CreditCardAccount) => {
    const splits = card.splits || [];
    const selfTotal = splits.filter((s) => s.isSelf).reduce((sum, s) => sum + s.amount, 0);
    const friendsTotal = splits.filter((s) => !s.isSelf).reduce((sum, s) => sum + s.amount, 0);
    const pendingTotal = splits.filter((s) => !s.isSelf && s.status === 'pending').reduce((sum, s) => sum + s.amount, 0);

    let text = `💳 *MoneyMate | Credit Card Bill Statement*\n`;
    text += `Card: *${card.name} (${card.maskedNumber})*\n`;
    text += `Bank / Line: *${card.institution}*\n`;
    text += `Total Statement Bill: *${formatCurrency(card.usedAmount, 'INR')}*\n`;
    if (card.dueDate) text += `Due Date: *${card.dueDate}*\n`;
    text += `----------------------------------------\n`;
    text += `👤 *My Share (Self)*: ${formatCurrency(selfTotal, 'INR')}\n`;
    text += `👥 *Friends' Share*: ${formatCurrency(friendsTotal, 'INR')} (Pending: ${formatCurrency(pendingTotal, 'INR')})\n\n`;

    if (splits.length > 0) {
      text += `*Who Used This Card:*\n`;
      splits.forEach((s) => {
        const icon = s.isSelf ? '👤' : s.status === 'settled' ? '✅' : '⏳';
        const st = s.isSelf ? '' : ` [${s.status.toUpperCase()}]`;
        text += `${icon} *${s.personName}*: ${formatCurrency(s.amount, 'INR')} - ${s.description}${st}\n`;
      });
    }

    text += `\n----------------------------------------\n`;
    text += `Please transfer your pending share to my UPI before the due date. Thank you!`;
    return text;
  };

  const handleCopyBill = (card: CreditCardAccount) => {
    const text = generateWhatsAppMessage(card);
    navigator.clipboard.writeText(text);
    setCopiedBill(true);
    success('Copied to Clipboard!', 'WhatsApp bill statement summary copied. Ready to paste & send!');
    setTimeout(() => setCopiedBill(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Header */}
      <div className="section-top-header">
        <div>
          <h2 className="section-top-title">
            <span className="nav-emoji">💳</span>
            <span>Credit Cards & Credit Lines</span>
          </h2>
          <p className="section-top-subtitle">
            {accounts.length} Active Card{accounts.length === 1 ? '' : 's'} Linked • Track total limits, outstanding usage, and friend bill splits
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" onClick={() => handleOpenAddSplit()}>
            <Users size={16} />
            <span>+ Record Friend Swipe</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>+ Link New Card</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards (Total Limit, Used, Available, Utilization) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}
      >
        {/* Total Credit Limit */}
        <div className="premium-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Credit Limit
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.12)',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CreditCard size={14} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatCurrency(totalLimit, 'INR')}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across {accounts.length} active credit cards
          </div>
        </div>

        {/* Total Used / Outstanding */}
        <div className="premium-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Used / Dues
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(244, 63, 94, 0.12)',
                color: '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingDown size={14} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: '#f43f5e' }}>
            {formatCurrency(totalUsed, 'INR')}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Current statement balance
          </div>
        </div>

        {/* Available Limit */}
        <div className="premium-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Available Limit
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingUp size={14} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: '#10b981' }}>
            {formatCurrency(totalAvailable, 'INR')}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Ready to spend buffer
          </div>
        </div>

        {/* Utilization Ratio */}
        <div className="premium-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Credit Utilization
            </span>
            <span
              className={`badge-status ${
                overallUtilization <= 30 ? 'success' : overallUtilization <= 50 ? 'warning' : 'danger'
              }`}
              style={{ fontSize: '0.68rem', padding: '2px 6px' }}
            >
              {overallUtilization <= 30 ? 'Healthy (<30%)' : overallUtilization <= 50 ? 'Moderate' : 'High Usage'}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {overallUtilization}%
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--border-subtle)',
              marginTop: '8px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${Math.min(100, overallUtilization)}%`,
                height: '100%',
                borderRadius: 'var(--radius-full)',
                background:
                  overallUtilization <= 30
                    ? '#10b981'
                    : overallUtilization <= 50
                    ? '#f59e0b'
                    : '#ef4444',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Cards List / Grid */}
      {accounts.length === 0 ? (
        <div
          className="premium-card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CreditCard size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>No Credit Cards Linked Yet</h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: '420px', margin: 0 }}>
            Link your credit cards to monitor total limits, outstanding balances, utilization percentage, and friend bill splits.
          </p>
          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Link Your First Card</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px'
          }}
        >
          {accounts.map((card) => {
            const cardUtil =
              card.creditLimit > 0 ? Math.round((card.usedAmount / card.creditLimit) * 100) : 0;
            const splits = card.splits || [];
            const friendsTotal = splits.filter((s) => !s.isSelf).reduce((sum, s) => sum + s.amount, 0);

            return (
              <div
                key={card.id}
                style={{
                  background: card.cardColor || 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '22px',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '235px',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                {/* Card Top Row: Bank Name, Chips, Actions */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                        {card.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500, marginTop: '2px' }}>
                        {card.institution}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenAddSplit(card)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.22)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 'var(--radius-xs)',
                          padding: '5px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Add Friend Split Expense"
                      >
                        <Users size={12} />
                        <span>Split</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenUpdate(card)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 'var(--radius-xs)',
                          padding: '5px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Update Used Balance"
                      >
                        <Edit3 size={12} />
                        <span>Update</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCard(card.id, card.name)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.25)',
                          color: '#fda4af',
                          border: 'none',
                          borderRadius: 'var(--radius-xs)',
                          padding: '5px 7px',
                          cursor: 'pointer'
                        }}
                        title="Unlink card"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Masked Card Number */}
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '1.12rem',
                      letterSpacing: '0.12em',
                      margin: '16px 0 12px',
                      color: 'rgba(255, 255, 255, 0.92)'
                    }}
                  >
                    {card.maskedNumber}
                  </div>
                </div>

                {/* Card Bottom: Limits, Used, and Progress */}
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0, 0, 0, 0.28)',
                      marginBottom: '8px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.64rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
                        Total Limit
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                        {formatCurrency(card.creditLimit, 'INR')}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.64rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
                        Used Amount
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fda4af', marginTop: '2px' }}>
                        {formatCurrency(card.usedAmount, 'INR')}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.64rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
                        Available
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#6ee7b7', marginTop: '2px' }}>
                        {formatCurrency(card.availableLimit, 'INR')}
                      </div>
                    </div>
                  </div>

                  {/* Utilization Progress & Due Date */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.75)', marginBottom: '4px' }}>
                      <span>{cardUtil}% Used</span>
                      <span>{card.dueDate ? `Due: ${card.dueDate}` : 'Active'}</span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '5px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(255, 255, 255, 0.2)',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, cardUtil)}%`,
                          height: '100%',
                          borderRadius: 'var(--radius-full)',
                          background: cardUtil <= 30 ? '#10b981' : cardUtil <= 50 ? '#fbbf24' : '#f43f5e'
                        }}
                      />
                    </div>
                  </div>

                  {/* Splits Summary Badge if any */}
                  {splits.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '8px',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'rgba(255, 255, 255, 0.12)',
                        fontSize: '0.68rem'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255, 255, 255, 0.85)' }}>
                        <Users size={11} />
                        <span>{splits.length} Swiped records</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenStatementModal(card)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fde047',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          padding: 0
                        }}
                      >
                        <span>Friends: {formatCurrency(friendsTotal, 'INR')}</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          BILL GENERATION & FRIEND SPLIT LEDGER SECTION
          ===================================================================== */}
      <div className="premium-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem' }}>👥</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Credit Card Bill & Friend Split Manager
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Track who swiped which credit card, auto-split statement bills, and settle with friends before due dates.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {activeSplitCard && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                onClick={() => handleOpenStatementModal(activeSplitCard)}
              >
                <Share2 size={14} color="#10b981" />
                <span>WhatsApp Statement</span>
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
              onClick={() => handleOpenAddSplit()}
            >
              <Plus size={15} />
              <span>+ Add Swiped Expense</span>
            </button>
          </div>
        </div>

        {/* Card Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedCardFilter('all')}
            style={{
              padding: '7px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: selectedCardFilter === 'all' ? 'var(--primary)' : 'var(--bg-surface)',
              color: selectedCardFilter === 'all' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            All Cards ({accounts.length})
          </button>

          {accounts.map((card) => {
            const isSelected = selectedCardFilter === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCardFilter(card.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{card.name}</span>
                <span style={{ opacity: 0.7, fontSize: '0.72rem' }}>({card.maskedNumber})</span>
                {card.usedAmount > 0 && (
                  <span
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(244,63,94,0.14)',
                      color: isSelected ? '#fff' : '#f43f5e',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem'
                    }}
                  >
                    {formatCurrency(card.usedAmount, 'INR')}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 4 Split KPI Stat Cards */}
        <div className="credit-split-kpis">
          {/* Card 1: Total Card Statement Bill / Dues */}
          <div className="credit-split-kpi-item">
            <div className="credit-split-kpi-label" style={{ color: 'var(--text-muted)' }}>
              {activeSplitCard ? `${activeSplitCard.name} Bill` : 'Total Card Bills / Dues'}
            </div>
            <div className="credit-split-kpi-val" style={{ color: '#f43f5e' }}>
              {formatCurrency(activeSplitCard ? activeSplitCard.usedAmount : (totalUsed > 0 ? totalUsed : splitStats.total), 'INR')}
            </div>
            <div className="credit-split-kpi-sub">
              {activeSplitCard?.dueDate ? `Due on ${activeSplitCard.dueDate}` : 'Combined card statement bill'}
            </div>
          </div>

          {/* Card 2: My Share (Self) */}
          <div className="credit-split-kpi-item">
            <div className="credit-split-kpi-label" style={{ color: 'var(--text-muted)' }}>
              👤 My Share (Self)
            </div>
            <div className="credit-split-kpi-val" style={{ color: 'var(--primary)' }}>
              {formatCurrency(splitStats.self, 'INR')}
            </div>
            <div className="credit-split-kpi-sub">
              Your personal spending
            </div>
          </div>

          {/* Card 3: Friends' Total */}
          <div className="credit-split-kpi-item">
            <div className="credit-split-kpi-label" style={{ color: 'var(--text-muted)' }}>
              👥 Friends' Share
            </div>
            <div className="credit-split-kpi-val" style={{ color: '#8b5cf6' }}>
              {formatCurrency(splitStats.friends, 'INR')}
            </div>
            <div className="credit-split-kpi-sub">
              Settled: {formatCurrency(splitStats.settled, 'INR')}
            </div>
          </div>

          {/* Card 4: Pending to Collect from Friends */}
          <div className="credit-split-kpi-item" style={{ border: '1px solid rgba(245, 158, 11, 0.35)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="credit-split-kpi-label" style={{ color: '#f59e0b' }}>
                ⏳ Pending to Collect
              </span>
              {splitStats.pendingCount > 0 && (
                <span className="badge-status warning" style={{ fontSize: '0.66rem', padding: '1px 5px' }}>
                  {splitStats.pendingCount} Dues
                </span>
              )}
            </div>
            <div className="credit-split-kpi-val" style={{ color: '#f59e0b' }}>
              {formatCurrency(splitStats.pending, 'INR')}
            </div>
            <div className="credit-split-kpi-sub">
              Unsettled friend payments
            </div>
          </div>
        </div>

        {/* Visual Split Ratio Bar */}
        {splitStats.total > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>
                <strong>Split Distribution:</strong> Self: {Math.round((splitStats.self / splitStats.total) * 100)}% | Friends: {Math.round((splitStats.friends / splitStats.total) * 100)}%
              </span>
              <span>{displayedSplits.length} Records</span>
            </div>
            <div style={{ width: '100%', height: '8px', borderRadius: 'var(--radius-full)', background: 'var(--border-subtle)', display: 'flex', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(splitStats.self / splitStats.total) * 100}%`,
                  background: 'var(--primary)',
                  transition: 'width 0.3s ease'
                }}
                title={`Self: ${formatCurrency(splitStats.self, 'INR')}`}
              />
              <div
                style={{
                  width: `${(splitStats.settled / splitStats.total) * 100}%`,
                  background: '#10b981',
                  transition: 'width 0.3s ease'
                }}
                title={`Friends Settled: ${formatCurrency(splitStats.settled, 'INR')}`}
              />
              <div
                style={{
                  width: `${(splitStats.pending / splitStats.total) * 100}%`,
                  background: '#f59e0b',
                  transition: 'width 0.3s ease'
                }}
                title={`Friends Pending: ${formatCurrency(splitStats.pending, 'INR')}`}
              />
            </div>
          </div>
        )}

        {/* Swiped Records Table / List */}
        {displayedSplits.length === 0 ? (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)'
            }}
          >
            <Users size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              No Swiped Expenses Recorded Yet
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 14px' }}>
              When you or your friends swipe your credit card, record it here to easily calculate who owes what on the final bill.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 16px', margin: '0 auto' }}
              onClick={() => handleOpenAddSplit()}
            >
              <Plus size={14} />
              <span>Record First Swipe</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {displayedSplits.map((item) => (
              <div key={item.id} className="swiped-record-item">
                {/* Left: Avatar & Person Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      background: item.isSelf ? 'rgba(9, 92, 229, 0.12)' : item.status === 'settled' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      color: item.isSelf ? 'var(--primary)' : item.status === 'settled' ? '#10b981' : '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      flexShrink: 0
                    }}
                  >
                    {item.isSelf ? '👤' : item.personName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {item.personName}
                      </span>
                      {item.isSelf ? (
                        <span className="badge-status" style={{ fontSize: '0.64rem', padding: '1px 5px', background: 'rgba(9,92,229,0.1)', color: 'var(--primary)' }}>
                          Self
                        </span>
                      ) : (
                        <span className={`badge-status ${item.status === 'settled' ? 'success' : 'warning'}`} style={{ fontSize: '0.64rem', padding: '1px 5px' }}>
                          {item.status === 'settled' ? 'Paid / Settled' : 'Pending Due'}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span>{item.description}</span>
                      <span>•</span>
                      <span>{item.cardName} ({item.cardMask})</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Action Toggle */}
                <div className="swiped-record-actions-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: item.isSelf ? 'var(--text-primary)' : item.status === 'settled' ? '#10b981' : '#f59e0b' }}>
                      {formatCurrency(item.amount, 'INR')}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {item.isSelf ? 'Own Expense' : item.status === 'settled' ? 'Settled' : 'Awaiting Payment'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditSplit(item.cardId, item)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 8px',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      title="Edit swipe details"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>

                    {!item.isSelf && (
                      <button
                        type="button"
                        onClick={() => handleToggleSplitStatus(item.cardId, item.id)}
                        style={{
                          background: item.status === 'settled' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          color: item.status === 'settled' ? '#10b981' : '#f59e0b',
                          border: item.status === 'settled' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 10px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        title={item.status === 'settled' ? 'Mark as Pending' : 'Mark as Settled'}
                      >
                        {item.status === 'settled' ? (
                          <>
                            <Check size={13} />
                            <span>Settled</span>
                          </>
                        ) : (
                          <>
                            <Clock size={13} />
                            <span>Mark Paid</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteSplit(item.cardId, item.id)}
                      style={{
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        border: 'none',
                        padding: '6px',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      title="Delete swipe record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: Link Credit Card */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Link Credit Card" maxWidth="500px">
        <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Card Name *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. HDFC Regalia Gold, Canara Bank Rupay"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Bank / Issuer
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Canara Bank, IndusInd Bank, HDFC"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Credit Limit (₹) *
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 150000"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Amount Used (₹)
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 24698"
                value={usedAmount}
                onChange={(e) => setUsedAmount(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Last 4 Digits
              </label>
              <input
                type="text"
                maxLength={4}
                className="form-input"
                placeholder="e.g. 3003"
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Due Date
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 11th of every month"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Color Presets */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Card Theme / Color
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              {CARD_COLOR_PRESETS.map((preset) => {
                const isSelected = cardColor === preset.value;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setCardColor(preset.value)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-full)',
                      background: preset.value,
                      border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                      boxShadow: isSelected ? '0 0 0 2px #6366f1' : 'none',
                      cursor: 'pointer'
                    }}
                    title={preset.name}
                  />
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ flex: 2, justifyContent: 'center' }}
            >
              {submitting ? 'Linking...' : '+ Link Card'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Update Used Balance */}
      <Modal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        title={`Update ${selectedCard?.name || 'Card'} Balance`}
        maxWidth="440px"
      >
        <form onSubmit={handleSaveUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '-4px' }}>
            Update your current amount used or adjust your total credit limit.
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Current Amount Used (₹) *
            </label>
            <input
              type="number"
              className="form-input"
              value={updateUsedVal}
              onChange={(e) => setUpdateUsedVal(e.target.value)}
              required
              autoFocus
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
              Set to 0 if you paid off your bill completely.
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Credit Limit (₹)
            </label>
            <input
              type="number"
              className="form-input"
              value={updateLimitVal}
              onChange={(e) => setUpdateLimitVal(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setIsUpdateOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="btn btn-primary"
              style={{ flex: 2, justifyContent: 'center' }}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Add/Edit Swiped Expense / Friend Split Modal */}
      <Modal
        isOpen={isSplitModalOpen}
        onClose={() => {
          setIsSplitModalOpen(false);
          setEditingSplit(null);
        }}
        title={editingSplit ? 'Edit Swiped Expense / Friend Split' : 'Record Card Swipe / Friend Split'}
        maxWidth="480px"
      >
        <form onSubmit={handleSaveSplit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '-4px' }}>
            Record who used this credit card and how much they spent towards the statement bill.
          </div>

          {/* Select Credit Card */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Select Credit Card *
            </label>
            <select
              className="form-input"
              value={splitTargetCardId}
              onChange={(e) => setSplitTargetCardId(e.target.value)}
              required
            >
              {accounts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.maskedNumber}) - Avail: {formatCurrency(c.availableLimit, 'INR')}
                </option>
              ))}
            </select>
          </div>

          {/* Who Spent Segmented Toggle */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Who Swiped / Used This Card? *
            </label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => {
                  setSplitIsSelf(true);
                  setSplitPerson('Self (Me)');
                }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: splitIsSelf ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: splitIsSelf ? 'rgba(9, 92, 229, 0.12)' : 'var(--bg-surface)',
                  color: splitIsSelf ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                👤 Myself (Personal)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSplitIsSelf(false);
                  if (splitPerson === 'Self (Me)') setSplitPerson('');
                }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: !splitIsSelf ? '1.5px solid #8b5cf6' : '1px solid var(--border-subtle)',
                  background: !splitIsSelf ? 'rgba(139, 92, 246, 0.12)' : 'var(--bg-surface)',
                  color: !splitIsSelf ? '#8b5cf6' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                👥 Friend / Other
              </button>
            </div>
          </div>

          {/* Friend Name Input (if not self) */}
          {!splitIsSelf && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Friend's Name *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ravi, Suresh, Kalyan"
                value={splitPerson}
                onChange={(e) => setSplitPerson(e.target.value)}
                required
                autoFocus
              />
              {/* Quick Friend Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {['Ravi', 'Suresh', 'Kalyan', 'Ramesh', 'Pooja'].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSplitPerson(name)}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      padding: '2px 8px',
                      fontSize: '0.72rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    + {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Amount & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Amount Swiped (₹) *
              </label>
              <input
                type="number"
                step="any"
                className="form-input"
                placeholder="e.g. 10000"
                value={splitAmount}
                onChange={(e) => setSplitAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Swipe Date
              </label>
              <input
                type="date"
                className="form-input"
                value={splitDate}
                onChange={(e) => setSplitDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Purpose / What Was Purchased?
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Indigo Flight Tickets, Amazon Shopping, Mobile Phone"
              value={splitDesc}
              onChange={(e) => setSplitDesc(e.target.value)}
            />
          </div>

          {/* Status & Auto-update Used */}
          {!splitIsSelf && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Initial Settlement Status
              </label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <label
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: splitStatus === 'pending' ? 'rgba(245,158,11,0.12)' : 'var(--bg-surface)',
                    border: splitStatus === 'pending' ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: splitStatus === 'pending' ? '#f59e0b' : 'var(--text-secondary)'
                  }}
                >
                  <input
                    type="radio"
                    name="splitStatus"
                    value="pending"
                    checked={splitStatus === 'pending'}
                    onChange={() => setSplitStatus('pending')}
                  />
                  <span>⏳ Unpaid (Pending)</span>
                </label>

                <label
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: splitStatus === 'settled' ? 'rgba(16,185,129,0.12)' : 'var(--bg-surface)',
                    border: splitStatus === 'settled' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: splitStatus === 'settled' ? '#10b981' : 'var(--text-secondary)'
                  }}
                >
                  <input
                    type="radio"
                    name="splitStatus"
                    value="settled"
                    checked={splitStatus === 'settled'}
                    onChange={() => setSplitStatus('settled')}
                  />
                  <span>✅ Already Paid Back</span>
                </label>
              </div>
            </div>
          )}

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={autoUpdateUsed}
              onChange={(e) => setAutoUpdateUsed(e.target.checked)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <span>Auto-add this amount to card's current used balance</span>
          </label>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setIsSplitModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={splitSubmitting}
              className="btn btn-primary"
              style={{ flex: 2, justifyContent: 'center' }}
            >
              {splitSubmitting ? 'Saving...' : editingSplit ? 'Save Changes' : '+ Save Swiped Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 4: Generated Statement Bill Breakdown & WhatsApp Share */}
      <Modal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        title="Generated Statement Bill & Split Summary"
        maxWidth="500px"
      >
        {statementTargetCard && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Here is the formatted statement bill breakdown for <strong>{statementTargetCard.name} ({statementTargetCard.maskedNumber})</strong>. You can copy it or share directly to your friends on WhatsApp!
            </div>

            {/* Bill Summary Box */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
                color: 'var(--text-primary)',
                maxHeight: '260px',
                overflowY: 'auto'
              }}
            >
              {generateWhatsAppMessage(statementTargetCard)}
            </div>

            {/* Action Buttons */}
            <div className="statement-modal-actions">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(generateWhatsAppMessage(statementTargetCard))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn statement-whatsapp-btn"
              >
                <MessageCircle size={18} />
                <span>Share on WhatsApp</span>
              </a>

              <button
                type="button"
                className="btn btn-secondary statement-copy-btn"
                onClick={() => handleCopyBill(statementTargetCard)}
              >
                {copiedBill ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                <span>{copiedBill ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
