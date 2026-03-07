import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  isOnboardingComplete,
  markOnboardingComplete,
  getPayday,
  setPayday as storePayday,
  getLanguage,
  setLanguage as storeLanguage,
  isBankConnected,
  setBankConnected as storeBankConnected,
  getBudgets,
  saveBudgets,
  getWidgetOrder,
  saveWidgetOrder,
  getActiveAccount,
  saveActiveAccount,
  getPinnedBudgetCategories,
  savePinnedBudgetCategories,
  Language,
  ActiveAccount,
} from '@/constants/storage';
import { MOCK_BUDGETS } from '@/constants/mockData';
import { WidgetId, DEFAULT_WIDGET_ORDER } from '@/constants/widgets';
import i18n from '@/i18n';

const DISCRETIONARY_CATS = ['mat', 'transport', 'noje', 'halsa', 'shopping', 'prenumerationer'];

type AppState = {
  payday: number | null;
  language: Language;
  bankConnected: boolean;
  onboardingComplete: boolean;
  hydrated: boolean;
  budgets: Record<string, number>;
  widgetOrder: WidgetId[];
  activeAccount: ActiveAccount;
  pinnedBudgetCategories: string[];
  setPayday: (day: number) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  setBankConnected: (connected: boolean) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setBudget: (category: string, amount: number) => Promise<void>;
  setWidgetOrder: (order: WidgetId[]) => Promise<void>;
  setActiveAccount: (account: ActiveAccount) => Promise<void>;
  setPinnedBudgetCategories: (cats: string[]) => Promise<void>;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [payday, setPaydayState] = useState<number | null>(25);
  const [language, setLanguageState] = useState<Language>('sv');
  const [bankConnected, setBankConnectedState] = useState(false);
  const [onboardingComplete, setOnboardingCompleteState] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [budgets, setBudgetsState] = useState<Record<string, number>>(
    MOCK_BUDGETS as Record<string, number>
  );
  const [widgetOrder, setWidgetOrderState] = useState<WidgetId[]>(DEFAULT_WIDGET_ORDER);
  const [activeAccount, setActiveAccountState] = useState<ActiveAccount>('pej');
  const [pinnedBudgetCategories, setPinnedBudgetCategoriesState] = useState<string[]>(DISCRETIONARY_CATS);

  useEffect(() => {
    (async () => {
      const [pd, lang, bc, oc, savedBudgets, savedWidgets, savedAccount, savedPinned] = await Promise.all([
        getPayday(),
        getLanguage(),
        isBankConnected(),
        isOnboardingComplete(),
        getBudgets(),
        getWidgetOrder(),
        getActiveAccount(),
        getPinnedBudgetCategories(),
      ]);
      if (pd !== null) setPaydayState(pd);
      setLanguageState(lang);
      setBankConnectedState(bc);
      setOnboardingCompleteState(oc);
      if (Object.keys(savedBudgets).length > 0) setBudgetsState(savedBudgets);
      if (savedWidgets && savedWidgets.length > 0) setWidgetOrderState(savedWidgets as WidgetId[]);
      setActiveAccountState(savedAccount);
      if (savedPinned && savedPinned.length > 0) setPinnedBudgetCategoriesState(savedPinned);
      await i18n.changeLanguage(lang);
      setHydrated(true);
    })();
  }, []);

  const setPayday = async (day: number) => {
    await storePayday(day);
    setPaydayState(day);
  };

  const setLanguage = async (lang: Language) => {
    await storeLanguage(lang);
    await i18n.changeLanguage(lang);
    setLanguageState(lang);
  };

  const setBankConnected = async (connected: boolean) => {
    await storeBankConnected(connected);
    setBankConnectedState(connected);
  };

  const completeOnboarding = async () => {
    await markOnboardingComplete();
    setOnboardingCompleteState(true);
  };

  const setBudget = async (category: string, amount: number) => {
    const updated = { ...budgets, [category]: amount };
    await saveBudgets(updated);
    setBudgetsState(updated);
  };

  const setWidgetOrder = async (order: WidgetId[]) => {
    await saveWidgetOrder(order);
    setWidgetOrderState(order);
  };

  const setActiveAccount = async (account: ActiveAccount) => {
    await saveActiveAccount(account);
    setActiveAccountState(account);
  };

  const setPinnedBudgetCategories = async (cats: string[]) => {
    await savePinnedBudgetCategories(cats);
    setPinnedBudgetCategoriesState(cats);
  };

  return (
    <AppContext.Provider
      value={{
        payday,
        language,
        bankConnected,
        onboardingComplete,
        hydrated,
        budgets,
        widgetOrder,
        activeAccount,
        pinnedBudgetCategories,
        setPayday,
        setLanguage,
        setBankConnected,
        completeOnboarding,
        setBudget,
        setWidgetOrder,
        setActiveAccount,
        setPinnedBudgetCategories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
