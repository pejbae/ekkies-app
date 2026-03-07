import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { MOCK_TRANSACTIONS, CATEGORY_COLORS } from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import WidgetShell from './WidgetShell';

export default function RecentTransactionsWidget() {
  const { t } = useTranslation();
  const recent = MOCK_TRANSACTIONS.slice(0, 3);

  return (
    <WidgetShell
      title={t('widgets.recent')}
      actionLabel={t('home.see_all')}
      onAction={() => router.push('/tabs/transactions')}
    >
      <View style={styles.list}>
        {recent.map((tx, i) => {
          const isIncome = tx.amount > 0;
          const dotColor = CATEGORY_COLORS[tx.category];
          return (
            <View key={tx.id} style={[styles.row, i < recent.length - 1 && styles.rowBorder]}>
              <View style={styles.rowLeft}>
                <Text style={styles.emoji}>{tx.emoji}</Text>
                <View style={styles.rowMeta}>
                  <Text style={styles.merchant} numberOfLines={1}>{tx.merchant}</Text>
                  <View style={styles.catRow}>
                    <View style={[styles.catDot, { backgroundColor: dotColor }]} />
                    <Text style={styles.category}>{t(`categories.${tx.category}`)}</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.amount, { color: isIncome ? Colors.positive : Colors.text }]}>
                {isIncome ? '+' : ''}{tx.amount.toLocaleString('sv-SE')} kr
              </Text>
            </View>
          );
        })}
      </View>
    </WidgetShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  emoji: {
    fontSize: 22,
    width: 36,
    textAlign: 'center',
  },
  rowMeta: { flex: 1, gap: 2 },
  merchant: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  catDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  category: {
    fontFamily: Typography.regular,
    fontSize: 12,
    color: Colors.muted,
  },
  amount: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    letterSpacing: -0.3,
    flexShrink: 0,
  },
});
