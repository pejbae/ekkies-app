import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import {
  MOCK_TRANSACTIONS,
  MOCK_USER,
  CATEGORY_COLORS,
  getCategoryLabel,
  getMonthSpendingByCategory,
  getBudgetProgress,
  Category,
} from '@/constants/mockData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';

const BUDGET_CATEGORIES: Category[] = [
  'mat', 'transport', 'noje', 'halsa', 'shopping', 'prenumerationer',
];

// Round to nearest 100, then bump by 10%
const suggestBudget = (spent: number): number =>
  Math.ceil((spent * 1.1) / 100) * 100;

export default function Budget() {
  const { t } = useTranslation();
  const { budgets, setBudget } = useApp();

  // Single category edit modal
  const [editing, setEditing] = useState<Category | null>(null);
  const [inputVal, setInputVal] = useState('');

  // Paycheck allocation wizard modal
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardDismissed, setWizardDismissed] = useState(false);
  const [wizardAmounts, setWizardAmounts] = useState<Record<string, string>>({});

  const byCategory = getMonthSpendingByCategory(MOCK_TRANSACTIONS);

  const totalBudget = BUDGET_CATEGORIES.reduce((sum, cat) => sum + (budgets[cat] ?? 0), 0);
  const totalSpent = BUDGET_CATEGORIES.reduce((sum, cat) => sum + (byCategory[cat] ?? 0), 0);
  const totalProgress = getBudgetProgress(totalSpent, totalBudget);

  // Check for salary this month
  const now = new Date();
  const paycheckTx = MOCK_TRANSACTIONS.find(
    (tx) =>
      tx.category === 'lon' &&
      tx.amount > 0 &&
      new Date(tx.date).getMonth() === now.getMonth() &&
      new Date(tx.date).getFullYear() === now.getFullYear()
  );
  const showPaycheckBanner = !!paycheckTx && !wizardDismissed;

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

  const openWizard = () => {
    // Seed wizard amounts from last month's spend + 10%, or existing budget
    const initial: Record<string, string> = {};
    BUDGET_CATEGORIES.forEach((cat) => {
      const spent = byCategory[cat] ?? 0;
      if (budgets[cat]) {
        initial[cat] = String(budgets[cat]);
      } else if (spent > 0) {
        initial[cat] = String(suggestBudget(spent));
      } else {
        initial[cat] = '0';
      }
    });
    setWizardAmounts(initial);
    setWizardOpen(true);
  };

  const wizardTotal = BUDGET_CATEGORIES.reduce(
    (sum, cat) => sum + (parseInt(wizardAmounts[cat] ?? '0', 10) || 0),
    0
  );
  const paycheckAmount = paycheckTx?.amount ?? MOCK_USER.monthlyIncome;

  const NEEDS_CATS: Category[] = ['mat', 'transport'];
  const WANTS_CATS: Category[] = ['noje', 'halsa', 'shopping', 'prenumerationer'];
  const needsLastMonth = NEEDS_CATS.reduce((sum, cat) => sum + (byCategory[cat] ?? 0), 0);
  const wantsLastMonth = WANTS_CATS.reduce((sum, cat) => sum + (byCategory[cat] ?? 0), 0);

  const applyWizard = async () => {
    await Promise.all(
      BUDGET_CATEGORIES.map(async (cat) => {
        const amount = parseInt(wizardAmounts[cat] ?? '0', 10);
        if (!isNaN(amount) && amount >= 0) {
          await setBudget(cat, amount);
        }
      })
    );
    setWizardOpen(false);
    setWizardDismissed(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('budget.title')}</Text>
        </View>

        {/* Paycheck banner */}
        {showPaycheckBanner && (
          <View style={styles.paycheckBanner}>
            <View style={styles.paycheckContent}>
              <Text style={styles.paycheckText}>
                {t('budget.paycheck_banner', {
                  amount: paycheckTx!.amount.toLocaleString('sv-SE'),
                })}
              </Text>
              <TouchableOpacity
                style={styles.allocateBtn}
                onPress={openWizard}
                activeOpacity={0.85}
              >
                <Text style={styles.allocateBtnText}>{t('budget.suggest_split')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setWizardDismissed(true)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.dismissText}>{t('budget.not_now')}</Text>
            </TouchableOpacity>
          </View>
        )}

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

            const remaining = hasBudget ? budget - spent : 0;
            const isOver = remaining < 0;

            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catCard, Shadow.card]}
                onPress={() => openEdit(cat)}
                activeOpacity={0.8}
              >
                <View style={styles.catTop}>
                  <View style={styles.catLeft}>
                    <View style={[styles.catDot, { backgroundColor: catColor }]} />
                    <Text style={styles.catName} numberOfLines={1} ellipsizeMode="tail">
                      {getCategoryLabel(cat, t)}
                    </Text>
                  </View>
                  <Text style={styles.catEdit}>{t('budget.edit_budget')}</Text>
                </View>

                {hasBudget ? (
                  <>
                    <View style={styles.barBg}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${Math.min(pct, 100)}%`, backgroundColor: color },
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
                    {spent > 0
                      ? `${spent.toLocaleString('sv-SE')} kr — ${t('budget.no_budget')}`
                      : t('budget.no_budget')}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Single category edit modal */}
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

      {/* Paycheck wizard modal */}
      <Modal
        visible={wizardOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setWizardOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setWizardOpen(false)}
            activeOpacity={1}
          />
          <View style={[styles.modalSheet, styles.wizardSheet]}>
            <View style={styles.modalHandle} />

            {/* Wizard header summary */}
            <View style={styles.wizardHeader}>
              <Text style={styles.wizardHeaderPaycheck}>
                {t('budget.wizard_paycheck_header', { amount: paycheckAmount.toLocaleString('sv-SE') })}
              </Text>
              <View style={styles.wizardHeaderRow}>
                <Text style={styles.wizardHeaderLabel}>{t('budget.wizard_needs_label')}</Text>
                <Text style={styles.wizardHeaderValue}>{needsLastMonth.toLocaleString('sv-SE')} kr</Text>
              </View>
              <View style={styles.wizardHeaderRow}>
                <Text style={styles.wizardHeaderLabel}>{t('budget.wizard_wants_label')}</Text>
                <Text style={styles.wizardHeaderValue}>{wantsLastMonth.toLocaleString('sv-SE')} kr</Text>
              </View>
              <View style={[styles.wizardHeaderRow, styles.wizardHeaderTarget]}>
                <Text style={styles.wizardTargetText}>{t('budget.wizard_target')}</Text>
              </View>
            </View>

            <FlatList
              data={BUDGET_CATEGORIES}
              keyExtractor={(item) => item}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
              renderItem={({ item: cat }) => {
                const catColor = CATEGORY_COLORS[cat] ?? Colors.accent;
                return (
                  <View style={styles.wizardRow}>
                    <View style={styles.wizardRowLeft}>
                      <View style={styles.wizardCatTop}>
                        <View style={[styles.catDot, { backgroundColor: catColor }]} />
                        <Text style={styles.wizardCatName} numberOfLines={1}>
                          {getCategoryLabel(cat, t)}
                        </Text>
                      </View>
                      {(byCategory[cat] ?? 0) > 0 && (
                        <Text style={styles.wizardLastMonth}>
                          {t('budget.wizard_last_month', { amount: (byCategory[cat] ?? 0).toLocaleString('sv-SE') })}
                          {' → '}
                          {t('budget.wizard_suggested', { amount: suggestBudget(byCategory[cat] ?? 0).toLocaleString('sv-SE') })}
                        </Text>
                      )}
                    </View>
                    <View style={styles.wizardInputWrap}>
                      <TextInput
                        style={styles.wizardInput}
                        value={wizardAmounts[cat] ?? '0'}
                        onChangeText={(v) => setWizardAmounts((prev) => ({ ...prev, [cat]: v }))}
                        keyboardType="number-pad"
                        selectTextOnFocus
                      />
                      <Text style={styles.wizardKr}>kr</Text>
                    </View>
                  </View>
                );
              }}
            />

            {/* Live allocation bar */}
            <View style={styles.allocationWrap}>
              <View style={styles.allocationLabelRow}>
                <Text style={styles.allocationLabel}>
                  {t('budget.wizard_allocated', {
                    allocated: wizardTotal.toLocaleString('sv-SE'),
                    total: paycheckAmount.toLocaleString('sv-SE'),
                  })}
                </Text>
                {wizardTotal > paycheckAmount && (
                  <Text style={styles.allocationOver}>{t('budget.wizard_over')}</Text>
                )}
              </View>
              <View style={styles.allocationTrack}>
                <View
                  style={[
                    styles.allocationFill,
                    {
                      width: `${Math.min((wizardTotal / paycheckAmount) * 100, 100)}%`,
                      backgroundColor: wizardTotal > paycheckAmount ? Colors.danger : Colors.positive,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setWizardOpen(false)}
                activeOpacity={0.75}
              >
                <Text style={styles.cancelBtnText}>{t('budget.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={applyWizard} activeOpacity={0.85}>
                <Text style={styles.saveBtnText}>{t('budget.apply_all')}</Text>
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

  // Paycheck banner
  paycheckBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.accentSoft,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  paycheckContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  paycheckText: {
    flex: 1,
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.accent,
  },
  allocateBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    ...Shadow.accent,
  },
  allocateBtnText: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.white,
  },
  dismissText: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.muted,
    textAlign: 'right',
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
    flex: 1,
    minWidth: 0,
  },
  catDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  catName: {
    fontFamily: Typography.semibold,
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  catEdit: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.accent,
    flexShrink: 0,
    marginLeft: Spacing.sm,
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

  // Shared modal styles
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
  wizardSheet: {
    maxHeight: '85%',
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

  // Wizard header
  wizardHeader: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  wizardHeaderPaycheck: {
    fontFamily: Typography.bold,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  wizardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wizardHeaderLabel: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
  },
  wizardHeaderValue: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.text,
  },
  wizardHeaderTarget: {
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  wizardTargetText: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.muted,
    fontStyle: 'italic',
  },

  // Allocation bar
  allocationWrap: {
    gap: 6,
  },
  allocationLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allocationLabel: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.muted,
  },
  allocationOver: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    color: Colors.danger,
  },
  allocationTrack: {
    height: 6,
    backgroundColor: Colors.surface2,
    borderRadius: 3,
    overflow: 'hidden',
  },
  allocationFill: {
    height: 6,
    borderRadius: 3,
  },

  // Wizard rows
  wizardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  wizardRowLeft: {
    flex: 1,
    gap: 3,
  },
  wizardCatTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  wizardCatName: {
    flex: 1,
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.text,
  },
  wizardLastMonth: {
    fontFamily: Typography.regular,
    fontSize: 11,
    color: Colors.muted,
  },
  wizardInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  wizardInput: {
    fontFamily: Typography.semibold,
    fontSize: 15,
    color: Colors.text,
    minWidth: 60,
    textAlign: 'right',
  },
  wizardKr: {
    fontFamily: Typography.regular,
    fontSize: 13,
    color: Colors.muted,
  },
});
