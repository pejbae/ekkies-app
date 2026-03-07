import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import {
  MOCK_TRANSACTIONS,
  MOCK_USER,
  CATEGORY_COLORS,
  getCategoryLabel,
  getTodaySpending,
  getDaysUntilPayday,
  getBalanceUntilPayday,
  getMonthSpendingByCategory,
  getBudgetProgress,
  getRoundUpSavings,
  getSafeToSpendToday,
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import RingChart from '@/components/charts/RingChart';

const DISCRETIONARY = ['mat', 'transport', 'noje', 'halsa', 'shopping', 'prenumerationer'] as const;

export default function Home() {
  const { t } = useTranslation();
  const { payday, budgets } = useApp();
  const [roundupExpanded, setRoundupExpanded] = useState(false);

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

  const weeklyRoundup = getRoundUpSavings(MOCK_TRANSACTIONS, 7);
  const monthlyRoundup = Math.round(weeklyRoundup * 4.3);

  const budgetPills = Object.entries(budgets)
    .filter(([cat]) => cat !== 'lon' && cat !== 'hem')
    .map(([cat, budget]) => {
      const spent = byCategory[cat as keyof typeof byCategory] ?? 0;
      const { pct, color } = getBudgetProgress(spent, budget as number);
      return { cat, pct, color };
    })
    .sort((a, b) => b.pct - a.pct);

  const recent = MOCK_TRANSACTIONS.filter((tx) => tx.amount < 0).slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{t('home.greeting', { name: MOCK_USER.name })}</Text>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push('/tabs/profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{MOCK_USER.name[0].toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero: Safe to Spend */}
        <View style={[styles.heroCard, Shadow.card]}>
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

          {/* Today strip */}
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

        {/* Sparrunda round-up card */}
        {weeklyRoundup > 0 && (
          <View style={[styles.roundupCard, Shadow.card]}>
            <View style={styles.roundupHeader}>
              <View style={styles.roundupBadge}>
                <Text style={styles.roundupBadgeText}>✦</Text>
              </View>
              <View style={styles.roundupHeaderText}>
                <Text style={styles.roundupTitle}>{t('home.roundup_title')}</Text>
                <Text style={styles.roundupBody}>
                  {t('home.roundup_body', {
                    weekly: weeklyRoundup.toLocaleString('sv-SE'),
                    monthly: monthlyRoundup.toLocaleString('sv-SE'),
                  })}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setRoundupExpanded((v) => !v)}
              activeOpacity={0.8}
              style={styles.roundupCta}
            >
              <Text style={styles.roundupCtaText}>{t('home.roundup_cta')}</Text>
              <Text style={styles.roundupCtaChevron}>{roundupExpanded ? '↑' : '↓'}</Text>
            </TouchableOpacity>
            {roundupExpanded && (
              <Text style={styles.roundupExplanation}>{t('home.roundup_explanation')}</Text>
            )}
          </View>
        )}

        {/* Budget snapshot */}
        {budgetPills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{t('home.budget_section')}</Text>
              <TouchableOpacity onPress={() => router.push('/tabs/budget')} activeOpacity={0.7}>
                <Text style={styles.seeAll}>{t('home.see_all_budget')}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillScroll}>
              {budgetPills.map(({ cat, pct, color }) => (
                <View key={cat} style={[styles.budgetPill, { borderColor: color + '50' }]}>
                  <View style={styles.budgetPillBar}>
                    <View style={[styles.budgetPillFill, { width: `${pct}%`, backgroundColor: color }]} />
                  </View>
                  <Text style={styles.budgetPillLabel}>{getCategoryLabel(cat, t)}</Text>
                  <Text style={[styles.budgetPillPct, { color }]}>{Math.round(pct)}%</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recent transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{t('home.recent')}</Text>
            <TouchableOpacity onPress={() => router.push('/tabs/transactions')} activeOpacity={0.7}>
              <Text style={styles.seeAll}>{t('home.see_all')}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.txList, Shadow.card]}>
            {recent.map((tx, i) => {
              const catColor = CATEGORY_COLORS[tx.category] ?? Colors.subtle;
              return (
                <View key={tx.id} style={[styles.txRow, i < recent.length - 1 && styles.txRowBorder]}>
                  <View style={[styles.txAvatar, { backgroundColor: catColor + '20' }]}>
                    <Text style={[styles.txAvatarText, { color: catColor }]}>
                      {tx.merchant[0].toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txMerchant} numberOfLines={1} ellipsizeMode="tail">
                      {tx.merchant}
                    </Text>
                    <Text style={styles.txCategory}>{getCategoryLabel(tx.category, t)}</Text>
                  </View>
                  <Text style={styles.txAmount}>
                    -{Math.abs(tx.amount).toLocaleString('sv-SE')} kr
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  greeting: {
    fontFamily: Typography.bold,
    fontSize: 20,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.accent + '30',
  },
  avatarText: {
    fontFamily: Typography.bold,
    fontSize: 16,
    color: Colors.accent,
  },

  // Hero card
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
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
  heroLeft: {
    flex: 1,
    gap: 4,
  },
  heroRight: {
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
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

  // Today strip
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

  // Round-up card
  roundupCard: {
    backgroundColor: Colors.positiveSoft,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.positive + '30',
    gap: Spacing.md,
  },
  roundupHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  roundupBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.positive + '20',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roundupBadgeText: {
    fontSize: 16,
    color: Colors.positive,
  },
  roundupHeaderText: {
    flex: 1,
    gap: 4,
  },
  roundupTitle: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.text,
  },
  roundupBody: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 18,
  },
  roundupCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roundupCtaText: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.positive,
  },
  roundupCtaChevron: {
    fontFamily: Typography.bold,
    fontSize: 13,
    color: Colors.positive,
  },
  roundupExplanation: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 20,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.positive + '20',
  },

  // Budget pills
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.muted,
  },
  seeAll: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.accent,
  },
  pillScroll: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  budgetPill: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    width: 120,
    borderWidth: 1.5,
    gap: 6,
  },
  budgetPillBar: {
    height: 4,
    backgroundColor: Colors.surface2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  budgetPillFill: {
    height: '100%',
    borderRadius: 2,
  },
  budgetPillLabel: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.text,
  },
  budgetPillPct: {
    fontFamily: Typography.bold,
    fontSize: 16,
    letterSpacing: -0.3,
  },

  // Recent transactions
  txList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  txRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  txAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txAvatarText: {
    fontFamily: Typography.bold,
    fontSize: 16,
  },
  txInfo: { flex: 1, minWidth: 0 },
  txMerchant: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  txCategory: {
    fontFamily: Typography.regular,
    fontSize: 12,
    color: Colors.muted,
  },
  txAmount: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.text,
    flexShrink: 0,
  },
});
