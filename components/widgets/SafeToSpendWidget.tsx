import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import {
  MOCK_TRANSACTIONS, MOCK_USER,
  getTodaySpending, getDaysUntilPayday, getBalanceUntilPayday,
  getMonthSpendingByCategory, getSafeToSpendToday,
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import RingChart from '@/components/charts/RingChart';

const DISCRETIONARY = ['mat', 'transport', 'noje', 'halsa', 'shopping', 'prenumerationer'] as const;

export default function SafeToSpendWidget() {
  const { t } = useTranslation();
  const { payday, budgets } = useApp();

  const effectivePayday = payday ?? MOCK_USER.payday;
  const todaySpending = getTodaySpending(MOCK_TRANSACTIONS);
  const todayCount = MOCK_TRANSACTIONS.filter(
    (tx) => tx.amount < 0 && new Date(tx.date).toDateString() === new Date().toDateString()
  ).length;
  const daysUntil = getDaysUntilPayday(effectivePayday);
  const balance = getBalanceUntilPayday(MOCK_TRANSACTIONS, MOCK_USER.monthlyIncome);
  const byCategory = getMonthSpendingByCategory(MOCK_TRANSACTIONS);
  const safeToSpend = getSafeToSpendToday(MOCK_TRANSACTIONS, budgets, effectivePayday);
  const hasBudgets = Object.keys(budgets).length > 0;

  const safeColor =
    safeToSpend <= 0 ? Colors.danger
    : safeToSpend < 100 ? Colors.warning
    : Colors.positive;

  const totalBudget = DISCRETIONARY.reduce((sum, cat) => sum + (budgets[cat] ?? 0), 0);
  const totalSpent = DISCRETIONARY.reduce((sum, cat) => sum + (byCategory[cat] ?? 0), 0);
  const budgetPct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : null;
  const ringColor =
    budgetPct == null ? Colors.subtle
    : budgetPct >= 90 ? Colors.danger
    : budgetPct >= 70 ? Colors.warning
    : Colors.positive;

  const ringSegments = budgetPct != null
    ? [
        { value: budgetPct, color: ringColor },
        { value: Math.max(100 - budgetPct, 0), color: ringColor + '30' },
      ]
    : [{ value: 1, color: Colors.surface2 }];

  return (
    <View style={[styles.card, Shadow.card]}>
      <View style={styles.heroTop}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroLabel}>{t('home.safe_to_spend_label')}</Text>
          <Text style={[styles.heroAmount, { color: safeColor }]}>
            {safeToSpend.toLocaleString('sv-SE')} kr
          </Text>
          <Text style={styles.heroSub}>
            {t('home.safe_to_spend_sub', { amount: balance.toLocaleString('sv-SE') })}
          </Text>
          <Text style={styles.heroDays}>
            {t(`home.days_remaining_${daysUntil === 1 ? 'one' : 'other'}`, { count: daysUntil })}
            {' · '}
            {t('home.payday_label', { day: effectivePayday })}
          </Text>
        </View>
        {hasBudgets && (
          <View style={styles.heroRight}>
            <RingChart
              segments={ringSegments}
              size={80}
              strokeWidth={9}
              centerLabel={budgetPct != null ? `${Math.round(budgetPct)}%` : '—'}
              centerColor={ringColor}
              trackColor="transparent"
            />
            <Text style={styles.ringLabel}>
              {t('home.budget_used', { pct: Math.round(budgetPct ?? 0) })}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.todayStrip}
        onPress={() => router.push('/tabs/transactions')}
        activeOpacity={0.8}
      >
        <View style={styles.todayDot} />
        <Text style={styles.todayText}>
          {t('home.today_strip', {
            amount: todaySpending.toLocaleString('sv-SE'),
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  heroLeft: { flex: 1, gap: 4 },
  heroRight: { alignItems: 'center', gap: 4, flexShrink: 0 },
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
  heroDays: {
    fontFamily: Typography.regular,
    fontSize: 12,
    color: Colors.subtle,
    marginTop: 2,
  },
  ringLabel: {
    fontFamily: Typography.regular,
    fontSize: 10,
    textAlign: 'center',
    maxWidth: 80,
    color: Colors.muted,
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
