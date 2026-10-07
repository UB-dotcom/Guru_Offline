export const palette = {
  // Primary: Radiant Violet / Electric Purple
  primary: '#7C5CFC',
  primaryDark: '#6734E8',
  primaryLight: '#9B7EFC',
  primarySurface: '#F0EDFF',

  // Secondary: Growth Emerald
  secondary: '#10B981',
  secondaryDark: '#059669',
  secondaryLight: '#34D399',
  secondarySurface: '#ECFDF5',

  // Accents matching Lumina AI theme
  accentLilac: '#EDE7FF',
  streakFlame: '#FF7A45',
  xpPurple: '#8B5CF6',
  cyanAccent: '#00D2D3',

  // Warning & Danger
  warning: '#F59E0B',
  warningSurface: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#F87171',
  dangerSurface: '#FEE2E2',

  // Offline / Connectivity
  offlineBadgeBg: '#10B981',
  offlineBadgeText: '#FFFFFF',
  onlineBadgeBg: '#7C5CFC',
  onlineBadgeText: '#FFFFFF',

  // Neutrals - Light Theme
  white: '#FFFFFF',
  gray50: '#F6F5FB',
  gray100: '#F0EDFB',
  gray200: '#EDE9FE',
  gray300: '#D8D4EE',
  gray400: '#A19FB5',
  gray500: '#79768F',
  gray600: '#5A5770',
  gray700: '#3D3A52',
  gray800: '#2A273D',
  gray900: '#1E1B4B',
  black: '#0A081A',
};

export const lightColors = {
  primary: palette.primary,
  primaryDark: palette.primaryDark,
  primaryLight: palette.primaryLight,
  primarySurface: palette.primarySurface,

  secondary: palette.secondary,
  secondaryLight: palette.secondaryLight,
  secondarySurface: palette.secondarySurface,

  accentLilac: palette.accentLilac,
  streakFlame: palette.streakFlame,
  xpPurple: palette.xpPurple,
  cyanAccent: palette.cyanAccent,

  background: '#F6F5FB',
  cardBackground: palette.white,
  surface: palette.white,

  textPrimary: '#1E1B4B',
  textSecondary: '#79768F',
  textMuted: '#A19FB5',
  textInverse: palette.white,

  border: '#EDE9FE',
  borderFocus: palette.primary,
  divider: '#F0EDFB',

  offline: palette.secondary,
  online: palette.primary,
  error: palette.danger,
  errorSurface: palette.dangerSurface,
  success: palette.secondary,
  successSurface: palette.secondarySurface,
};

export const darkColors = {
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#60A5FA',
  primarySurface: '#1E293B',

  secondary: '#10B981',
  secondaryLight: '#34D399',
  secondarySurface: '#064E3B',

  accentLilac: '#2D274E',
  streakFlame: '#FF7A45',
  xpPurple: '#A78BFA',
  cyanAccent: '#22D3EE',

  background: '#0F172A',
  cardBackground: '#1E293B',
  surface: '#1E293B',

  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',

  border: '#334155',
  borderFocus: '#60A5FA',
  divider: '#1E293B',

  offline: '#10B981',
  online: '#3B82F6',
  error: '#EF4444',
  errorSurface: '#7F1D1D',
  success: '#10B981',
  successSurface: '#064E3B',
};

export type AppColors = typeof lightColors;
