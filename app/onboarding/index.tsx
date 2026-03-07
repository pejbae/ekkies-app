import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';

export default function Onboarding() {
  const { t } = useTranslation();
  const { completeOnboarding } = useApp();

  const handleExplore = async () => {
    await completeOnboarding();
    router.replace('/tabs');
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Wordmark */}
      <View style={styles.header}>
        <Text style={styles.wordmark}>ekkies</Text>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.headline}>
          {t('onboarding.headline_line1')}{'\n'}
          <Text style={styles.headlineAccent}>{t('onboarding.headline_line2')}</Text>
        </Text>
        <Text style={styles.body}>{t('onboarding.body')}</Text>
      </View>

      <View style={{ flex: 1 }} />

      {/* CTA */}
      <View style={styles.cta}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => router.push('/onboarding/connect')}
          activeOpacity={0.88}
        >
          <Text style={styles.buttonPrimaryText}>{t('onboarding.cta_connect')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonGhost}
          onPress={handleExplore}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonGhostText}>{t('onboarding.cta_explore')}</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  wordmark: {
    fontFamily: Typography.display,
    fontSize: 22,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  hero: {
    gap: Spacing.lg,
  },
  headline: {
    fontFamily: Typography.display,
    fontSize: 44,
    lineHeight: 50,
    color: Colors.text,
    letterSpacing: -1,
  },
  headlineAccent: {
    color: Colors.accent,
  },
  body: {
    fontFamily: Typography.regular,
    fontSize: 17,
    lineHeight: 26,
    color: Colors.muted,
    maxWidth: 320,
  },
  cta: {
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  buttonPrimary: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    ...Shadow.accent,
  },
  buttonPrimaryText: {
    fontFamily: Typography.semibold,
    fontSize: 16,
    color: Colors.white,
    letterSpacing: 0.2,
  },
  buttonGhost: {
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  buttonGhostText: {
    fontFamily: Typography.semibold,
    fontSize: 16,
    color: Colors.text,
    letterSpacing: 0.2,
  },
});
