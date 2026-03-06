import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/constants/theme';
import {
  MOCK_TRANSACTIONS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getMonthSpendingByCategory,
} from '@/constants/mockData';

export default function Categories() {
  const byCategory = getMonthSpendingByCategory(MOCK_TRANSACTIONS);
  const sorted = Object.entries(byCategory).sort(([, a], [, b]) => b - a);
  const total = sorted.reduce((sum, [, v]) => sum + v, 0);
  const max = sorted[0]?.[1] ?? 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kategorier</Text>
        <Text style={styles.subtitle}>Den här månaden</Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Totalt spenderat</Text>
        <Text style={styles.totalAmount}>
          {total.toLocaleString('sv-SE')} kr
        </Text>
      </View>

      <View style={styles.list}>
        {sorted.map(([cat, amount]) => {
          const color = CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS];
          const pct = Math.round((amount / total) * 100);
          return (
            <View key={cat} style={styles.catRow}>
              <View style={styles.catLeft}>
                <View style={[styles.catDot, { backgroundColor: color }]} />
                <View>
                  <Text style={styles.catName}>
                    {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
                  </Text>
                  <Text style={styles.catPct}>{pct}% av totalt</Text>
                </View>
              </View>
              <View style={styles.catRight}>
                <Text style={styles.catAmount}>
                  {amount.toLocaleString('sv-SE')} kr
                </Text>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${(amount / max) * 100}%`,
                        backgroundColor: color,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontFamily: Typography.display,
    fontSize: 28,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Typography.light,
    fontSize: 14,
    color: Colors.muted,
  },
  totalCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface2,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  totalLabel: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.muted,
  },
  totalAmount: {
    fontFamily: Typography.display,
    fontSize: 24,
    color: Colors.text,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    gap: 2,
  },
  catRow: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  catDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  catName: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  catPct: {
    fontFamily: Typography.light,
    fontSize: 12,
    color: Colors.muted,
  },
  catRight: {
    alignItems: 'flex-end',
    gap: 6,
    minWidth: 100,
  },
  catAmount: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
  },
  barBg: {
    width: 80,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
