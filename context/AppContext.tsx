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
  Language,
} from '@/constants/storage';
import i18n from '@/i18n';

type AppState = {
  payday: number | null;
  language: Language;
  bankConnected: boolean;
  onboardingComplete: boolean;
  hydrated: boolean;
  setPayday: (day: number) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  setBankConnected: (connected: boolean) => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [payday, setPaydayState] = useState<number | null>(25);
  const [language, setLanguageState] = useState<Language>('sv');
  const [bankConnected, setBankConnectedState] = useState(false);
  const [onboardingComplete, setOnboardingCompleteState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const [pd, lang, bc, oc] = await Promise.all([
        getPayday(),
        getLanguage(),
        isBankConnected(),
        isOnboardingComplete(),
      ]);
      if (pd !== null) setPaydayState(pd);
      setLanguageState(lang);
      setBankConnectedState(bc);
      setOnboardingCompleteState(oc);
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

  return (
    <AppContext.Provider
      value={{
        payday,
        language,
        bankConnected,
        onboardingComplete,
        hydrated,
        setPayday,
        setLanguage,
        setBankConnected,
        completeOnboarding,
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
