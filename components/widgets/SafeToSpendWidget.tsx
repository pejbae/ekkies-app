import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import {
  getMockData,
  getTodaySpending, getDaysUntilPayday, getBalanceUntilPayday,
  getSafeToSpendToday,
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { useNumberLocale } from '@/utils/locale';

export default function SafeToSpendWidget() {
  const { t } = useTranslation();
  const { payday, budgets, activeAccount } = useApp();
  const locale = useNumberLocale();

  const { user, transactions } = getMockData(activeAccount);
  const effectivePayday = payday ?? user.payday;

  const todaySpending = getTodaySpending(transactions);
  const todayCount = transactions.filter(
    (tx) => tx.amount < 0 && new Date(tx.date).toDateString() === new Date().toDateString()
  ).length;
  const balance = getBalanceUntilPayday(transactions, user.monthlyIncome);
  const safeToSpend = getSafeToSpendToday(transactions, budgets, effectivePayday);

  const safeColor =
    safeToSpend <= 0 ? Colors.danger
    : safeToSpend < 100 ? Colors.warning
    : Colors.positive;

  return (
    <View style={[styles.card, Shadow.card]}>
      <View style={styles.heroTop}>
        <Text style={styles.heroLabel}>{t('home.safe_to_spend_label')}</Text>
        <Text style={[styles.heroAmount, { color: safeColor }]}>
          {safeToSpend.toLocaleString(locale)} kr
        </Text>
        <Text style={styles.heroSub}>
          {t('home.safe_to_spend_sub', { amount: balance.toLocaleString(locale) })}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.todayStrip}
        onPress={() => router.push('/tabs/transactions')}
        activeOpacity={0.8}
      >
        <View style={styles.todayDot} />
        <Text style={styles.todayText}>
          {t('home.today_strip', {
            amount: todaySpending.toLocaleString(locale),
            count: todayCount,
          })}
        </Text>
        <Text style={styles.todayChevron}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  heroTop: {
    padding: Spacing.xl,
    gap: 4,
  },
  heroLabel: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.muted,
  },
  heroAmount: {
    fontFamily: Typography.display,
    fontSize: 52,
    lineHeight: 58,
    letterSpacing: -2.5,
  },
  heroSub: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
    marginTop: 2,
  },
  todayStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface2 + '60',
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  todayText: {
    flex: 1,
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.muted,
  },
  todayChevron: {
    fontFamily: Typography.bold,
    fontSize: 18,
    color: Colors.subtle,
  },
});
