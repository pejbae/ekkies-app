import Svg, { Path, Circle } from 'react-native-svg';

type Props = { color: string; size?: number };

export function BudgetIcon({ color, size = 20 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Pie chart outline */}
      <Path
        d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
        stroke={color}
        strokeWidth={1.75}
      />
      {/* Pie slice — food segment */}
      <Path
        d="M12 12L12 2C14.652 2 17.196 3.054 19.071 4.929"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <Path
        d="M12 12L19.071 4.929"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </Svg>
  );
}
