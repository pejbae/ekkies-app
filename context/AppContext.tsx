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
  Language,
} from '@/constants/storage';
import { MOCK_BUDGETS, Category } from '@/constants/mockData';
import i18n from '@/i18n';

type AppState = {
  payday: number | null;
  language: Language;
  bankConnected: boolean;
  onboardingComplete: boolean;
  hydrated: boolean;
  budgets: Record<string, number>;
  setPayday: (day: number) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  setBankConnected: (connected: boolean) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setBudget: (category: string, amount: number) => Promise<void>;
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

  useEffect(() => {
    (async () => {
      const [pd, lang, bc, oc, savedBudgets] = await Promise.all([
        getPayday(),
        getLanguage(),
        isBankConnected(),
        isOnboardingComplete(),
        getBudgets(),
      ]);
      if (pd !== null) setPaydayState(pd);
      setLanguageState(lang);
      setBankConnectedState(bc);
      setOnboardingCompleteState(oc);
      if (Object.keys(savedBudgets).length > 0) {
        setBudgetsState(savedBudgets);
      }
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

  return (
    <AppContext.Provider
      value={{
        payday,
        language,
        bankConnected,
        onboardingComplete,
        hydrated,
        budgets,
        setPayday,
        setLanguage,
        setBankConnected,
        completeOnboarding,
        setBudget,
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
