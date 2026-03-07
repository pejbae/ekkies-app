export type WidgetId =
  | 'safe_to_spend'
  | 'sparrunda'
  | 'budget_overview'
  | 'recent_transactions'
  | 'month_health'
  | 'subscriptions';

export const DEFAULT_WIDGET_ORDER: WidgetId[] = [
  'safe_to_spend',
  'sparrunda',
  'budget_overview',
  'recent_transactions',
  'month_health',
  'subscriptions',
];

export const WIDGET_META: Record<WidgetId, { labelKey: string; icon: string }> = {
  safe_to_spend:       { labelKey: 'widgets.safe_to_spend', icon: '💰' },
  sparrunda:           { labelKey: 'widgets.sparrunda',     icon: '✦'  },
  budget_overview:     { labelKey: 'widgets.budget',        icon: '📊' },
  recent_transactions: { labelKey: 'widgets.recent',        icon: '📋' },
  month_health:        { labelKey: 'widgets.month_health',  icon: '❤️' },
  subscriptions:       { labelKey: 'widgets.subscriptions', icon: '🔄' },
};
