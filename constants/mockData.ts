// Mock data for development
// This simulates what the Tink API will return.
// We build the whole UI against this, then swap in real Tink data later.

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

// Use getCategoryLabel(cat, t) instead of a static label map — supports i18n.
export function getCategoryLabel(
  category: string,
  t: (key: string) => string
): string {
  return t(`categories.${category}`);
}

export const CATEGORY_COLORS: Record<Category, string> = {
  mat: '#4CAF72',
  transport: '#5B8DD9',
  noje: '#C8963E',
  halsa: '#9B72CF',
  shopping: '#E05555',
  hem: '#5BA8A0',
  prenumerationer: '#D4845A',
  ovrigt: '#6B7D6C',
  lon: '#4CAF72',
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
];

export const MOCK_USER = {
  name: 'Alex',
  payday: 25, // day of month
  monthlyIncome: 32500,
  currency: 'kr',
};

// Helpers
export const getTodaySpending = (transactions: Transaction[]): number => {
  const today = new Date().toDateString();
  return transactions
    .filter(
      (t) =>
        new Date(t.date).toDateString() === today && t.amount < 0
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

export const getMonthSpendingByCategory = (
  transactions: Transaction[]
): Record<Category, number> => {
  const now = new Date();
  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear() &&
      t.amount < 0
    );
  });

  const result = {} as Record<Category, number>;
  thisMonth.forEach((t) => {
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
  const spentThisMonth = transactions
    .filter((t) => new Date(t.date) >= startOfMonth && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  return monthlyIncome - spentThisMonth;
};
