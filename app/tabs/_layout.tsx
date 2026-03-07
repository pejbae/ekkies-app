import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { TransactionsIcon } from '@/components/icons/TransactionsIcon';
import { CategoriesIcon } from '@/components/icons/CategoriesIcon';
import { InsightsIcon } from '@/components/icons/InsightsIcon';
import { SettingsIcon } from '@/components/icons/SettingsIcon';

function TabIcon({
  Icon,
  focused,
}: {
  Icon: React.ComponentType<{ color: string; size?: number }>;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Icon
        color={focused ? Colors.green : Colors.muted}
        size={20}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.green,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={HomeIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: t('tabs.transactions'),
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={TransactionsIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: t('tabs.categories'),
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={CategoriesIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: t('tabs.insights'),
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={InsightsIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={SettingsIcon} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 84,
    paddingBottom: 24,
    paddingTop: 12,
  },
  tabLabel: {
    fontFamily: Typography.regular,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.greenGlow,
  },
});
