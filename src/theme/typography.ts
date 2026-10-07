import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  android: 'sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

const fontBold = Platform.select({
  android: 'sans-serif-medium',
  ios: 'System',
  default: 'sans-serif-medium',
});

export const typography = {
  h1: {
    fontFamily: fontBold,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  } as TextStyle,

  h2: {
    fontFamily: fontBold,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  } as TextStyle,

  h3: {
    fontFamily: fontBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,

  h4: {
    fontFamily: fontBold,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  } as TextStyle,

  bodyLarge: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,

  body: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,

  bodySecondary: {
    fontFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  } as TextStyle,

  bodySmall: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } as TextStyle,

  caption: {
    fontFamily,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
  } as TextStyle,

  button: {
    fontFamily: fontBold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  } as TextStyle,

  code: {
    fontFamily: Platform.select({ android: 'monospace', default: 'Courier' }),
    fontSize: 13,
    lineHeight: 18,
  } as TextStyle,
};
