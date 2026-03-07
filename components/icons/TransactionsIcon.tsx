import Svg, { Path, Line } from 'react-native-svg';

type Props = { color: string; size?: number };

export function TransactionsIcon({ color, size = 20 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <Path
        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z"
        stroke={color}
        strokeWidth={1.75}
      />
      <Line x1="9" y1="12" x2="15" y2="12" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Line x1="9" y1="16" x2="13" y2="16" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
    </Svg>
  );
}
