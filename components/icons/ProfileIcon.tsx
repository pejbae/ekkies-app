import Svg, { Path, Circle } from 'react-native-svg';

type Props = { color: string; size?: number };

export function ProfileIcon({ color, size = 20 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.75} />
      <Path
        d="M4 20C4 17 7.6 14 12 14C16.4 14 20 17 20 20"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </Svg>
  );
}
