// Ekkies Design System
// All colors, typography, spacing in one place.
// Change here → changes everywhere.

export const Colors = {
  // Backgrounds
  bg: '#0F1A12',
  surface: '#162019',
  surface2: '#1C2A1F',
  border: '#2A3D2D',

  // Brand
  green: '#4CAF72',
  greenDim: '#1E3D28',
  greenGlow: 'rgba(76, 175, 114, 0.10)',

  // Accent
  gold: '#C8963E',
  goldDim: 'rgba(200, 150, 62, 0.15)',

  // Text
  text: '#E8EDE9',
  muted: '#6B7D6C',
  subtle: '#3D4F3E',

  // Semantic
  positive: '#4CAF72',
  warning: '#C8963E',
  negative: '#E05555',

  // White / overlays
  white: '#FFFFFF',
  overlay: 'rgba(15, 26, 18, 0.85)',
};

export const Typography = {
  // Display — Lora serif for headings
  display: 'Lora_600SemiBold',
  displayItalic: 'Lora_400Regular_Italic',

  // Body — DM Sans for UI
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  light: 'DMSans_300Light',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
};
