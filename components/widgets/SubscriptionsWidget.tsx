import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { MOCK_TRANSACTIONS } from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import WidgetShell from './WidgetShell';

export default function SubscriptionsWidget() {
  const { t } = useTranslation();

  const subscriptions = MOCK_TRANSACTIONS.filter(
    (tx) => tx.category === 'prenumerationer' && tx.amount < 0
  );
  const total = subscriptions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  if (subscriptions.length === 0) return null;

  return (
    <WidgetShell
      title={t('widgets.subscriptions')}
      actionLabel={t('home.see_details')}
      onAction={() => router.push('/tabs/insights')}
    >
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{t('insights.subscriptions_total_label')}</Text>
        <Text style={styles.totalAmount}>{total.toLocaleString('sv-SE')} kr</Text>
      </View>
      <View style={styles.list}>
        {subscriptions.map((sub, i) => (
          <View key={sub.id} style={[styles.row, i < subscriptions.length - 1 && styles.rowBorder]}>
            <Text style={styles.emoji}>{sub.emoji}</Text>
            <Text style={styles.name} numberOfLines={1}>{sub.merchant}</Text>
            <Text style={styles.amount}>{Math.abs(sub.amount).toLocaleString('sv-SE')} kr</Text>
          </View>
        ))}
      </View>
    </WidgetShell>
  );
}

const styles = StyleSheet.create({
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  totalLabel: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
  },
  totalAmount: {
    fontFamily: Typography.bold,
    fontSize: 20,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  list: { gap: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  emoji: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  name: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  amount: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.text,
    flexShrink: 0,
  },
});
