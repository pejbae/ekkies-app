import { useTranslation } from 'react-i18next';

export function useNumberLocale(): string {
  const { i18n } = useTranslation();
  return i18n.language === 'sv' ? 'sv-SE' : 'en-GB';
}

export function formatAmount(amount: number, locale: string): string {
  return Math.abs(amount).toLocaleString(locale);
}
