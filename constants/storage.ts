import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { getLocales } from 'expo-localization';

const KEYS = {
  ONBOARDING_COMPLETE: 'ekkies_onboarding_complete',
  PAYDAY: 'ekkies_payday',
  LANGUAGE: 'ekkies_language',
  BANK_CONNECTED: 'ekkies_bank_connected',
  BUDGETS: 'ekkies_budgets',
};

const SECURE_KEYS = {
  TINK_ACCESS_TOKEN: 'ekkies_tink_access_token',
  TINK_REFRESH_TOKEN: 'ekkies_tink_refresh_token',
};

export type Language = 'sv' | 'en';

// Onboarding

export async function isOnboardingComplete(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE);
  return v === 'true';
}

export async function markOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, 'true');
}

// Payday

export async function getPayday(): Promise<number | null> {
  const v = await AsyncStorage.getItem(KEYS.PAYDAY);
  if (v == null) return null;
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
}

export async function setPayday(day: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.PAYDAY, String(day));
}

// Language

export async function getLanguage(): Promise<Language> {
  const v = await AsyncStorage.getItem(KEYS.LANGUAGE);
  if (v === 'en' || v === 'sv') return v;
  // No saved preference — use device locale
  const deviceLang = getLocales()?.[0]?.languageCode ?? 'en';
  return deviceLang.startsWith('sv') ? 'sv' : 'en';
}

export async function setLanguage(lang: Language): Promise<void> {
  await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
}

// Bank connection

export async function isBankConnected(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.BANK_CONNECTED);
  return v === 'true';
}

export async function setBankConnected(connected: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.BANK_CONNECTED, connected ? 'true' : 'false');
}

// Budgets

export async function getBudgets(): Promise<Record<string, number>> {
  const v = await AsyncStorage.getItem(KEYS.BUDGETS);
  if (!v) return {};
  try {
    return JSON.parse(v);
  } catch {
    return {};
  }
}

export async function saveBudgets(budgets: Record<string, number>): Promise<void> {
  await AsyncStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
}

// Tink tokens (secure)

export async function saveTinkTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> {
  await SecureStore.setItemAsync(SECURE_KEYS.TINK_ACCESS_TOKEN, tokens.accessToken);
  await SecureStore.setItemAsync(SECURE_KEYS.TINK_REFRESH_TOKEN, tokens.refreshToken);
}

export async function getTinkAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(SECURE_KEYS.TINK_ACCESS_TOKEN);
}

export async function getTinkRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(SECURE_KEYS.TINK_REFRESH_TOKEN);
}

export async function clearTinkTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(SECURE_KEYS.TINK_ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(SECURE_KEYS.TINK_REFRESH_TOKEN);
}
