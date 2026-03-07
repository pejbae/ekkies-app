import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import {
  MOCK_TRANSACTIONS,
  CATEGORY_COLORS,
  getCategoryLabel,
  Transaction,
  Category,
  getRoundUpSavings,
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';

const FILTER_CATEGORIES: (Category | 'all')[] = [
  'all', 'mat', 'transport', 'noje', 'halsa', 'shopping', 'prenumerationer',
];

export default function Transactions() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all');

  const locale = i18n.language === 'sv' ? 'sv-SE' : 'en-GB';

  const spending = MOCK_TRANSACTIONS.filter(
    (tx) => tx.amount < 0 && (activeFilter === 'all' || tx.category === activeFilter)
  );

  const monthlyTotal = spending.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  // Group by date, tracking daily total and raw date for round-up calc
  const grouped: { date: string; rawDate: string; items: Transaction[] }[] = [];
  spending.forEach((tx) => {
    const dateKey = new Date(tx.date).toLocaleDateString(locale, {
      weekday: 'long', day: 'numeric', month: 'long',
    });
    const rawDate = new Date(tx.date).toDateString();
    const existing = grouped.find((g) => g.date === dateKey);
    if (existing) existing.items.push(tx);
    else grouped.push({ date: dateKey, rawDate, items: [tx] });
  });

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('transactions.title')}</Text>
      </View>

      {/* Monthly summary strip */}
      <View style={styles.summaryStrip}>
        <Text style={styles.summaryText}>
          {t('transactions.monthly_summary', {
            count: spending.length,
            amount: monthlyTotal.toLocaleString('sv-SE'),
          })}
        </Text>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterBar}
      >
        {FILTER_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterPill, activeFilter === cat && styles.filterPillActive]}
            onPress={() => setActiveFilter(cat)}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterPillText, activeFilter === cat && styles.filterPillTextActive]}>
              {cat === 'all' ? t('transactions.filter_all') : getCategoryLabel(cat, t)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={grouped}
        keyExtractor={(item) => item.date}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>{t('transactions.no_transactions')}</Text>
        }
        renderItem={({ item: group }) => {
          const dailyTotal = group.items.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
          const dayTxs = MOCK_TRANSACTIONS.filter(
            (tx) => tx.amount < 0 && new Date(tx.date).toDateString() === group.rawDate
          );
          const dayRoundup = getRoundUpSavings(dayTxs, 999);
          return (
            <View style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupDate}>{group.date}</Text>
                <Text style={styles.groupTotal}>
                  -{t('transactions.daily_total', { amount: dailyTotal.toLocaleString('sv-SE') })}
                </Text>
              </View>
              {group.items.map((tx) => (
                <TransactionRow key={tx.id} transaction={tx} />
              ))}
              {dayRoundup > 0 && (
                <View style={styles.roundupPill}>
                  <Text style={styles.roundupPillText}>
                    {t('transactions.roundup_day', { amount: Math.round(dayRoundup).toLocaleString('sv-SE') })}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

function TransactionRow({ transaction: tx }: { transaction: Transaction }) {
  const { t } = useTranslation();
  const catColor = CATEGORY_COLORS[tx.category] ?? Colors.subtle;

  return (
    <View style={styles.txRow}>
      <View style={[styles.txAvatar, { backgroundColor: catColor + '20' }]}>
        <Text style={[styles.txAvatarText, { color: catColor }]}>
          {tx.merchant[0].toUpperCase()}
        </Text>
      </View>

      <View style={styles.txInfo}>
        <Text style={styles.txMerchant} numberOfLines={1} ellipsizeMode="tail">
          {tx.merchant}
        </Text>
        <View style={styles.catPill}>
          <View style={[styles.catDot, { backgroundColor: catColor }]} />
          <Text style={[styles.catLabel, { color: catColor }]} numberOfLines={1}>
            {getCategoryLabel(tx.category, t)}
          </Text>
        </View>
      </View>

      <Text style={styles.txAmount}>
        -{Math.abs(tx.amount).toLocaleString('sv-SE')} kr
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontFamily: Typography.display,
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  summaryStrip: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  summaryText: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.muted,
  },
  filterBar: {
    marginBottom: Spacing.md,
  },
  filterScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterPillText: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.muted,
  },
  filterPillTextActive: {
    color: Colors.white,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  empty: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    paddingTop: Spacing.xxl,
  },
  group: {
    marginBottom: Spacing.xl,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  groupDate: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.muted,
  },
  groupTotal: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.text,
  },
  roundupPill: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.positiveSoft,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.positive + '30',
  },
  roundupPillText: {
    fontFamily: Typography.medium,
    fontSize: 11,
    color: Colors.positive,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  txAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  txAvatarText: {
    fontFamily: Typography.bold,
    fontSize: 17,
  },
  txInfo: { flex: 1, minWidth: 0 },
  txMerchant: {
    fontFamily: Typography.medium,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 4,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  catDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    flexShrink: 0,
  },
  catLabel: {
    fontFamily: Typography.regular,
    fontSize: 12,
  },
  txAmount: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.text,
    flexShrink: 0,
  },
});
