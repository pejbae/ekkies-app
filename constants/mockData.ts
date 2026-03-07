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

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

export const MOCK_TRANSACTIONS: Transaction[] = [
  // Today
  { id: '1',  merchant: 'ICA Maxi',          amount: -487,  category: 'mat',             date: d(0), confirmed: false, emoji: '🛒' },
  { id: '2',  merchant: 'Kaffe Kontoret',    amount: -52,   category: 'mat',             date: d(0), confirmed: false, emoji: '☕' },
  // 1 day ago
  { id: '3',  merchant: 'SL',                amount: -145,  category: 'transport',       date: d(1), confirmed: true,  emoji: '🚇' },
  { id: '4',  merchant: 'Spotify',           amount: -119,  category: 'prenumerationer', date: d(1), confirmed: true,  emoji: '🎵' },
  // 2 days ago
  { id: '5',  merchant: 'Lön - Företaget AB', amount: 32500, category: 'lon',           date: d(2), confirmed: true,  emoji: '💰' },
  { id: '6',  merchant: 'Systembolaget',     amount: -289,  category: 'noje',            date: d(2), confirmed: true,  emoji: '🍷' },
  // 3 days ago
  { id: '7',  merchant: 'Coop',              amount: -421,  category: 'mat',             date: d(3), confirmed: true,  emoji: '🛒' },
  { id: '8',  merchant: 'Bolt',              amount: -89,   category: 'transport',       date: d(3), confirmed: true,  emoji: '🚗' },
  // 4 days ago
  { id: '9',  merchant: 'Apoteket',          amount: -156,  category: 'halsa',           date: d(4), confirmed: true,  emoji: '💊' },
  { id: '10', merchant: 'H&M',               amount: -649,  category: 'shopping',        date: d(4), confirmed: true,  emoji: '👕' },
  // 5 days ago
  { id: '11', merchant: 'Netflix',           amount: -139,  category: 'prenumerationer', date: d(5), confirmed: true,  emoji: '📺' },
  { id: '12', merchant: 'Hemköp',            amount: -334,  category: 'mat',             date: d(5), confirmed: true,  emoji: '🥬' },
  { id: '13', merchant: "McDonald's",        amount: -143,  category: 'mat',             date: d(5), confirmed: true,  emoji: '🍔' },
  // 6 days ago
  { id: '14', merchant: 'Kicks',             amount: -299,  category: 'halsa',           date: d(6), confirmed: true,  emoji: '💅' },
  { id: '15', merchant: 'Stadium',           amount: -459,  category: 'shopping',        date: d(6), confirmed: true,  emoji: '👟' },
  // 7 days ago
  { id: '16', merchant: 'Uber Eats',         amount: -312,  category: 'mat',             date: d(7), confirmed: true,  emoji: '🍜' },
  { id: '17', merchant: 'HBO Max',           amount: -119,  category: 'prenumerationer', date: d(7), confirmed: true,  emoji: '📺' },
  // 8 days ago
  { id: '18', merchant: 'Pressbyrån',        amount: -67,   category: 'mat',             date: d(8), confirmed: true,  emoji: '🥐' },
  { id: '19', merchant: 'Gym kort',          amount: -349,  category: 'halsa',           date: d(8), confirmed: true,  emoji: '💪' },
  // 10 days ago
  { id: '20', merchant: 'ZARA',              amount: -549,  category: 'shopping',        date: d(10), confirmed: true, emoji: '🛍️' },
  { id: '21', merchant: 'Bio Filmstaden',    amount: -200,  category: 'noje',            date: d(10), confirmed: true, emoji: '🎬' },
  // 11 days ago
  { id: '22', merchant: 'Willys',            amount: -378,  category: 'mat',             date: d(11), confirmed: true, emoji: '🛒' },
  { id: '23', merchant: 'Swish - Hyra',      amount: -4500, category: 'hem',             date: d(11), confirmed: true, emoji: '🏠' },
  // 12 days ago
  { id: '24', merchant: 'Åhléns',            amount: -389,  category: 'shopping',        date: d(12), confirmed: true, emoji: '🛍️' },
  { id: '25', merchant: 'Espresso House',    amount: -67,   category: 'mat',             date: d(12), confirmed: true, emoji: '☕' },
  // 13 days ago
  { id: '26', merchant: 'SL Månadskort',     amount: -990,  category: 'transport',       date: d(13), confirmed: true, emoji: '🚇' },
  { id: '27', merchant: 'Foodora',           amount: -189,  category: 'mat',             date: d(13), confirmed: true, emoji: '🍕' },
  // 14 days ago
  { id: '28', merchant: 'Max Hamburgare',    amount: -129,  category: 'mat',             date: d(14), confirmed: true, emoji: '🍔' },
  { id: '29', merchant: 'Apple Music',       amount: -99,   category: 'prenumerationer', date: d(14), confirmed: true, emoji: '🎵' },
];

export const MOCK_USER = {
  name: 'Pej',
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

// Round each spending transaction up to nearest 50 kr and return total savings potential.
export const getRoundUpSavings = (
  transactions: Transaction[],
  days: number = 7
): number => {
  const cutoff = new Date(Date.now() - days * 86400000);
  return transactions
    .filter((t) => t.amount < 0 && new Date(t.date) >= cutoff)
    .reduce((sum, t) => {
      const abs = Math.abs(t.amount);
      const roundedUp = Math.ceil(abs / 50) * 50;
      return sum + (roundedUp - abs);
    }, 0);
};

// "Safe to spend today" = daily budget allowance remaining for today.
// Formula: (total_budget - month_spending) / days_until_payday
export const getSafeToSpendToday = (
  transactions: Transaction[],
  budgets: Partial<Record<Category, number>>,
  payday: number
): number => {
  const DISCRETIONARY: Category[] = ['mat', 'transport', 'noje', 'halsa', 'shopping', 'prenumerationer'];
  const totalBudget = DISCRETIONARY.reduce((sum, cat) => sum + (budgets[cat] ?? 0), 0);
  const byCategory = getMonthSpendingByCategory(transactions);
  const totalSpent = DISCRETIONARY.reduce((sum, cat) => sum + (byCategory[cat] ?? 0), 0);
  const remaining = totalBudget - totalSpent;
  const daysLeft = Math.max(getDaysUntilPayday(payday), 1);
  return Math.round(remaining / daysLeft);
};
