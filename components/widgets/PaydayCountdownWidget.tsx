import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { getMockData, getDaysUntilPayday } from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';

export default function PaydayCountdownWidget() {
  const { t } = useTranslation();
  const { payday, activeAccount } = useApp();

  const { user } = getMockData(activeAccount);
  const effectivePayday = payday ?? user.payday;
  const daysUntil = getDaysUntilPayday(effectivePayday);

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthPct = Math.round((now.getDate() / daysInMonth) * 100);

  return (
    <View style={[styles.card, Shadow.card]}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.daysNumber}>{daysUntil}</Text>
          <Text style={styles.daysLabel}>{t('home.payday_countdown_label')}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.paydayDate}>{t('home.payday_on', { day: effectivePayday })}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${monthPct}%` }]} />
          </View>
          <Text style={styles.monthPct}>{t('home.month_progress', { pct: monthPct })}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  left: {
    alignItems: 'center',
    flexShrink: 0,
  },
  daysNumber: {
    fontFamily: Typography.display,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -2,
    color: Colors.text,
  },
  daysLabel: {
    fontFamily: Typography.regular,
    fontSize: 11,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 2,
  },
  right: {
    flex: 1,
    gap: 6,
  },
  paydayDate: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.text,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surface2,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  monthPct: {
    fontFamily: Typography.regular,
    fontSize: 11,
    color: Colors.subtle,
  },
});
