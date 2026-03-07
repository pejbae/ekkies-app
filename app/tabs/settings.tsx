import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { Language } from '@/constants/storage';

export default function Settings() {
  const { t } = useTranslation();
  const { language, setLanguage, payday, bankConnected } = useApp();

  const handleLanguage = async (lang: Language) => {
    if (lang !== language) await setLanguage(lang);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>{t('settings.title')}</Text>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('settings.language_section')}</Text>
          <View style={styles.card}>
            <View style={styles.segmentWrap}>
              {(['sv', 'en'] as Language[]).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.segment, language === lang && styles.segmentActive]}
                  onPress={() => handleLanguage(lang)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentText, language === lang && styles.segmentTextActive]}>
                    {t(`settings.language_${lang}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Payday */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('settings.payday_section')}</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('settings.payday_section')}</Text>
              <Text style={styles.rowValue}>
                {payday ? t('settings.payday_value', { day: payday }) : '25th'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bank */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('settings.bank_section')}</Text>
          <View style={styles.card}>
            {bankConnected ? (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t('settings.bank_section')}</Text>
                <View style={styles.rowRight}>
                  <View style={[styles.statusDot, { backgroundColor: Colors.positive }]} />
                  <Text style={[styles.rowValue, { color: Colors.positive }]}>
                    {t('settings.bank_connected')}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.bankNotConnected}>
                <Text style={styles.bankNote}>{t('settings.bank_mock_note')}</Text>
                <TouchableOpacity style={styles.connectBtn} activeOpacity={0.85}>
                  <Text style={styles.connectBtnText}>{t('settings.connect_bank')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('settings.app_section')}</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>ekkies</Text>
              <Text style={styles.rowMeta}>{t('settings.version', { version: '1.0.0' })}</Text>
            </View>
          </View>
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
    paddingBottom: Spacing.lg,
  },
  title: {
    fontFamily: Typography.display,
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.muted,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  segmentWrap: {
    flexDirection: 'row',
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  segmentActive: {
    backgroundColor: Colors.accentSoft,
    borderWidth: 1,
    borderColor: Colors.accent + '50',
  },
  segmentText: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.muted,
  },
  segmentTextActive: {
    color: Colors.accent,
    fontFamily: Typography.semibold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  rowLabel: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
  },
  rowValue: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.text,
  },
  rowMeta: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  bankNotConnected: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  bankNote: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 20,
  },
  connectBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  connectBtnText: {
    fontFamily: Typography.semibold,
    fontSize: 14,
    color: Colors.white,
  },
});
