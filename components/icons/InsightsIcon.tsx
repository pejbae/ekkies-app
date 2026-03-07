import Svg, { Path, Circle } from 'react-native-svg';

type Props = { color: string; size?: number };

export function InsightsIcon({ color, size = 20 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
        stroke={color}
        strokeWidth={1.75}
      />
      <Path
        d="M12 8V12"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="16" r="0.75" fill={color} />
    </Svg>
  );
}
