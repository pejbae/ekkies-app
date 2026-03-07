import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import {
  getMockData, CATEGORY_COLORS, Category,
  getMonthSpendingByCategory,
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import WidgetShell from './WidgetShell';
import { useNumberLocale } from '@/utils/locale';

const CATEGORIES: Category[] = ['mat', 'transport', 'noje', 'halsa', 'shopping', 'prenumerationer'];

export default function MonthHealthWidget() {
  const { t } = useTranslation();
  const { budgets, activeAccount } = useApp();
  const locale = useNumberLocale();

  const { transactions } = getMockData(activeAccount);
  const byCategory = getMonthSpendingByCategory(transactions);

  const totalSpent = CATEGORIES.reduce((sum, cat) => sum + (byCategory[cat] ?? 0), 0);
  const totalBudget = CATEGORIES.reduce((sum, cat) => sum + (budgets[cat] ?? 0), 0);

  // For bar widths: if budgets set use spent/budget; else scale relative to max
  const maxSpent = Math.max(...CATEGORIES.map((c) => byCategory[c] ?? 0), 1);
  const hasBudgets = totalBudget > 0;

  return (
    <WidgetShell
      title={t('widgets.spending')}
      actionLabel={t('home.see_details')}
      onAction={() => router.push('/tabs/insights')}
    >
      <View style={styles.rows}>
        {CATEGORIES.map((cat) => {
          const spent = byCategory[cat] ?? 0;
          const budget = budgets[cat] ?? 0;
          const isOver = hasBudgets && budget > 0 && spent > budget;

          let barPct: number;
          if (hasBudgets && budget > 0) {
            barPct = Math.min((spent / budget) * 100, 100);
          } else {
            barPct = (spent / maxSpent) * 100;
          }

          const barColor = isOver ? Colors.danger : CATEGORY_COLORS[cat];

          return (
            <View key={cat} style={styles.catRow}>
              <View style={[styles.dot, { backgroundColor: CATEGORY_COLORS[cat] }]} />
              <Text style={styles.catLabel} numberOfLines={1}>
                {t(`categories.${cat}`)}
              </Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${barPct}%`, backgroundColor: barColor }]} />
              </View>
              <View style={styles.amountGroup}>
                <Text style={[styles.catSpent, isOver && styles.catSpentOver]}>
                  {spent.toLocaleString(locale)}
                </Text>
                {hasBudgets && budget > 0 && (
                  <Text style={styles.catBudget}>/{budget.toLocaleString(locale)}</Text>
                )}
              </View>
              {isOver && (
                <Text style={styles.overBadge}>{t('insights.over_label')}</Text>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{t('insights.spending_title')}</Text>
        <Text style={styles.totalAmount}>
          {totalSpent.toLocaleString(locale)}
          {hasBudgets ? ` / ${totalBudget.toLocaleString(locale)} kr` : ' kr'}
        </Text>
      </View>
    </WidgetShell>
  );
}

const styles = StyleSheet.create({
  rows: {
    gap: 10,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  catLabel: {
    fontFamily: Typography.regular,
    fontSize: 12,
    color: Colors.muted,
    width: 56,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surface2,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  amountGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    flexShrink: 0,
  },
  catSpent: {
    fontFamily: Typography.medium,
    fontSize: 11,
    color: Colors.text,
    textAlign: 'right',
  },
  catSpentOver: {
    color: Colors.danger,
  },
  catBudget: {
    fontFamily: Typography.regular,
    fontSize: 10,
    color: Colors.subtle,
  },
  overBadge: {
    fontFamily: Typography.bold,
    fontSize: 9,
    color: Colors.danger,
    letterSpacing: 0.3,
    flexShrink: 0,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  totalLabel: {
    fontFamily: Typography.semibold,
    fontSize: 12,
    color: Colors.muted,
  },
  totalAmount: {
    fontFamily: Typography.bold,
    fontSize: 13,
    color: Colors.text,
  },
});
