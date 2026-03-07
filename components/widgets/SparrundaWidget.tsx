import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { getMockData, getRoundUpSavings } from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { useNumberLocale } from '@/utils/locale';

export default function SparrundaWidget() {
  const { t } = useTranslation();
  const { activeAccount } = useApp();
  const locale = useNumberLocale();

  const { transactions } = getMockData(activeAccount);
  const weeklyRoundup = Math.round(getRoundUpSavings(transactions, 7));

  if (weeklyRoundup <= 0) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.star}>✦</Text>
      <Text style={styles.text}>
        {t('home.sparrunda_banner', { amount: weeklyRoundup.toLocaleString(locale) })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    backgroundColor: Colors.positiveSoft,
    borderWidth: 1,
    borderColor: Colors.positive + '30',
  },
  star: {
    fontSize: 14,
    color: Colors.positive,
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.positive,
    lineHeight: 18,
  },
});
