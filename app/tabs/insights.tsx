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
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';

// Discretionary categories — we only show spend observations for these
const DISCRETIONARY = ['mat', 'transport', 'noje', 'shopping', 'prenumerationer', 'halsa'];

export default function Insights() {
  const { t } = useTranslation();
  const { payday, budgets } = useApp();

  const effectivePayday = payday ?? MOCK_USER.payday;
  const byCategory = getMonthSpendingByCategory(MOCK_TRANSACTIONS);
  const balance = getBalanceUntilPayday(MOCK_TRANSACTIONS, MOCK_USER.monthlyIncome);
  const daysUntil = getDaysUntilPayday(effectivePayday);

  const hasBudgets = Object.keys(budgets).length > 0;

  // Biggest discretionary category
  const discretionarySpend = Object.entries(byCategory)
    .filter(([cat]) => DISCRETIONARY.includes(cat))
    .sort(([, a], [, b]) => b - a);

  const biggestCat = discretionarySpend[0];
  const biggestColor = biggestCat
    ? (CATEGORY_COLORS[biggestCat[0] as keyof typeof CATEGORY_COLORS] ?? Colors.accent)
    : Colors.accent;

  // Subscription transactions this month
  const subscriptions = MOCK_TRANSACTIONS.filter((tx) => tx.category === 'prenumerationer' && tx.amount < 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>{t('insights.title')}</Text>
          <Text style={styles.subtitle}>{t('insights.subtitle')}</Text>
        </View>

        <View style={styles.cards}>

          {/* On track card */}
          <View style={[styles.card, Shadow.card]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{t('insights.on_track')}</Text>
            </View>
            <Text style={[styles.cardStat, { color: Colors.positive }]}>
              {balance.toLocaleString('sv-SE')} kr
            </Text>
            <Text style={styles.cardBody}>
              {t('insights.on_track_detail', { amount: balance.toLocaleString('sv-SE'), day: effectivePayday })}
            </Text>
          </View>

          {/* Biggest category */}
          {biggestCat && (
            <View style={[styles.card, Shadow.card]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {t('insights.biggest_category', { category: getCategoryLabel(biggestCat[0], t) })}
                </Text>
              </View>
              <Text style={[styles.cardStat, { color: biggestColor }]}>
                {t('insights.biggest_amount', { amount: biggestCat[1].toLocaleString('sv-SE') })}
              </Text>
              <Text style={styles.cardBody}>
                {getCategoryLabel(biggestCat[0], t)} — your biggest discretionary spend this month.
              </Text>
            </View>
          )}

          {/* Subscriptions */}
          {subscriptions.map((sub) => (
            <View key={sub.id} style={[styles.card, Shadow.card]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{sub.merchant}</Text>
              </View>
              <Text style={[styles.cardStat, { color: Colors.warning }]}>
                {Math.abs(sub.amount).toLocaleString('sv-SE')} kr
              </Text>
              <Text style={styles.cardBody}>
                {t('insights.subscription_fact', {
                  name: sub.merchant,
                  amount: Math.abs(sub.amount).toLocaleString('sv-SE'),
                })}
              </Text>
            </View>
          ))}

          {/* No budgets nudge */}
          {!hasBudgets && (
            <View style={[styles.card, styles.cardNudge, Shadow.card]}>
              <Text style={styles.cardTitle}>{t('insights.no_budgets_title')}</Text>
              <Text style={styles.cardBody}>{t('insights.no_budgets_detail')}</Text>
              <TouchableOpacity
                style={styles.nudgeBtn}
                onPress={() => router.push('/tabs/budget')}
                activeOpacity={0.85}
              >
                <Text style={styles.nudgeBtnText}>{t('insights.no_budgets_cta')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Savings seed */}
          <View style={[styles.card, styles.cardSeed, Shadow.card]}>
            <Text style={styles.cardTitle}>{t('insights.savings_seed_title')}</Text>
            <Text style={[styles.cardStat, { color: Colors.positive }]}>6,000 kr</Text>
            <Text style={styles.cardBody}>{t('insights.savings_seed_detail')}</Text>
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
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  cardNudge: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent + '30',
  },
  cardSeed: {
    backgroundColor: Colors.positiveSoft,
    borderColor: Colors.positive + '30',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.muted,
    letterSpacing: 0.2,
    flex: 1,
  },
  cardStat: {
    fontFamily: Typography.display,
    fontSize: 32,
    letterSpacing: -1,
    lineHeight: 36,
  },
  cardBody: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.muted,
    lineHeight: 22,
  },
  nudgeBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  nudgeBtnText: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.white,
  },
});
