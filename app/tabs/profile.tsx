import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { Language } from '@/constants/storage';
import {
  MOCK_USER, MOCK_TRANSACTIONS,
  getMonthSpendingByCategory, getBalanceUntilPayday,
} from '@/constants/mockData';
import { WIDGET_META, DEFAULT_WIDGET_ORDER, WidgetId } from '@/constants/widgets';

const DISCRETIONARY = ['mat', 'transport', 'noje', 'halsa', 'shopping', 'prenumerationer'] as const;

export default function Profile() {
  const { t } = useTranslation();
  const { language, setLanguage, payday, bankConnected, widgetOrder, setWidgetOrder } = useApp();

  const handleLanguage = async (lang: Language) => {
    if (lang !== language) await setLanguage(lang);
  };

  const toggleWidget = async (id: WidgetId) => {
    if (id === 'safe_to_spend') return; // always on
    if (widgetOrder.includes(id)) {
      await setWidgetOrder(widgetOrder.filter((w) => w !== id));
    } else {
      const newOrder = DEFAULT_WIDGET_ORDER.filter(
        (w) => w === id || widgetOrder.includes(w)
      );
      await setWidgetOrder(newOrder);
    }
  };

  const byCategory = getMonthSpendingByCategory(MOCK_TRANSACTIONS);
  const totalSpent = DISCRETIONARY.reduce((sum, cat) => sum + (byCategory[cat] ?? 0), 0);
  const income = MOCK_USER.monthlyIncome;
  const balance = getBalanceUntilPayday(MOCK_TRANSACTIONS, income);
  const trackingDays = 14;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Identity + snapshot ── */}
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{MOCK_USER.name[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.heroName}>{MOCK_USER.name}</Text>
          <Text style={styles.heroStreak}>{t('profile.streak', { count: trackingDays })}</Text>

          <View style={styles.statRow}>
            <View style={[styles.stat, { backgroundColor: Colors.positiveSoft }]}>
              <Text style={[styles.statValue, { color: Colors.positive }]}>
                ↓ {income.toLocaleString('sv-SE')} kr
              </Text>
              <Text style={styles.statLabel}>{t('settings.payday_section')}</Text>
            </View>
            <View style={[styles.stat, { backgroundColor: Colors.surface }]}>
              <Text style={[styles.statValue, { color: Colors.text }]}>
                ↑ {totalSpent.toLocaleString('sv-SE')} kr
              </Text>
              <Text style={styles.statLabel}>{t('insights.spending_title')}</Text>
            </View>
            <View style={[styles.stat, { backgroundColor: Colors.accentSoft }]}>
              <Text style={[styles.statValue, { color: Colors.accent }]}>
                {balance.toLocaleString('sv-SE')} kr
              </Text>
              <Text style={styles.statLabel}>kvar</Text>
            </View>
          </View>
        </View>

        {/* ── Home widgets ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('profile.customize_section')}</Text>
          <Text style={styles.sectionSub}>{t('widgets.customize_subtitle')}</Text>
          <View style={[styles.card, Shadow.card]}>
            {DEFAULT_WIDGET_ORDER.map((id, i) => {
              const meta = WIDGET_META[id];
              const isOn = widgetOrder.includes(id);
              const isLast = i === DEFAULT_WIDGET_ORDER.length - 1;
              const isAlwaysOn = id === 'safe_to_spend';
              return (
                <View key={id} style={[styles.widgetRow, !isLast && styles.rowBorder]}>
                  <Text style={styles.widgetIcon}>{meta.icon}</Text>
                  <Text style={styles.widgetLabel}>{t(meta.labelKey)}</Text>
                  <Switch
                    value={isOn}
                    onValueChange={() => toggleWidget(id)}
                    disabled={isAlwaysOn}
                    trackColor={{ false: Colors.surface2, true: Colors.accent + '60' }}
                    thumbColor={isOn ? Colors.accent : Colors.subtle}
                    ios_backgroundColor={Colors.surface2}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Settings (compact single card) ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('profile.settings_section')}</Text>
          <View style={[styles.card, Shadow.card]}>
            {/* Language */}
            <View style={[styles.settingsRow, styles.rowBorder]}>
              <Text style={styles.settingsIcon}>🌐</Text>
              <Text style={styles.settingsLabel}>{t('settings.language_section')}</Text>
              <View style={styles.langToggle}>
                {(['sv', 'en'] as Language[]).map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={[styles.langBtn, language === lang && styles.langBtnActive]}
                    onPress={() => handleLanguage(lang)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.langBtnText, language === lang && styles.langBtnTextActive]}>
                      {lang.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Payday */}
            <View style={[styles.settingsRow, styles.rowBorder]}>
              <Text style={styles.settingsIcon}>📅</Text>
              <Text style={styles.settingsLabel}>{t('settings.payday_section')}</Text>
              <Text style={styles.settingsValue}>
                {payday ? t('settings.payday_value', { day: payday }) : '25th'}
              </Text>
            </View>

            {/* Bank */}
            <View style={styles.settingsRow}>
              <Text style={styles.settingsIcon}>🏦</Text>
              <Text style={styles.settingsLabel}>{t('settings.bank_section')}</Text>
              {bankConnected ? (
                <View style={styles.connectedBadge}>
                  <View style={[styles.statusDot, { backgroundColor: Colors.positive }]} />
                  <Text style={[styles.settingsValue, { color: Colors.positive }]}>
                    {t('settings.bank_connected')}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.connectText}>{t('settings.connect_bank')} →</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* ── About ── */}
        <Text style={styles.about}>ekkies v1.0.0</Text>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  hero: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.accent + '40',
    marginBottom: Spacing.sm,
    ...Shadow.accent,
  },
  avatarText: {
    fontFamily: Typography.display,
    fontSize: 28,
    color: Colors.accent,
  },
  heroName: {
    fontFamily: Typography.bold,
    fontSize: 22,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  heroStreak: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
    marginTop: Spacing.sm,
  },
  stat: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.sm + 2,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontFamily: Typography.bold,
    fontSize: 11,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: Typography.regular,
    fontSize: 10,
    color: Colors.muted,
    textAlign: 'center',
  },

  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.muted,
  },
  sectionSub: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.subtle,
    marginTop: -2,
    marginBottom: 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  widgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: Spacing.md,
  },
  widgetIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  widgetLabel: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },

  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  settingsIcon: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
  },
  settingsLabel: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  settingsValue: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.muted,
  },
  langToggle: {
    flexDirection: 'row',
    gap: 3,
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md,
    padding: 3,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  langBtnActive: {
    backgroundColor: Colors.white,
    ...Shadow.card,
  },
  langBtnText: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.muted,
  },
  langBtnTextActive: {
    fontFamily: Typography.bold,
    color: Colors.text,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  connectText: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.accent,
  },

  about: {
    fontFamily: Typography.regular,
    fontSize: 12,
    color: Colors.subtle,
    textAlign: 'center',
    paddingBottom: Spacing.md,
  },
});
