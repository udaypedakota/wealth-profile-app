import { CurrencyCode } from '../types/profile';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
  SGD: 'S$'
};

/**
 * Formats a number to localized currency string (supports Indian Lakhs/Crores for INR)
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol}0`;
  }

  if (currency === 'INR') {
    // Format according to Indian numbering system (e.g. 1,00,000)
    const isNegative = amount < 0;
    const absVal = Math.abs(Math.round(amount));
    const strVal = absVal.toString();
    
    let lastThree = strVal.substring(strVal.length - 3);
    const otherNumbers = strVal.substring(0, strVal.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return `${isNegative ? '-' : ''}${symbol}${formatted}`;
  }

  return `${symbol}${amount.toLocaleString('en-US')}`;
}

/**
 * Format date string into human friendly date like "14 Aug 2024"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get initials from a full name (e.g. "Rajesh Jena" -> "RJ")
 */
export function getInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Mask an account or card number, keeping only last 4 visible (e.g. "•••• 4892")
 */
export function maskAccountNumber(numStr: string): string {
  if (!numStr) return '•••• 0000';
  const clean = numStr.replace(/\s+/g, '');
  const lastFour = clean.slice(-4);
  return `•••• ${lastFour}`;
}
