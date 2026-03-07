import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import {
  MOCK_TRANSACTIONS, MOCK_USER, CATEGORY_COLORS,
  getMonthSpendingByCategory, getBalanceUntilPayday, getDaysUntilPayday,
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import RingChart from '@/components/charts/RingChart';
import WidgetShell from './WidgetShell';

const DISCRETIONARY = ['mat', 'transport', 'noje', 'shopping', 'prenumerationer', 'halsa'] as const;

export default function MonthHealthWidget() {
  const { t } = useTranslation();
  const { payday, budgets } = useApp();

  const effectivePayday = payday ?? MOCK_USER.payday;
  const byCategory = getMonthSpendingByCategory(MOCK_TRANSACTIONS);
  const balance = getBalanceUntilPayday(MOCK_TRANSACTIONS, MOCK_USER.monthlyIncome);
  const daysUntil = getDaysUntilPayday(effectivePayday);

  const totalSpent = DISCRETIONARY.reduce((sum, cat) => sum + (byCategory[cat] ?? 0), 0);
  const totalBudget = DISCRETIONARY.reduce((sum, cat) => sum + (budgets[cat] ?? 0), 0);
  const budgetUsedPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : null;

  const healthState =
    budgetUsedPct == null ? 'no_budget'
    : budgetUsedPct >= 100 ? 'over'
    : budgetUsedPct >= 70  ? 'tight'
    : 'ok';

  const bgColor =
    healthState === 'over'       ? Colors.dangerSoft
    : healthState === 'tight'   ? Colors.warningSoft
    : healthState === 'no_budget' ? Colors.surface
    : Colors.positiveSoft;

  const accentColor =
    healthState === 'over'    ? Colors.danger
    : healthState === 'tight' ? Colors.warning
    : Colors.positive;

  const healthTitle =
    healthState === 'over'    ? t('insights.health_over')
    : healthState === 'tight' ? t('insights.health_watch_out')
    : t('insights.health_on_track');

  const ringSegments = budgetUsedPct != null
    ? [
        { value: Math.min(budgetUsedPct, 100), color: accentColor },
        { value: Math.max(100 - budgetUsedPct, 0), color: accentColor + '30' },
      ]
    : DISCRETIONARY
        .filter((cat) => (byCategory[cat] ?? 0) > 0)
        .map((cat) => ({ value: byCategory[cat] ?? 0, color: CATEGORY_COLORS[cat] }));

  const topCategories = DISCRETIONARY
    .map((cat) => ({ cat, spent: byCategory[cat] ?? 0 }))
    .filter((r) => r.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  const maxSpent = topCategories[0]?.spent ?? 1;

  return (
    <WidgetShell
      title={t('widgets.month_health')}
      actionLabel={t('home.see_details')}
      onAction={() => router.push('/tabs/insights')}
      bgColor={bgColor}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={[styles.state, { color: accentColor }]}>{healthTitle}</Text>
          <Text style={styles.balance}>{balance.toLocaleString('sv-SE')} kr</Text>
          <Text style={styles.sub}>
            {daysUntil} {t('insights.days_left')}
          </Text>
        </View>
        <RingChart
          segments={ringSegments.length > 0 ? ringSegments : [{ value: 1, color: Colors.surface2 }]}
          size={72}
          strokeWidth={8}
          centerLabel={budgetUsedPct != null ? `${Math.round(budgetUsedPct)}%` : '?'}
          centerColor={accentColor}
          trackColor="transparent"
        />
      </View>

      {topCategories.length > 0 && (
        <View style={styles.bars}>
          {topCategories.map((r) => {
            const pct = Math.round((r.spent / maxSpent) * 100);
            return (
              <View key={r.cat} style={styles.barRow}>
                <View style={[styles.dot, { backgroundColor: CATEGORY_COLORS[r.cat] }]} />
                <Text style={styles.barLabel}>{t(`categories.${r.cat}`)}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: CATEGORY_COLORS[r.cat] }]} />
                </View>
                <Text style={styles.barAmount}>{r.spent.toLocaleString('sv-SE')}</Text>
              </View>
            );
          })}
        </View>
      )}
    </WidgetShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flex: 1, gap: 4 },
  state: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  balance: {
    fontFamily: Typography.display,
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -1,
    lineHeight: 32,
  },
  sub: {
    fontFamily: Typography.regular,
    fontSize: 12,
    color: Colors.muted,
  },
  bars: { gap: 8 },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  barLabel: {
    fontFamily: Typography.regular,
    fontSize: 12,
    color: Colors.muted,
    width: 48,
  },
  barTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.surface2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  barAmount: {
    fontFamily: Typography.medium,
    fontSize: 11,
    color: Colors.muted,
    width: 44,
    textAlign: 'right',
  },
});
