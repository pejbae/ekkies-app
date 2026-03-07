import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  noPadding?: boolean;
  bgColor?: string;
}

export default function WidgetShell({
  children,
  title,
  actionLabel,
  onAction,
  noPadding,
  bgColor,
}: Props) {
  return (
    <View style={[styles.card, Shadow.card, bgColor ? { backgroundColor: bgColor } : null]}>
      {(title || actionLabel) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {actionLabel && onAction && (
            <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
              <Text style={styles.action}>{actionLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View style={noPadding ? styles.noPadding : undefined}>
        {children}
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
    overflow: 'hidden',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.muted,
  },
  action: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.accent,
  },
  noPadding: {
    marginHorizontal: -Spacing.lg,
  },
});
