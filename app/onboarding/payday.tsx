import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

const COMMON_DAYS = [1, 15, 20, 24, 25, 26, 28];
const ALL_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

export default function Payday() {
  const [selected, setSelected] = useState<number | null>(25);

  const handleContinue = () => {
    // TODO: Save payday to local storage / state
    router.replace('/tabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <TouchableOpacity
          style={styles.back}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>← Tillbaka</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.step}>Steg 2 av 2</Text>
          <Text style={styles.headline}>När får{'\n'}du lön?</Text>
          <Text style={styles.body}>
            Vi använder detta för att visa hur mycket du har kvar till
            nästa löndag. Du kan ändra detta när som helst.
          </Text>
        </View>

        {/* Common days */}
        <Text style={styles.sectionLabel}>Vanliga lönedagar</Text>
        <View style={styles.commonGrid}>
          {COMMON_DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayCard,
                selected === day && styles.dayCardSelected,
              ]}
              onPress={() => setSelected(day)}
              activeOpacity={0.75}
            >
              <Text style={[
                styles.dayNum,
                selected === day && styles.dayNumSelected,
              ]}>
                {day}:e
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* All days picker */}
        <Text style={styles.sectionLabel}>Eller välj datum</Text>
        <View style={styles.allDaysGrid}>
          {ALL_DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.smallDay,
                selected === day && styles.smallDaySelected,
              ]}
              onPress={() => setSelected(day)}
              activeOpacity={0.75}
            >
              <Text style={[
                styles.smallDayText,
                selected === day && styles.smallDayTextSelected,
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected preview */}
        {selected && (
          <View style={styles.preview}>
            <Text style={styles.previewEmoji}>📅</Text>
            <Text style={styles.previewText}>
              Du får lön den{' '}
              <Text style={styles.previewHighlight}>{selected}:e</Text>
              {' '}varje månad
            </Text>
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={[styles.button, !selected && styles.buttonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.85}
          disabled={!selected}
        >
          <Text style={styles.buttonText}>Klar — visa min översikt →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/tabs')}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Hoppa över</Text>
        </TouchableOpacity>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.lg,
  },
  back: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  backText: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.muted,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  step: {
    fontFamily: Typography.regular,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.green,
    marginBottom: Spacing.sm,
  },
  headline: {
    fontFamily: Typography.display,
    fontSize: 40,
    lineHeight: 48,
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
  },
  body: {
    fontFamily: Typography.light,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.muted,
  },
  sectionLabel: {
    fontFamily: Typography.medium,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.muted,
    marginBottom: Spacing.md,
  },
  commonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  dayCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayCardSelected: {
    backgroundColor: Colors.greenDim,
    borderColor: Colors.green,
  },
  dayNum: {
    fontFamily: Typography.medium,
    fontSize: 16,
    color: Colors.muted,
  },
  dayNumSelected: {
    color: Colors.green,
  },
  allDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.xl,
  },
  smallDay: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  smallDaySelected: {
    backgroundColor: Colors.greenDim,
    borderColor: Colors.green,
  },
  smallDayText: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.muted,
  },
  smallDayTextSelected: {
    color: Colors.green,
    fontFamily: Typography.medium,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.greenGlow,
    borderWidth: 1,
    borderColor: Colors.greenDim,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  previewEmoji: {
    fontSize: 18,
  },
  previewText: {
    fontFamily: Typography.regular,
    fontSize: 15,
    color: Colors.muted,
  },
  previewHighlight: {
    fontFamily: Typography.medium,
    color: Colors.green,
  },
  button: {
    backgroundColor: Colors.green,
    borderRadius: Radius.full,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontFamily: Typography.medium,
    fontSize: 16,
    color: Colors.bg,
    letterSpacing: 0.3,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  skipText: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.muted,
  },
});
