import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

const INSIGHTS = [
  {
    id: '1',
    type: 'observation',
    title: 'Mat & dryck',
    text: 'Du spenderade 18% mer på mat den här veckan jämfört med förra. Mestadels ICA och caféer.',
    emoji: '🛒',
    color: Colors.green,
  },
  {
    id: '2',
    type: 'celebration',
    title: 'Bra jobbat!',
    text: 'Du har hållit dig under din transportbudget tre veckor i rad. Det är 340 kr extra i fickan.',
    emoji: '🎉',
    color: Colors.gold,
  },
  {
    id: '3',
    type: 'observation',
    title: 'Prenumerationer',
    text: 'Du betalar för 4 streamingtjänster totalt. Det är 567 kr/månad. Använder du alla?',
    emoji: '📺',
    color: Colors.muted,
  },
  {
    id: '4',
    type: 'observation',
    title: 'Lönedagseffekten',
    text: 'Du spenderar i snitt 42% mer den första veckan efter lön. Ganska normalt — men bra att veta.',
    emoji: '💰',
    color: Colors.green,
  },
];

export default function Insights() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Insikter</Text>
          <Text style={styles.subtitle}>
            Lugna observationer om dina pengar.{'\n'}Ingen dömer dig här.
          </Text>
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
