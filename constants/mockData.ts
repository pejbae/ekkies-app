// Mock data for development
// Simulates what the Tink API will return.

export type Transaction = {
  id: string;
  merchant: string;
  amount: number; // negative = spending, positive = income
  category: Category;
  date: string; // ISO string
  confirmed: boolean;
  emoji: string;
};

export type Category =
  | 'mat'
  | 'transport'
  | 'noje'
  | 'halsa'
  | 'shopping'
  | 'hem'
  | 'prenumerationer'
  | 'ovrigt'
  | 'lon';

export function getCategoryLabel(
  category: string,
  t: (key: string) => string
): string {
  return t(`categories.${category}`);
}

// Colors that work well on white — vibrant, not banking-ish
export const CATEGORY_COLORS: Record<Category, string> = {
  mat: '#FF6B6B',
  transport: '#4ECDC4',
  noje: '#FF9F43',
  halsa: '#A29BFE',
  shopping: '#FF2D7A',
  hem: '#00B894',
  prenumerationer: '#FDCB6E',
  ovrigt: '#B0B0B0',
  lon: '#00C48C',
};

// Default monthly budgets per category (in SEK)
export const MOCK_BUDGETS: Partial<Record<Category, number>> = {
  mat: 4000,
  transport: 1500,
  noje: 2000,
  halsa: 500,
  shopping: 2000,
  prenumerationer: 700,
  hem: 1000,
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    merchant: 'ICA Maxi',
    amount: -487,
    category: 'mat',
    date: new Date().toISOString(),
    confirmed: false,
    emoji: '🛒',
  },
  {
    id: '2',
    merchant: 'Kaffe Kontoret',
    amount: -52,
    category: 'mat',
    date: new Date().toISOString(),
    confirmed: false,
    emoji: '☕',
  },
  {
    id: '3',
    merchant: 'SL',
    amount: -145,
    category: 'transport',
    date: new Date(Date.now() - 86400000).toISOString(),
    confirmed: true,
    emoji: '🚇',
  },
  {
    id: '4',
    merchant: 'Spotify',
    amount: -119,
    category: 'prenumerationer',
    date: new Date(Date.now() - 86400000).toISOString(),
    confirmed: true,
    emoji: '🎵',
  },
  {
    id: '5',
    merchant: 'Lön - Företaget AB',
    amount: 32500,
    category: 'lon',
    date: new Date(Date.now() - 172800000).toISOString(),
    confirmed: true,
    emoji: '💰',
  },
  {
    id: '6',
    merchant: 'Systembolaget',
    amount: -289,
    category: 'noje',
    date: new Date(Date.now() - 172800000).toISOString(),
    confirmed: false,
    emoji: '🍷',
  },
  {
    id: '7',
    merchant: 'Apoteket',
    amount: -156,
    category: 'halsa',
    date: new Date(Date.now() - 259200000).toISOString(),
    confirmed: true,
    emoji: '💊',
  },
  {
    id: '8',
    merchant: 'H&M',
    amount: -649,
    category: 'shopping',
    date: new Date(Date.now() - 345600000).toISOString(),
    confirmed: true,
    emoji: '👕',
  },
  {
    id: '9',
    merchant: 'Netflix',
    amount: -139,
    category: 'prenumerationer',
    date: new Date(Date.now() - 432000000).toISOString(),
    confirmed: true,
    emoji: '📺',
  },
  {
    id: '10',
    merchant: 'Hemköp',
    amount: -334,
    category: 'mat',
    date: new Date(Date.now() - 432000000).toISOString(),
    confirmed: true,
    emoji: '🥬',
  },
];

export const MOCK_USER = {
  name: 'Alex',
  payday: 25,
  monthlyIncome: 32500,
  currency: 'kr',
};

// Helpers

export const getTodaySpending = (transactions: Transaction[]): number => {
  const today = new Date().toDateString();
  return transactions
    .filter((t) => new Date(t.date).toDateString() === today && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

export const getMonthSpendingByCategory = (
  transactions: Transaction[]
): Partial<Record<Category, number>> => {
  const now = new Date();
  const result: Partial<Record<Category, number>> = {};
  transactions
    .filter((t) => {
      const d = new Date(t.date);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear() &&
        t.amount < 0
      );
    })
    .forEach((t) => {
      result[t.category] = (result[t.category] || 0) + Math.abs(t.amount);
    });
  return result;
};

export const getDaysUntilPayday = (payday: number): number => {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), payday);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, payday);
  const target = now > thisMonth ? nextMonth : thisMonth;
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

export const getBalanceUntilPayday = (
  transactions: Transaction[],
  monthlyIncome: number
): number => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const spent = transactions
    .filter((t) => new Date(t.date) >= startOfMonth && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  return monthlyIncome - spent;
};

export const getBudgetProgress = (
  spent: number,
  budget: number
): { pct: number; color: string } => {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  let color = '#00C48C'; // positive green
  if (pct >= 90) color = '#FF3B30'; // danger
  else if (pct >= 70) color = '#FF9500'; // warning
  return { pct, color };
};
