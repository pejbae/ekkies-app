import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useTranslation } from 'react-i18next';

const BANKS = [
  { id: 'swedbank', name: 'Swedbank' },
  { id: 'seb', name: 'SEB' },
  { id: 'handelsbanken', name: 'Handelsbanken' },
  { id: 'nordea', name: 'Nordea' },
  { id: 'lansforsakringar', name: 'Länsförsäkringar' },
  { id: 'danske', name: 'Danske Bank' },
  { id: 'ica', name: 'ICA Banken' },
  { id: 'revolut', name: 'Revolut' },
];

export default function ConnectBank() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    // TODO: Tink OAuth flow here
    router.push('/onboarding/payday');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Back */}
        <TouchableOpacity style={styles.back} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backText}>{t('connect.back')}</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headline}>{t('connect.headline')}</Text>
          <Text style={styles.body}>{t('connect.body')}</Text>
        </View>

        {/* Bank grid */}
        <Text style={styles.listLabel}>{t('connect.list_label')}</Text>
        <View style={styles.bankGrid}>
          {BANKS.map((bank) => (
            <TouchableOpacity
              key={bank.id}
              style={[styles.bankCard, selected === bank.id && styles.bankCardSelected]}
              onPress={() => setSelected(bank.id)}
              activeOpacity={0.75}
            >
              {selected === bank.id && (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
              <View style={styles.bankInitial}>
                <Text style={styles.bankInitialText}>{bank.name[0]}</Text>
              </View>
              <Text style={[styles.bankName, selected === bank.id && styles.bankNameSelected]}>
                {bank.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Security note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityText}>
            {t('connect.security_note')}
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.buttonPrimary, !selected && styles.buttonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.88}
          disabled={!selected}
        >
          <Text style={styles.buttonPrimaryText}>{t('connect.continue')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/onboarding/payday')}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>{t('connect.skip')}</Text>
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
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
  },
  back: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  backText: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.muted,
  },
  header: {
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  headline: {
    fontFamily: Typography.display,
    fontSize: 40,
    lineHeight: 46,
    color: Colors.text,
    letterSpacing: -1,
  },
  body: {
    fontFamily: Typography.regular,
    fontSize: 15,
    lineHeight: 23,
    color: Colors.muted,
  },
  listLabel: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.muted,
    marginBottom: Spacing.md,
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  bankCard: {
    width: '48.5%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  bankCardSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSoft,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 10,
    color: Colors.white,
    fontFamily: Typography.bold,
  },
  bankInitial: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankInitialText: {
    fontFamily: Typography.bold,
    fontSize: 16,
    color: Colors.muted,
  },
  bankName: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.text,
    flex: 1,
  },
  bankNameSelected: {
    color: Colors.accent,
  },
  securityNote: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  securityText: {
    fontFamily: Typography.regular,
    fontSize: 12,
    color: Colors.muted,
    lineHeight: 18,
  },
  buttonPrimary: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadow.accent,
  },
  buttonDisabled: {
    opacity: 0.35,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonPrimaryText: {
    fontFamily: Typography.semibold,
    fontSize: 16,
    color: Colors.white,
    letterSpacing: 0.2,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  skipText: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.muted,
  },
});
