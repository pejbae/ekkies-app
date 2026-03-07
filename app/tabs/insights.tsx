import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import {
  MOCK_TRANSACTIONS,
  MOCK_USER,
  CATEGORY_COLORS,
  getCategoryLabel,
  getMonthSpendingByCategory,
  getDaysUntilPayday,
  getBalanceUntilPayday,
  getRoundUpSavings,
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import RingChart from '@/components/charts/RingChart';
import CategoryBar from '@/components/charts/CategoryBar';

const DISCRETIONARY = ['mat', 'transport', 'noje', 'shopping', 'prenumerationer', 'halsa'] as const;

export default function Insights() {
  const { t } = useTranslation();
  const { payday, budgets } = useApp();

  const effectivePayday = payday ?? MOCK_USER.payday;
  const byCategory = getMonthSpendingByCategory(MOCK_TRANSACTIONS);
  const balance = getBalanceUntilPayday(MOCK_TRANSACTIONS, MOCK_USER.monthlyIncome);
  const daysUntil = getDaysUntilPayday(effectivePayday);

  const hasBudgets = Object.keys(budgets).length > 0;

  // Discretionary spending sorted descending
  const discretionaryRows = DISCRETIONARY
    .map((cat) => ({ cat, spent: byCategory[cat] ?? 0 }))
    .filter((r) => r.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  const totalDiscretionary = discretionaryRows.reduce((sum, r) => sum + r.spent, 0);
  const totalBudget = DISCRETIONARY.reduce((sum, cat) => sum + (budgets[cat] ?? 0), 0);
  const budgetUsedPct = totalBudget > 0 ? (totalDiscretionary / totalBudget) * 100 : null;

  // Health state
  const healthState =
    budgetUsedPct == null ? 'no_budget'
    : budgetUsedPct >= 100 ? 'over'
    : budgetUsedPct >= 70  ? 'tight'
    : 'ok';

  const healthBgColor =
    healthState === 'over'      ? Colors.dangerSoft
    : healthState === 'tight'   ? Colors.warningSoft
    : healthState === 'no_budget' ? Colors.surface
    : Colors.positiveSoft;

  const healthTitleColor =
    healthState === 'over'    ? Colors.danger
    : healthState === 'tight' ? Colors.warning
    : Colors.positive;

  const healthTitle =
    healthState === 'over'    ? t('insights.health_over')
    : healthState === 'tight' ? t('insights.health_watch_out')
    : healthState === 'no_budget' ? t('insights.health_on_track')
    : t('insights.health_on_track');

  const healthDetail =
    healthState === 'tight'
      ? t('insights.health_detail_tight', { amount: balance.toLocaleString('sv-SE'), days: daysUntil })
    : healthState === 'no_budget'
      ? t('insights.health_no_budget', { amount: balance.toLocaleString('sv-SE') })
    : t('insights.health_detail_ok', { amount: balance.toLocaleString('sv-SE'), days: daysUntil });

  // Ring chart segments
  const ringSegments = discretionaryRows.map((r) => ({
    value: r.spent,
    color: CATEGORY_COLORS[r.cat as keyof typeof CATEGORY_COLORS] ?? Colors.accent,
  }));

  // Subscriptions
  const subscriptions = MOCK_TRANSACTIONS.filter(
    (tx) => tx.category === 'prenumerationer' && tx.amount < 0
  );
  const subscriptionTotal = subscriptions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  // Opportunity
  const underBudgetAmount = hasBudgets && totalBudget > totalDiscretionary
    ? totalBudget - totalDiscretionary
    : 0;

  const maxCategorySpent = discretionaryRows[0]?.spent ?? 1;

  // Sparrunda round-up savings (this month = 30 days)
  const monthlyRoundup = Math.round(getRoundUpSavings(MOCK_TRANSACTIONS, 30));
  const yearlyRoundup = Math.round(monthlyRoundup * 12);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>{t('insights.title')}</Text>
          <Text style={styles.subtitle}>{t('insights.subtitle')}</Text>
        </View>

        <View style={styles.cards}>

          {/* ── 1. Month Health Card ── */}
          <View style={[styles.card, { backgroundColor: healthBgColor }, Shadow.card]}>
            <View style={styles.healthRow}>
              <View style={styles.healthText}>
                <Text style={[styles.healthTitle, { color: healthTitleColor }]}>
                  {healthTitle}
                </Text>
                <Text style={styles.healthBalance}>
                  {balance.toLocaleString('sv-SE')} kr
                </Text>
                <Text style={styles.cardBody}>{healthDetail}</Text>
              </View>
              {budgetUsedPct != null ? (
                <RingChart
                  segments={[
                    { value: Math.min(budgetUsedPct, 100), color: healthTitleColor },
                    { value: Math.max(100 - budgetUsedPct, 0), color: healthTitleColor + '30' },
                  ]}
                  size={72}
                  strokeWidth={8}
                  centerLabel={`${Math.round(budgetUsedPct)}%`}
                  centerColor={healthTitleColor}
                  trackColor="transparent"
                />
              ) : (
                <RingChart
                  segments={ringSegments.length > 0 ? ringSegments : [{ value: 1, color: Colors.surface2 }]}
                  size={72}
                  strokeWidth={8}
                />
              )}
            </View>
          </View>

          {/* ── 2. Where Your Money Went ── */}
          {discretionaryRows.length > 0 && (
            <View style={[styles.card, Shadow.card]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('insights.spending_title')}</Text>
                <Text style={styles.sectionSub}>
                  {t('insights.spending_total', { amount: totalDiscretionary.toLocaleString('sv-SE') })}
                </Text>
              </View>
              <View style={styles.bars}>
                {discretionaryRows.map((r) => (
                  <CategoryBar
                    key={r.cat}
                    label={getCategoryLabel(r.cat, t)}
                    amount={r.spent}
                    max={maxCategorySpent}
                    color={CATEGORY_COLORS[r.cat as keyof typeof CATEGORY_COLORS] ?? Colors.accent}
                  />
                ))}
              </View>
            </View>
          )}

          {/* ── 3. Recurring Costs ── */}
          <View style={[styles.card, Shadow.card]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('insights.subscriptions_title')}</Text>
              {subscriptionTotal > 0 && (
                <Text style={styles.sectionStat}>
                  {t('insights.subscriptions_total', { amount: subscriptionTotal.toLocaleString('sv-SE') })}
                </Text>
              )}
            </View>
            {subscriptions.length === 0 ? (
              <Text style={styles.cardBody}>{t('insights.subscriptions_empty')}</Text>
            ) : (
              <View style={styles.subList}>
                {subscriptions.map((sub) => (
                  <View key={sub.id} style={styles.subRow}>
                    <Text style={styles.subName} numberOfLines={1} ellipsizeMode="tail">
                      {sub.merchant}
                    </Text>
                    <Text style={styles.subAmount}>
                      {Math.abs(sub.amount).toLocaleString('sv-SE')} kr
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* ── 4. Opportunity / No-Budget Nudge ── */}
          {!hasBudgets ? (
            <View style={[styles.card, styles.cardNudge, Shadow.card]}>
              <Text style={styles.nudgeTitle}>{t('insights.no_budgets_title')}</Text>
              <Text style={styles.cardBody}>{t('insights.no_budgets_detail')}</Text>
              <TouchableOpacity
                style={styles.nudgeBtn}
                onPress={() => router.push('/tabs/budget')}
                activeOpacity={0.85}
              >
                <Text style={styles.nudgeBtnText}>{t('insights.no_budgets_cta')}</Text>
              </TouchableOpacity>
            </View>
          ) : underBudgetAmount > 0 ? (
            <View style={[styles.card, styles.cardOpportunity, Shadow.card]}>
              <Text style={styles.sectionTitle}>{t('insights.opportunity_title')}</Text>
              <Text style={styles.cardBody}>
                {t('insights.opportunity_detail', { amount: underBudgetAmount.toLocaleString('sv-SE') })}
              </Text>
            </View>
          ) : null}

          {/* ── 5. Sparrunda Round-Up Card ── */}
          {monthlyRoundup > 0 && (
            <View style={[styles.card, styles.cardRoundup, Shadow.card]}>
              <View style={styles.roundupHeader}>
                <Text style={styles.roundupBadge}>✦</Text>
                <Text style={styles.sectionTitle}>{t('insights.roundup_title')}</Text>
              </View>
              <Text style={styles.cardBody}>
                {t('insights.roundup_detail', {
                  amount: monthlyRoundup.toLocaleString('sv-SE'),
                  monthly: yearlyRoundup.toLocaleString('sv-SE'),
                })}
              </Text>
              <Text style={[styles.cardBody, { color: Colors.positive, fontFamily: Typography.medium }]}>
                {t('insights.roundup_coming')}
              </Text>
            </View>
          )}

        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontFamily: Typography.display,
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.muted,
  },
  cards: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  cardBody: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.muted,
    lineHeight: 20,
  },

  // Health card
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  healthText: { flex: 1, gap: 4 },
  healthTitle: {
    fontFamily: Typography.semibold,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  healthBalance: {
    fontFamily: Typography.display,
    fontSize: 32,
    color: Colors.text,
    letterSpacing: -1,
    lineHeight: 36,
  },

  // Section headers
  sectionHeader: { gap: 2 },
  sectionTitle: {
    fontFamily: Typography.semibold,
    fontSize: 15,
    color: Colors.text,
  },
  sectionSub: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
  },
  sectionStat: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.muted,
  },

  // Category bars
  bars: { gap: Spacing.md },

  // Subscriptions
  subList: { gap: 10 },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subName: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  subAmount: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.text,
  },

  // Nudge card
  cardNudge: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent + '30',
  },
  nudgeTitle: {
    fontFamily: Typography.semibold,
    fontSize: 15,
    color: Colors.text,
  },
  nudgeBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  nudgeBtnText: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.white,
  },

  // Opportunity card
  cardOpportunity: {
    backgroundColor: Colors.positiveSoft,
    borderColor: Colors.positive + '30',
  },

  // Sparrunda round-up card
  cardRoundup: {
    backgroundColor: Colors.positiveSoft,
    borderColor: Colors.positive + '30',
  },
  roundupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  roundupBadge: {
    fontSize: 16,
    color: Colors.positive,
  },
});
