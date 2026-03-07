import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import sv from './sv.json';
import en from './en.json';

// Auto-detect device language; fall back to English if not Swedish
const deviceLang = getLocales()?.[0]?.languageCode ?? 'en';
const defaultLang = deviceLang.startsWith('sv') ? 'sv' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    sv: { translation: sv },
    en: { translation: en },
  },
  lng: defaultLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
