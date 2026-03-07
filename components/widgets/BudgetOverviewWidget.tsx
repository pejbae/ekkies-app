import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Switch } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import {
  getMockData, CATEGORY_COLORS,
  getMonthSpendingByCategory, getBudgetProgress,
  Category,
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import WidgetShell from './WidgetShell';
import { useNumberLocale } from '@/utils/locale';

const ALL_CATEGORIES: Category[] = ['mat', 'transport', 'noje', 'halsa', 'shopping', 'prenumerationer'];

export default function BudgetOverviewWidget() {
  const { t } = useTranslation();
  const { budgets, activeAccount, pinnedBudgetCategories, setPinnedBudgetCategories } = useApp();
  const locale = useNumberLocale();
  const [editOpen, setEditOpen] = useState(false);

  const { transactions } = getMockData(activeAccount);
  const byCategory = getMonthSpendingByCategory(transactions);

  const visibleCategories = ALL_CATEGORIES.filter((c) => pinnedBudgetCategories.includes(c));

  const toggleCat = (cat: Category) => {
    if (pinnedBudgetCategories.includes(cat)) {
      if (pinnedBudgetCategories.length === 1) return; // keep at least one
      setPinnedBudgetCategories(pinnedBudgetCategories.filter((c) => c !== cat));
    } else {
      setPinnedBudgetCategories([...pinnedBudgetCategories, cat]);
    }
  };

  return (
    <>
      <WidgetShell
        title={t('widgets.budget')}
        actionLabel={t('home.manage')}
        onAction={() => router.push('/tabs/budget')}
        noPadding
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pills}
        >
          {visibleCategories.map((cat) => {
            const budget = budgets[cat] ?? 0;
            const spent = byCategory[cat] ?? 0;
            const { pct, color } = getBudgetProgress(spent, budget);
            const dotColor = CATEGORY_COLORS[cat];

            return (
              <View key={cat} style={styles.pill}>
                <View style={styles.pillTop}>
                  <View style={[styles.dot, { backgroundColor: dotColor }]} />
                  <Text style={styles.pillLabel} numberOfLines={1}>
                    {t(`categories.${cat}`)}
                  </Text>
                </View>
                <Text style={[styles.pillAmount, { color }]}>
                  {spent.toLocaleString(locale)}
                </Text>
                <Text style={styles.pillBudget}>/ {budget.toLocaleString(locale)} kr</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressBar, { width: `${pct}%`, backgroundColor: color }]} />
                </View>
              </View>
            );
          })}

          {/* Edit chip */}
          <TouchableOpacity
            style={styles.editChip}
            onPress={() => setEditOpen(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.editChipText}>✎ {t('budget.pin_categories')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </WidgetShell>

      {/* Category picker bottom sheet */}
      <Modal
        visible={editOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setEditOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setEditOpen(false)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{t('budget.pin_categories')}</Text>
          <Text style={styles.sheetSub}>{t('budget.pin_subtitle')}</Text>
          {ALL_CATEGORIES.map((cat, i) => (
            <View
              key={cat}
              style={[styles.sheetRow, i < ALL_CATEGORIES.length - 1 && styles.rowBorder]}
            >
              <View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[cat] }]} />
              <Text style={styles.sheetLabel}>{t(`categories.${cat}`)}</Text>
              <Switch
                value={pinnedBudgetCategories.includes(cat)}
                onValueChange={() => toggleCat(cat)}
                trackColor={{ false: Colors.surface2, true: Colors.accent + '60' }}
                thumbColor={pinnedBudgetCategories.includes(cat) ? Colors.accent : Colors.subtle}
                ios_backgroundColor={Colors.surface2}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.doneBtn} onPress={() => setEditOpen(false)}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pills: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.xs,
    alignItems: 'center',
  },
  pill: {
    width: 100,
    backgroundColor: Colors.bg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm + 2,
    gap: 3,
  },
  pillTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  pillLabel: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    color: Colors.muted,
    flex: 1,
  },
  pillAmount: {
    fontFamily: Typography.bold,
    fontSize: 16,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  pillBudget: {
    fontFamily: Typography.regular,
    fontSize: 10,
    color: Colors.subtle,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.surface2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
  },
  editChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    flexShrink: 0,
    alignSelf: 'center',
  },
  editChipText: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.muted,
  },

  // Bottom sheet
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.md,
    gap: Spacing.xs,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    fontFamily: Typography.bold,
    fontSize: 17,
    color: Colors.text,
    marginBottom: 2,
  },
  sheetSub: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
    marginBottom: Spacing.md,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: Spacing.sm,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  catDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  sheetLabel: {
    flex: 1,
    fontFamily: Typography.medium,
    fontSize: 15,
    color: Colors.text,
  },
  doneBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    fontFamily: Typography.bold,
    fontSize: 15,
    color: Colors.white,
  },
});
