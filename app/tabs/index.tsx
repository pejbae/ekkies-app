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
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { payday } = useApp();

  const effectivePayday = payday ?? MOCK_USER.payday;
  const todaySpending = getTodaySpending(MOCK_TRANSACTIONS);
  const daysUntil = getDaysUntilPayday(effectivePayday);
  const balance = getBalanceUntilPayday(MOCK_TRANSACTIONS, MOCK_USER.monthlyIncome);
  const byCategory = getMonthSpendingByCategory(MOCK_TRANSACTIONS);

  // Top 3 categories by spend
  const topCategories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const maxCategorySpend = topCategories[0]?.[1] ?? 1;

  // Recent transactions (non-income)
  const recent = MOCK_TRANSACTIONS
    .filter((tx) => tx.amount < 0)
    .slice(0, 3);

  const locale = i18n.language === 'en' ? 'en-SE' : 'sv-SE';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t('home.greeting', { name: MOCK_USER.name })}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString(locale, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/tabs/settings')}>
            <Text style={styles.avatarText}>
              {MOCK_USER.name[0].toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* HERO: Kvar till lön */}
        <View style={styles.heroCard}>
          <View style={styles.glow} />

          <Text style={styles.heroLabel}>{t('home.hero_label')}</Text>
          <Text style={styles.heroAmount}>
            {balance.toLocaleString('sv-SE')} kr
          </Text>

          {/* Days bar */}
          <View style={styles.daysRow}>
            <Text style={styles.daysText}>
              {t('home.days_remaining', { count: daysUntil })}
            </Text>
            <Text style={styles.paydayText}>{t('home.payday_label', { day: effectivePayday })}</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(5, 100 - (daysUntil / 30) * 100)}%` },
              ]}
            />
          </View>
        </View>

        {/* Spenderat idag */}
        <View style={styles.todayCard}>
          <Text style={styles.todayLabel}>{t('home.today_label')}</Text>
          <Text style={styles.todayAmount}>
            {todaySpending.toLocaleString('sv-SE')} kr
          </Text>
        </View>

        {/* Weekly insight */}
        <View style={styles.insightCard}>
          <Text style={styles.insightEmoji}>✦</Text>
          <View style={styles.insightBody}>
            <Text style={styles.insightTitle}>{t('home.insight_title')}</Text>
            <Text style={styles.insightText}>{t('home.insight_text')}</Text>
          </View>
        </View>

        {/* Top categories */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('home.this_month')}</Text>
          {topCategories.map(([cat, amount]) => (
            <View key={cat} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <View
                  style={[
                    styles.categoryDot,
                    { backgroundColor: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] },
                  ]}
                />
                <Text style={styles.categoryName}>
                  {getCategoryLabel(cat, t)}
                </Text>
              </View>
              <View style={styles.categoryBarWrap}>
                <View style={styles.categoryBarBg}>
                  <View
                    style={[
                      styles.categoryBarFill,
                      {
                        width: `${(amount / maxCategorySpend) * 100}%`,
                        backgroundColor: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS],
                      },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.categoryAmount}>
                {amount.toLocaleString('sv-SE')} kr
              </Text>
            </View>
          ))}
        </View>

        {/* Recent transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{t('home.recent')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>{t('home.see_all')}</Text>
            </TouchableOpacity>
          </View>
          {recent.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={styles.txIcon}>
                <Text style={styles.txEmoji}>{tx.emoji}</Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txMerchant}>{tx.merchant}</Text>
                <Text style={styles.txCategory}>
                  {getCategoryLabel(tx.category, t)}
                </Text>
              </View>
              <Text style={styles.txAmount}>
                -{Math.abs(tx.amount).toLocaleString('sv-SE')} kr
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  greeting: {
    fontFamily: Typography.medium,
    fontSize: 18,
    color: Colors.text,
    marginBottom: 2,
  },
  date: {
    fontFamily: Typography.light,
    fontSize: 13,
    color: Colors.muted,
    textTransform: 'capitalize',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.greenDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.green,
  },
  avatarText: {
    fontFamily: Typography.medium,
    fontSize: 16,
    color: Colors.green,
  },

  // Hero card
  heroCard: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.card,
  },
  glow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.greenGlow,
  },
  heroLabel: {
    fontFamily: Typography.regular,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.green,
    marginBottom: Spacing.sm,
  },
  heroAmount: {
    fontFamily: Typography.display,
    fontSize: 44,
    color: Colors.text,
    letterSpacing: -1,
    marginBottom: Spacing.lg,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  daysText: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
  },
  paydayText: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.green,
    borderRadius: 2,
  },

  // Today card
  todayCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayLabel: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.muted,
  },
  todayAmount: {
    fontFamily: Typography.display,
    fontSize: 22,
    color: Colors.text,
  },

  // Insight card
  insightCard: {
    backgroundColor: Colors.greenGlow,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.greenDim,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  insightEmoji: {
    fontSize: 18,
    color: Colors.green,
  },
  insightBody: {
    flex: 1,
  },
  insightTitle: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.green,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  insightText: {
    fontFamily: Typography.light,
    fontSize: 14,
    color: Colors.muted,
    lineHeight: 20,
  },

  // Sections
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
    fontFamily: Typography.medium,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.muted,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.green,
  },

  // Category rows
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: 120,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryName: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
    flex: 1,
  },
  categoryBarWrap: {
    flex: 1,
  },
  categoryBarBg: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  categoryAmount: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.text,
    width: 80,
    textAlign: 'right',
  },

  // Transaction rows
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  txEmoji: {
    fontSize: 18,
  },
  txInfo: {
    flex: 1,
  },
  txMerchant: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  txCategory: {
    fontFamily: Typography.light,
    fontSize: 12,
    color: Colors.muted,
  },
  txAmount: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
  },
});
