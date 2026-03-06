import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import {
  MOCK_TRANSACTIONS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  Transaction,
} from '@/constants/mockData';

export default function Transactions() {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  const confirm = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, confirmed: true } : t))
    );
  };

  // Group by date
  const grouped: { date: string; items: Transaction[] }[] = [];
  transactions
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      const dateKey = new Date(t.date).toLocaleDateString('sv-SE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      const existing = grouped.find((g) => g.date === dateKey);
      if (existing) {
        existing.items.push(t);
      } else {
        grouped.push({ date: dateKey, items: [t] });
      }
    });

  const unconfirmed = transactions.filter(
    (t) => !t.confirmed && t.amount < 0
  ).length;

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transaktioner</Text>
        {unconfirmed > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unconfirmed} att granska</Text>
          </View>
        )}
      </View>

      {/* Swipe hint */}
      {unconfirmed > 0 && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Tryck på ✓ för att bekräfta ett köp
          </Text>
        </View>
      )}

      <FlatList
        data={grouped}
        keyExtractor={(item) => item.date}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item: group }) => (
          <View style={styles.group}>
            <Text style={styles.groupDate}>{group.date}</Text>
            {group.items.map((t) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                onConfirm={() => confirm(t.id)}
              />
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function TransactionRow({
  transaction: t,
  onConfirm,
}: {
  transaction: Transaction;
  onConfirm: () => void;
}) {
  const catColor = CATEGORY_COLORS[t.category];

  return (
    <View style={[styles.txRow, t.confirmed && styles.txRowConfirmed]}>
      {/* Icon */}
      <View style={[styles.txIcon, { borderColor: catColor + '40' }]}>
        <Text style={styles.txEmoji}>{t.emoji}</Text>
      </View>

      {/* Info */}
      <View style={styles.txInfo}>
        <Text style={styles.txMerchant}>{t.merchant}</Text>
        <View style={styles.txMeta}>
          <View style={[styles.catPill, { backgroundColor: catColor + '20' }]}>
            <View style={[styles.catDot, { backgroundColor: catColor }]} />
            <Text style={[styles.catLabel, { color: catColor }]}>
              {CATEGORY_LABELS[t.category]}
            </Text>
          </View>
        </View>
      </View>

      {/* Amount + confirm */}
      <View style={styles.txRight}>
        <Text style={styles.txAmount}>
          -{Math.abs(t.amount).toLocaleString('sv-SE')} kr
        </Text>
        {!t.confirmed ? (
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
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontFamily: Typography.display,
    fontSize: 28,
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.goldDim,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.gold + '40',
  },
  badgeText: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.gold,
  },
  hint: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hintText: {
    fontFamily: Typography.light,
    fontSize: 13,
    color: Colors.muted,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  group: {
    marginBottom: Spacing.xl,
  },
  groupDate: {
    fontFamily: Typography.medium,
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
    opacity: 0.6,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  txEmoji: {
    fontSize: 20,
  },
  txInfo: {
    flex: 1,
  },
  txMerchant: {
    fontFamily: Typography.medium,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 6,
  },
  txMeta: {
    flexDirection: 'row',
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  catDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  catLabel: {
    fontFamily: Typography.regular,
    fontSize: 11,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  txAmount: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
  },
  confirmBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.greenDim,
    borderWidth: 1,
    borderColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 13,
    color: Colors.green,
  },
  confirmedText: {
    fontSize: 13,
    color: Colors.subtle,
  },
});
