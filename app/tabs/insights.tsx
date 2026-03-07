import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useTranslation } from 'react-i18next';

export default function Insights() {
  const { t } = useTranslation();

  const INSIGHTS = [
    {
      id: '1',
      type: 'observation',
      title: t('insights.i1_title'),
      text: t('insights.i1_text'),
      emoji: '🛒',
      color: Colors.green,
    },
    {
      id: '2',
      type: 'celebration',
      title: t('insights.i2_title'),
      text: t('insights.i2_text'),
      emoji: '🎉',
      color: Colors.gold,
    },
    {
      id: '3',
      type: 'observation',
      title: t('insights.i3_title'),
      text: t('insights.i3_text'),
      emoji: '📺',
      color: Colors.muted,
    },
    {
      id: '4',
      type: 'observation',
      title: t('insights.i4_title'),
      text: t('insights.i4_text'),
      emoji: '💰',
      color: Colors.green,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>{t('insights.title')}</Text>
          <Text style={styles.subtitle}>{t('insights.subtitle')}</Text>
        </View>

        <View style={styles.cards}>
          {INSIGHTS.map((insight) => (
            <View
              key={insight.id}
              style={[
                styles.card,
                insight.type === 'celebration' && styles.cardCelebration,
              ]}
            >
              <Text style={styles.cardEmoji}>{insight.emoji}</Text>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: insight.color }]}>
                  {insight.title}
                </Text>
                <Text style={styles.cardText}>{insight.text}</Text>
              </View>
            </View>
          ))}
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
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.light,
    fontSize: 14,
    color: Colors.muted,
    lineHeight: 22,
  },
  cards: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  cardCelebration: {
    backgroundColor: Colors.goldDim,
    borderColor: Colors.gold + '40',
  },
  cardEmoji: {
    fontSize: 22,
    marginTop: 2,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: Typography.medium,
    fontSize: 14,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  cardText: {
    fontFamily: Typography.light,
    fontSize: 14,
    color: Colors.muted,
    lineHeight: 22,
  },
});
