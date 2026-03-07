import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Typography } from '@/constants/theme';

interface Segment {
  value: number;
  color: string;
}

interface Props {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerColor?: string;
  trackColor?: string;
}

export default function RingChart({
  segments,
  size = 120,
  strokeWidth = 12,
  centerLabel,
  centerColor = '#0D0D0D',
  trackColor = '#E5E3DF',
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  let accumulated = 0;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Track ring */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {total > 0 &&
          segments.map((seg, i) => {
            const fraction = seg.value / total;
            const dashLength = fraction * circumference;
            // Rotate so each segment starts where the previous ended.
            // Default SVG stroke starts at 3 o'clock → rotate by -90° to start at 12 o'clock.
            const startAngle = (accumulated / total) * 360 - 90;
            accumulated += seg.value;

            return (
              <Circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeLinecap="butt"
                transform={`rotate(${startAngle}, ${center}, ${center})`}
              />
            );
          })}
      </Svg>
      {centerLabel != null && (
        <Text
          style={{
            fontFamily: Typography.bold,
            fontSize: size * 0.15,
            color: centerColor,
            letterSpacing: -0.5,
          }}
        >
          {centerLabel}
        </Text>
      )}
    </View>
  );
}
