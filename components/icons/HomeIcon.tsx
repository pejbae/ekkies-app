import Svg, { Path } from 'react-native-svg';

type Props = { color: string; size?: number };

export function HomeIcon({ color, size = 20 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
