import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { getMockData } from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { WidgetId } from '@/constants/widgets';

import SafeToSpendWidget from '@/components/widgets/SafeToSpendWidget';
import PaydayCountdownWidget from '@/components/widgets/PaydayCountdownWidget';
import SparrundaWidget from '@/components/widgets/SparrundaWidget';
import BudgetOverviewWidget from '@/components/widgets/BudgetOverviewWidget';
import RecentTransactionsWidget from '@/components/widgets/RecentTransactionsWidget';
import MonthHealthWidget from '@/components/widgets/MonthHealthWidget';
import SubscriptionsWidget from '@/components/widgets/SubscriptionsWidget';

function WidgetRenderer({ id }: { id: WidgetId }) {
  switch (id) {
    case 'safe_to_spend':       return <SafeToSpendWidget />;
    case 'payday_countdown':    return <PaydayCountdownWidget />;
    case 'sparrunda':           return <SparrundaWidget />;
    case 'budget_overview':     return <BudgetOverviewWidget />;
    case 'recent_transactions': return <RecentTransactionsWidget />;
    case 'month_health':        return <MonthHealthWidget />;
    case 'subscriptions':       return <SubscriptionsWidget />;
    default:                    return null;
  }
}

export default function Home() {
  const { t } = useTranslation();
  const { widgetOrder, activeAccount } = useApp();
  const { user } = getMockData(activeAccount);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{t('home.greeting', { name: user.name })}</Text>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push('/tabs/profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{user.name[0].toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Widget stack */}
        {widgetOrder.map((id) => (
          <View key={id} style={styles.widgetWrap}>
            <WidgetRenderer id={id} />
          </View>
        ))}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { gap: 0 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  greeting: {
    fontFamily: Typography.bold,
    fontSize: 20,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.accent + '30',
  },
  avatarText: {
    fontFamily: Typography.bold,
    fontSize: 16,
    color: Colors.accent,
  },
  widgetWrap: {
    marginBottom: Spacing.md,
  },
});
