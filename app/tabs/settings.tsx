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
    if (lang !== language) {
      await setLanguage(lang);
    }
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
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[styles.segment, language === 'sv' && styles.segmentActive]}
                onPress={() => handleLanguage('sv')}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentText, language === 'sv' && styles.segmentTextActive]}>
                  {t('settings.language_sv')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segment, language === 'en' && styles.segmentActive]}
                onPress={() => handleLanguage('en')}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentText, language === 'en' && styles.segmentTextActive]}>
                  {t('settings.language_en')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Payday */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('settings.payday_section')}</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>📅</Text>
              <Text style={styles.rowValue}>
                {payday
                  ? t('settings.payday_value', { day: payday })
                  : '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bank */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('settings.bank_section')}</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>🏦</Text>
              <View style={styles.rowRight}>
                <View style={[styles.statusDot, { backgroundColor: bankConnected ? Colors.green : Colors.muted }]} />
                <Text style={[styles.rowValue, { color: bankConnected ? Colors.green : Colors.muted }]}>
                  {bankConnected ? t('settings.bank_connected') : t('settings.bank_not_connected')}
                </Text>
              </View>
            </View>
            {!bankConnected && (
              <View style={styles.divider} />
            )}
            {!bankConnected && (
              <TouchableOpacity style={styles.connectButton} activeOpacity={0.8}>
                <Text style={styles.connectButtonText}>{t('settings.connect_bank')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('settings.app_section')}</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>✦ ekkies</Text>
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
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontFamily: Typography.display,
    fontSize: 28,
    color: Colors.text,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: Typography.medium,
    fontSize: 11,
    letterSpacing: 1.2,
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
  segmentedControl: {
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
    backgroundColor: Colors.greenDim,
    borderWidth: 1,
    borderColor: Colors.green,
  },
  segmentText: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.muted,
  },
  segmentTextActive: {
    color: Colors.green,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  rowLabel: {
    fontFamily: Typography.regular,
    fontSize: 14,
    color: Colors.text,
  },
  rowValue: {
    fontFamily: Typography.medium,
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
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  connectButton: {
    margin: Spacing.md,
    backgroundColor: Colors.greenDim,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.green,
  },
  connectButtonText: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.green,
  },
});
