// Ekkies Design System — Rebuilt
// Klarna-meets-Notion: clean white, bold pink accent, great typography.

export const Colors = {
  // Backgrounds
  bg: '#FAF9F7',
  surface: '#F0EFEC',
  surface2: '#E5E3DF',
  border: '#E8E8E6',

  // Accent — the bold pop
  accent: '#FF2D7A',
  accentSoft: '#FFF0F5',
  accentDim: 'rgba(255, 45, 122, 0.12)',

  // Text
  text: '#0D0D0D',
  muted: '#6B6B6B',
  subtle: '#B0B0B0',

  // Semantic
  positive: '#00C48C',
  positiveSoft: '#E8FAF4',
  warning: '#FF9500',
  warningSoft: '#FFF4E0',
  danger: '#FF3B30',
  dangerSoft: '#FFF0EF',

  // Utility
  white: '#FFFFFF',
  black: '#0D0D0D',
  overlay: 'rgba(0,0,0,0.5)',
};

export const Typography = {
  // Plus Jakarta Sans — all weights
  display: 'PlusJakartaSans_800ExtraBold',
  bold: 'PlusJakartaSans_700Bold',
  semibold: 'PlusJakartaSans_600SemiBold',
  medium: 'PlusJakartaSans_500Medium',
  regular: 'PlusJakartaSans_400Regular',
  // PJS has no 300 Light — map to regular
  light: 'PlusJakartaSans_400Regular',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  accent: {
    shadowColor: '#FF2D7A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  fab: {
    shadowColor: '#FF2D7A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
};
