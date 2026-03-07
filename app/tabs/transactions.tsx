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
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';

const FILTER_CATEGORIES: (Category | 'all')[] = [
  'all', 'mat', 'transport', 'noje', 'halsa', 'shopping', 'prenumerationer',
];

export default function Transactions() {
  const { t, i18n } = useTranslation();
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all');

  const locale = i18n.language === 'en' ? 'en-SE' : 'sv-SE';

  const confirm = (id: string) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, confirmed: true } : tx)));
  };

  const spending = transactions.filter((tx) =>
    tx.amount < 0 && (activeFilter === 'all' || tx.category === activeFilter)
  );

  // Group by date
  const grouped: { date: string; items: Transaction[] }[] = [];
  spending.forEach((tx) => {
    const dateKey = new Date(tx.date).toLocaleDateString(locale, {
      weekday: 'long', day: 'numeric', month: 'long',
    });
    const existing = grouped.find((g) => g.date === dateKey);
    if (existing) existing.items.push(tx);
    else grouped.push({ date: dateKey, items: [tx] });
  });

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('transactions.title')}</Text>
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
        renderItem={({ item: group }) => (
          <View style={styles.group}>
            <Text style={styles.groupDate}>{group.date}</Text>
            {group.items.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} onConfirm={() => confirm(tx.id)} />
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function TransactionRow({
  transaction: tx,
  onConfirm,
}: {
  transaction: Transaction;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  const catColor = CATEGORY_COLORS[tx.category] ?? Colors.subtle;

  return (
    <View style={[styles.txRow, tx.confirmed && styles.txRowConfirmed]}>
      <View style={[styles.txAvatar, { backgroundColor: catColor + '20' }]}>
        <Text style={[styles.txAvatarText, { color: catColor }]}>
          {tx.merchant[0].toUpperCase()}
        </Text>
      </View>

      <View style={styles.txInfo}>
        <Text style={styles.txMerchant}>{tx.merchant}</Text>
        <View style={styles.catPill}>
          <View style={[styles.catDot, { backgroundColor: catColor }]} />
          <Text style={[styles.catLabel, { color: catColor }]}>
            {getCategoryLabel(tx.category, t)}
          </Text>
        </View>
      </View>

      <View style={styles.txRight}>
        <Text style={styles.txAmount}>
          -{Math.abs(tx.amount).toLocaleString('sv-SE')} kr
        </Text>
        {!tx.confirmed ? (
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={onConfirm}
            activeOpacity={0.75}
          >
            <Text style={styles.confirmText}>✓</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.confirmedText}>✓</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.display,
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -0.5,
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
  groupDate: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.muted,
    marginBottom: Spacing.sm,
    textTransform: 'capitalize',
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
  txRowConfirmed: {
    opacity: 0.5,
  },
  txAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txAvatarText: {
    fontFamily: Typography.bold,
    fontSize: 17,
  },
  txInfo: { flex: 1 },
  txMerchant: {
    fontFamily: Typography.medium,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 5,
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
  },
  catLabel: {
    fontFamily: Typography.regular,
    fontSize: 12,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  txAmount: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.text,
  },
  confirmBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.positiveSoft,
    borderWidth: 1,
    borderColor: Colors.positive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 13,
    color: Colors.positive,
  },
  confirmedText: {
    fontSize: 13,
    color: Colors.subtle,
  },
});
