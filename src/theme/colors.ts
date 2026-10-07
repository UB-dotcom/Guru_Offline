export const palette = {
  // Primary: Professional, welcoming Blue/Indigo
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  primarySurface: '#EFF6FF',

  // Secondary: Educational Growth Emerald
  secondary: '#059669',
  secondaryDark: '#047857',
  secondaryLight: '#10B981',
  secondarySurface: '#ECFDF5',

  // Warning & Danger
  warning: '#D97706',
  warningSurface: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#EF4444',
  dangerSurface: '#FEE2E2',

  // Offline / Connectivity
  offlineBadgeBg: '#059669',
  offlineBadgeText: '#FFFFFF',
  onlineBadgeBg: '#2563EB',
  onlineBadgeText: '#FFFFFF',

  // Neutrals - Light Theme
  white: '#FFFFFF',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  black: '#000000',
};

export const lightColors = {
  primary: palette.primary,
  primaryDark: palette.primaryDark,
  primaryLight: palette.primaryLight,
  primarySurface: palette.primarySurface,

  secondary: palette.secondary,
  secondaryLight: palette.secondaryLight,
  secondarySurface: palette.secondarySurface,

  background: palette.gray50,
  cardBackground: palette.white,
  surface: palette.white,

  textPrimary: palette.gray900,
  textSecondary: palette.gray500,
  textMuted: palette.gray400,
  textInverse: palette.white,

  border: palette.gray200,
  borderFocus: palette.primary,
  divider: palette.gray100,

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
