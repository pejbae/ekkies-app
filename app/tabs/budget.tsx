import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import {
  MOCK_TRANSACTIONS,
  CATEGORY_COLORS,
  getCategoryLabel,
  getMonthSpendingByCategory,
  getBudgetProgress,
  Category,
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';

// Discretionary categories available to budget
const BUDGET_CATEGORIES: Category[] = [
  'mat', 'transport', 'noje', 'halsa', 'shopping', 'prenumerationer',
];

export default function Budget() {
  const { t } = useTranslation();
  const { budgets, setBudget } = useApp();
  const [editing, setEditing] = useState<Category | null>(null);
  const [inputVal, setInputVal] = useState('');

  const byCategory = getMonthSpendingByCategory(MOCK_TRANSACTIONS);

  // Total discretionary budget and spend
  const totalBudget = BUDGET_CATEGORIES.reduce((sum, cat) => sum + (budgets[cat] ?? 0), 0);
  const totalSpent = BUDGET_CATEGORIES.reduce((sum, cat) => sum + (byCategory[cat] ?? 0), 0);
  const totalProgress = getBudgetProgress(totalSpent, totalBudget);

  const openEdit = (cat: Category) => {
    setInputVal(String(budgets[cat] ?? ''));
    setEditing(cat);
  };

  const handleSave = async () => {
    if (!editing) return;
    const amount = parseInt(inputVal, 10);
    if (!isNaN(amount) && amount >= 0) {
      await setBudget(editing, amount);
    }
    setEditing(null);
    setInputVal('');
  };

  const handleCancel = () => {
    setEditing(null);
    setInputVal('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('budget.title')}</Text>
        </View>

        {/* Total bar */}
        {totalBudget > 0 && (
          <View style={[styles.totalCard, Shadow.card]}>
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>{t('budget.total_label')}</Text>
                <Text style={styles.totalSpent}>
                  {totalSpent.toLocaleString('sv-SE')} kr
                </Text>
              </View>
              <Text style={styles.totalOf}>
                {t('budget.of', { amount: totalBudget.toLocaleString('sv-SE') })}
              </Text>
            </View>
            <View style={styles.totalBarBg}>
              <View
                style={[
                  styles.totalBarFill,
                  {
                    width: `${Math.min(totalProgress.pct, 100)}%`,
                    backgroundColor: totalProgress.color,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Category cards */}
        <View style={styles.categories}>
          {BUDGET_CATEGORIES.map((cat) => {
            const spent = byCategory[cat] ?? 0;
            const budget = budgets[cat];
            const catColor = CATEGORY_COLORS[cat] ?? Colors.accent;
            const hasBudget = budget != null && budget > 0;
            const { pct, color } = hasBudget
              ? getBudgetProgress(spent, budget)
              : { pct: 0, color: Colors.subtle };

            const remaining = hasBudget ? (budget - spent) : 0;
            const isOver = remaining < 0;

            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catCard, Shadow.card]}
                onPress={() => openEdit(cat)}
                activeOpacity={0.8}
              >
                {/* Category header */}
                <View style={styles.catTop}>
                  <View style={styles.catLeft}>
                    <View style={[styles.catDot, { backgroundColor: catColor }]} />
                    <Text style={styles.catName}>{getCategoryLabel(cat, t)}</Text>
                  </View>
                  <Text style={styles.catEdit}>Edit</Text>
                </View>

                {/* Budget bar */}
                {hasBudget ? (
                  <>
                    <View style={styles.barBg}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${Math.min(pct, 100)}%`,
                            backgroundColor: color,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.catBottom}>
                      <Text style={styles.catSpent}>
                        {spent.toLocaleString('sv-SE')} kr
                        <Text style={styles.catOf}>
                          {' '}{t('budget.of', { amount: budget.toLocaleString('sv-SE') })}
                        </Text>
                      </Text>
                      <Text style={[styles.catRemaining, { color: isOver ? Colors.danger : Colors.positive }]}>
                        {isOver
                          ? t('budget.over', { amount: Math.abs(remaining).toLocaleString('sv-SE') })
                          : t('budget.left', { amount: remaining.toLocaleString('sv-SE') })}
                      </Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.noBudget}>
                    {t('budget.set_budget')} — {spent > 0 ? `${spent.toLocaleString('sv-SE')} kr this month` : t('budget.no_budget')}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Edit modal */}
      <Modal
        visible={editing !== null}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={styles.modalBackdrop} onPress={handleCancel} activeOpacity={1} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {editing ? t('budget.edit_prompt', { category: getCategoryLabel(editing, t) }) : ''}
            </Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={inputVal}
                onChangeText={setInputVal}
                placeholder="0"
                placeholderTextColor={Colors.subtle}
                keyboardType="number-pad"
                autoFocus
                selectTextOnFocus
              />
              <Text style={styles.inputSuffix}>kr</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.75}>
                <Text style={styles.cancelBtnText}>{t('budget.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
                <Text style={styles.saveBtnText}>{t('budget.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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

  // Total card
  totalCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.muted,
    marginBottom: 4,
  },
  totalSpent: {
    fontFamily: Typography.display,
    fontSize: 36,
    color: Colors.text,
    letterSpacing: -1,
  },
  totalOf: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
    marginBottom: 4,
  },
  totalBarBg: {
    height: 8,
    backgroundColor: Colors.surface2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  totalBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Category cards
  categories: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  catCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  catTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  catDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  catName: {
    fontFamily: Typography.semibold,
    fontSize: 15,
    color: Colors.text,
  },
  catEdit: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.accent,
  },
  barBg: {
    height: 6,
    backgroundColor: Colors.surface2,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  catBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catSpent: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.text,
  },
  catOf: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
  },
  catRemaining: {
    fontFamily: Typography.semibold,
    fontSize: 13,
  },
  noBudget: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  modalSheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.lg,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surface2,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    fontFamily: Typography.semibold,
    fontSize: 16,
    color: Colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: Typography.bold,
    fontSize: 32,
    color: Colors.text,
    paddingVertical: Spacing.md,
    letterSpacing: -0.5,
  },
  inputSuffix: {
    fontFamily: Typography.medium,
    fontSize: 18,
    color: Colors.muted,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: Radius.md,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontFamily: Typography.semibold,
    fontSize: 15,
    color: Colors.muted,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
    ...Shadow.accent,
  },
  saveBtnText: {
    fontFamily: Typography.semibold,
    fontSize: 15,
    color: Colors.white,
  },
});
