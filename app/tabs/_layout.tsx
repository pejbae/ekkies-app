import { Tabs } from 'expo-router';
import { Colors, Typography } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { BudgetIcon } from '@/components/icons/BudgetIcon';
import { TransactionsIcon } from '@/components/icons/TransactionsIcon';
import { InsightsIcon } from '@/components/icons/InsightsIcon';
import { ProfileIcon } from '@/components/icons/ProfileIcon';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bg,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 84,
          paddingBottom: 24,
          paddingTop: 12,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.subtle,
        tabBarLabelStyle: {
          fontFamily: Typography.semibold,
          fontSize: 10,
          letterSpacing: 0.3,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: t('tabs.spend'),
          tabBarIcon: ({ color }) => <TransactionsIcon color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.me'),
          tabBarIcon: ({ color }) => <ProfileIcon color={color} size={22} />,
        }}
      />
      {/* Hidden screens — accessible via widget taps */}
      <Tabs.Screen name="budget" options={{ href: null }} />
      <Tabs.Screen name="insights" options={{ href: null }} />
      {/* Hide legacy routes */}
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="categories" options={{ href: null }} />
    </Tabs>
  );
}
