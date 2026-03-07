import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import {
  MOCK_TRANSACTIONS, MOCK_BUDGETS, CATEGORY_COLORS,
  getMonthSpendingByCategory, getBudgetProgress,
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import WidgetShell from './WidgetShell';

const CATEGORIES = ['mat', 'transport', 'noje', 'halsa', 'shopping', 'prenumerationer'] as const;

export default function BudgetOverviewWidget() {
  const { t } = useTranslation();
  const { budgets } = useApp();
  const byCategory = getMonthSpendingByCategory(MOCK_TRANSACTIONS);
  const effectiveBudgets = Object.keys(budgets).length > 0 ? budgets : MOCK_BUDGETS;

  return (
    <WidgetShell
      title={t('widgets.budget')}
      actionLabel={t('home.manage')}
      onAction={() => router.push('/tabs/budget')}
      noPadding
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pills}
      >
        {CATEGORIES.map((cat) => {
          const budget = effectiveBudgets[cat] ?? 0;
          const spent = byCategory[cat] ?? 0;
          const { pct, color } = getBudgetProgress(spent, budget);
          const dotColor = CATEGORY_COLORS[cat];

          return (
            <View key={cat} style={styles.pill}>
              <View style={styles.pillTop}>
                <View style={[styles.dot, { backgroundColor: dotColor }]} />
                <Text style={styles.pillLabel} numberOfLines={1}>
                  {t(`categories.${cat}`)}
                </Text>
              </View>
              <Text style={[styles.pillAmount, { color }]}>
                {spent.toLocaleString('sv-SE')}
              </Text>
              <Text style={styles.pillBudget}>/ {budget.toLocaleString('sv-SE')} kr</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: `${pct}%`, backgroundColor: color }]} />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </WidgetShell>
  );
}

const styles = StyleSheet.create({
  pills: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.xs,
  },
  pill: {
    width: 100,
    backgroundColor: Colors.bg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm + 2,
    gap: 3,
  },
  pillTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  pillLabel: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    color: Colors.muted,
    flex: 1,
  },
  pillAmount: {
    fontFamily: Typography.bold,
    fontSize: 16,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  pillBudget: {
    fontFamily: Typography.regular,
    fontSize: 10,
    color: Colors.subtle,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.surface2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
  },
});
