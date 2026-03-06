import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

// Swedish banks - Tink supports all of these
const BANKS = [
  { id: 'swedbank', name: 'Swedbank', emoji: '🏦' },
  { id: 'seb', name: 'SEB', emoji: '🏛️' },
  { id: 'handelsbanken', name: 'Handelsbanken', emoji: '🏢' },
  { id: 'nordea', name: 'Nordea', emoji: '🌐' },
  { id: 'lansforsakringar', name: 'Länsförsäkringar', emoji: '🛡️' },
  { id: 'danske', name: 'Danske Bank', emoji: '🔵' },
  { id: 'ica', name: 'ICA Banken', emoji: '🟥' },
  { id: 'revolut', name: 'Revolut', emoji: '💜' },
];

export default function ConnectBank() {
  const handleConnect = (bankId: string) => {
    // TODO: Trigger Tink SDK OAuth flow here
    // For now, navigate straight to payday setup
    console.log(`Connecting to bank: ${bankId}`);
    router.push('/onboarding/payday');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Back */}
        <TouchableOpacity
          style={styles.back}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>← Tillbaka</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.step}>Steg 1 av 2</Text>
          <Text style={styles.headline}>Koppla{'\n'}din bank.</Text>
          <Text style={styles.body}>
            Vi ansluter säkert via öppen bankstandard (PSD2). Vi ser aldrig
            ditt lösenord eller kontouppgifter.
          </Text>
        </View>

        {/* Security note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityEmoji}>🔒</Text>
          <Text style={styles.securityText}>
            Bankuppkopplingen drivs av Tink — samma standard som alla EU-banker använder.
          </Text>
        </View>

        {/* Bank list */}
        <Text style={styles.listLabel}>Välj din bank</Text>

        <View style={styles.bankGrid}>
          {BANKS.map((bank) => (
            <TouchableOpacity
              key={bank.id}
              style={styles.bankCard}
              onPress={() => handleConnect(bank.id)}
              activeOpacity={0.75}
            >
              <Text style={styles.bankEmoji}>{bank.emoji}</Text>
              <Text style={styles.bankName}>{bank.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/onboarding/payday')}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Lägg till bank senare</Text>
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
    marginBottom: Spacing.lg,
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
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.greenGlow,
    borderWidth: 1,
    borderColor: Colors.greenDim,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  securityEmoji: {
    fontSize: 16,
    marginTop: 1,
  },
  securityText: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.green,
    flex: 1,
    lineHeight: 20,
  },
  listLabel: {
    fontFamily: Typography.medium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.muted,
    marginBottom: Spacing.md,
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginBottom: Spacing.lg,
  },
  bankCard: {
    width: '49%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bankEmoji: {
    fontSize: 20,
  },
  bankName: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
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
