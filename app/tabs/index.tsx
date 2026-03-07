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
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';

export default function Home() {
  const { t } = useTranslation();
  const { payday, budgets } = useApp();

  const effectivePayday = payday ?? MOCK_USER.payday;
  const todaySpending = getTodaySpending(MOCK_TRANSACTIONS);
  const daysUntil = getDaysUntilPayday(effectivePayday);
  const balance = getBalanceUntilPayday(MOCK_TRANSACTIONS, MOCK_USER.monthlyIncome);
  const byCategory = getMonthSpendingByCategory(MOCK_TRANSACTIONS);

  const budgetPills = Object.entries(budgets)
    .filter(([cat]) => cat !== 'lon' && cat !== 'hem')
    .map(([cat, budget]) => {
      const spent = byCategory[cat as keyof typeof byCategory] ?? 0;
      const { pct, color } = getBudgetProgress(spent, budget as number);
      return { cat, pct, color };
    })
    .sort((a, b) => b.pct - a.pct);

  const recent = MOCK_TRANSACTIONS.filter((tx) => tx.amount < 0).slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{t('home.greeting', { name: MOCK_USER.name })}</Text>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push('/tabs/settings')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{MOCK_USER.name[0].toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero card */}
        <View style={[styles.heroCard, Shadow.card]}>
          <Text style={styles.heroLabel}>{t('home.hero_label')}</Text>
          <Text style={styles.heroAmount}>
            {balance.toLocaleString('sv-SE')} kr
          </Text>
          <View style={styles.heroMeta}>
            <Text style={styles.heroMetaText}>
              {t(`home.days_remaining_${daysUntil === 1 ? 'one' : 'other'}`, { count: daysUntil })}
            </Text>
            <Text style={styles.heroMetaText}>
              {t('home.payday_label', { day: effectivePayday })}
            </Text>
          </View>
        </View>

        {/* Metric row */}
        <View style={styles.metricRow}>
          <View style={[styles.metricCard, Shadow.card]}>
            <Text style={styles.metricLabel}>{t('home.today_label')}</Text>
            <Text style={styles.metricValue}>
              {todaySpending.toLocaleString('sv-SE')} kr
            </Text>
          </View>
          <View style={[styles.metricCard, Shadow.card]}>
            <Text style={styles.metricLabel}>
              {t(`home.days_remaining_${daysUntil === 1 ? 'one' : 'other'}`, { count: daysUntil })}
            </Text>
            <Text style={[styles.metricValue, { fontSize: 28 }]}>{daysUntil}d</Text>
          </View>
        </View>

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
                    <Text style={styles.txMerchant}>{tx.merchant}</Text>
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
    paddingBottom: Spacing.lg,
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
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroLabel: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.muted,
    marginBottom: Spacing.sm,
  },
  heroAmount: {
    fontFamily: Typography.display,
    fontSize: 48,
    lineHeight: 54,
    color: Colors.text,
    letterSpacing: -2,
    marginBottom: Spacing.md,
  },
  heroMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroMetaText: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
  },
  metricRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricLabel: {
    fontFamily: Typography.regular,
    fontSize: 12,
    color: Colors.muted,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: Typography.bold,
    fontSize: 22,
    color: Colors.text,
    letterSpacing: -0.5,
  },
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
  txInfo: { flex: 1 },
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
  },
});
