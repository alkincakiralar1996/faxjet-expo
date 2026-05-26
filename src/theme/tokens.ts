export const colors = {
  green900: '#0F3D2E',
  green700: '#1B5E47',
  green500: '#2E8B5E',
  green100: '#E8F5EF',
  amber500: '#FFB020',
  amber100: '#FFF4DD',
  black: '#0A0A0A',
  gray700: '#3F3F46',
  gray500: '#6B7280',
  gray300: '#D1D5DB',
  gray100: '#F3F4F6',
  gray50: '#FAFAF7',
  white: '#FFFFFF',
  success: '#10B981',
  error: '#DC2626',
  errorBg: '#FEE2E2',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

export type ColorToken = keyof typeof colors;

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
