import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function Onboarding() {
  return (
    <SafeAreaView style={styles.container}>

      {/* Background glow */}
      <View style={styles.glow} />

      {/* Logo */}
      <View style={styles.logoRow}>
        <View style={styles.logoDot} />
        <Text style={styles.logoText}>ekkies</Text>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Dina pengar. Äntligen klart.</Text>

        <Text style={styles.headline}>
          Se vad som{'\n'}
          <Text style={styles.headlineItalic}>faktiskt händer</Text>
          {'\n'}med dina pengar.
        </Text>

        <Text style={styles.body}>
          Ekkies kopplar till din bank och visar dig exakt vad du spenderar —
          lugnt, tydligt, utan att döma.
        </Text>
      </View>

      {/* Three value props */}
      <View style={styles.props}>
        <ValueProp emoji="🔗" text="Koppla din bank på under en minut" />
        <ValueProp emoji="📊" text="Se dina utgifter sorterade automatiskt" />
        <ValueProp emoji="📱" text="Kvar till lön — alltid på låsskärmen" />
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/onboarding/connect')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Koppla din bank →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/tabs')}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Utforska utan bank</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

function ValueProp({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.prop}>
      <Text style={styles.propEmoji}>{emoji}</Text>
      <Text style={styles.propText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.lg,
  },
  glow: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.greenGlow,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  logoText: {
    fontFamily: Typography.medium,
    fontSize: 14,
    letterSpacing: 2,
    color: Colors.muted,
    textTransform: 'lowercase',
  },
  content: {
    marginBottom: Spacing.xl,
  },
  eyebrow: {
    fontFamily: Typography.regular,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.green,
    marginBottom: Spacing.md,
  },
  headline: {
    fontFamily: Typography.display,
    fontSize: 38,
    lineHeight: 46,
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
  },
  headlineItalic: {
    fontFamily: Typography.displayItalic,
    color: Colors.green,
  },
  body: {
    fontFamily: Typography.light,
    fontSize: 16,
    lineHeight: 26,
    color: Colors.muted,
  },
  props: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  prop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  propEmoji: {
    fontSize: 18,
  },
  propText: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.muted,
    flex: 1,
  },
  cta: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.green,
    borderRadius: Radius.full,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: Typography.medium,
    fontSize: 16,
    color: Colors.bg,
    letterSpacing: 0.3,
  },
  skipText: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },
});
