import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

interface Props {
  label: string;
  amount: number;
  max: number;
  color: string;
}

export default function CategoryBar({ label, amount, max, color }: Props) {
  const pct = max > 0 ? Math.min((amount / max) * 100, 100) : 0;

  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
          {label}
        </Text>
        <Text style={styles.amount}>{amount.toLocaleString('sv-SE')} kr</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  label: {
    flex: 1,
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.text,
  },
  amount: {
    fontFamily: Typography.semibold,
    fontSize: 13,
    color: Colors.text,
    flexShrink: 0,
  },
  track: {
    height: 5,
    backgroundColor: Colors.surface2,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
