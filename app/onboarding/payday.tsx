import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';

export default function Payday() {
  const { t } = useTranslation();
  const { setPayday, completeOnboarding } = useApp();
  const [changing, setChanging] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [payday, setLocalPayday] = useState(25);

  const handleConfirmChange = () => {
    const n = parseInt(inputVal, 10);
    if (n >= 1 && n <= 28) setLocalPayday(n);
    setChanging(false);
    setInputVal('');
  };

  const handleContinue = async () => {
    await setPayday(payday);
    await completeOnboarding();
    router.replace('/tabs');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>

        <TouchableOpacity style={styles.back} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backText}>{t('connect.back')}</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.headline}>{t('payday.headline')}</Text>

          <View style={styles.dayDisplay}>
            <Text style={styles.dayNumber}>{payday}</Text>
            <Text style={styles.daySuffix}>{t('payday.day_suffix')}</Text>
          </View>

          <Text style={styles.body}>{t('payday.body')}</Text>

          {changing ? (
            <View style={styles.changeRow}>
              <TextInput
                style={styles.input}
                value={inputVal}
                onChangeText={setInputVal}
                placeholder={t('payday.change_label')}
                placeholderTextColor={Colors.subtle}
                keyboardType="number-pad"
                maxLength={2}
                autoFocus
              />
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirmChange}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmBtnText}>{t('payday.confirm_change')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setChanging(true)} activeOpacity={0.7}>
              <Text style={styles.changeLink}>{t('payday.change')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleContinue}
          activeOpacity={0.88}
        >
          <Text style={styles.buttonPrimaryText}>{t('payday.cta')}</Text>
        </TouchableOpacity>

        <View style={{ height: Spacing.lg }} />
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    marginBottom: Spacing.xxl,
  },
  backText: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.muted,
  },
  content: {
    gap: Spacing.lg,
  },
  headline: {
    fontFamily: Typography.display,
    fontSize: 34,
    lineHeight: 42,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  dayDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  dayNumber: {
    fontFamily: Typography.display,
    fontSize: 96,
    lineHeight: 100,
    color: Colors.accent,
    letterSpacing: -4,
  },
  daySuffix: {
    fontFamily: Typography.bold,
    fontSize: 28,
    color: Colors.accent,
    marginBottom: 12,
  },
  body: {
    fontFamily: Typography.regular,
    fontSize: 15,
    lineHeight: 23,
    color: Colors.muted,
  },
  changeLink: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.accent,
    textDecorationLine: 'underline',
  },
  changeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontFamily: Typography.medium,
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
  },
  confirmBtn: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  confirmBtnText: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.text,
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
});
