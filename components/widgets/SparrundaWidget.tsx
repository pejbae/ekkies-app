import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { MOCK_TRANSACTIONS, getRoundUpSavings } from '@/constants/mockData';
import { useTranslation } from 'react-i18next';

export default function SparrundaWidget() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const weeklyRoundup = getRoundUpSavings(MOCK_TRANSACTIONS, 7);
  const monthlyRoundup = Math.round(weeklyRoundup * 4.3);

  if (weeklyRoundup <= 0) return null;

  return (
    <View style={[styles.card, Shadow.card]}>
      <View style={styles.row}>
        <Text style={styles.star}>✦</Text>
        <View style={styles.content}>
          <Text style={styles.title}>{t('home.roundup_title')}</Text>
          <Text style={styles.body}>
            {t('home.roundup_body', {
              weekly: weeklyRoundup.toLocaleString('sv-SE'),
              monthly: monthlyRoundup.toLocaleString('sv-SE'),
            })}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.8}
        style={styles.cta}
      >
        <Text style={styles.ctaText}>{t('home.roundup_cta')}</Text>
        <Text style={styles.ctaChevron}>{expanded ? '↑' : '↓'}</Text>
      </TouchableOpacity>

      {expanded && (
        <Text style={styles.explanation}>{t('home.roundup_explanation')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.positiveSoft,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.positive + '30',
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  star: {
    fontSize: 20,
    color: Colors.positive,
    lineHeight: 24,
  },
  content: { flex: 1, gap: 4 },
  title: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.text,
  },
  body: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 18,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaText: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.positive,
  },
  ctaChevron: {
    fontFamily: Typography.bold,
    fontSize: 13,
    color: Colors.positive,
  },
  explanation: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 20,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.positive + '20',
  },
});
