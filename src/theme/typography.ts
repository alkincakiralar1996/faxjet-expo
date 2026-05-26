import { Platform, type TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Inter',
  default: 'System',
}) as string;

type Type = TextStyle & { fontFamily: string };

export const type = {
  display: {
    fontFamily,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.68,
  },
  title1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.56,
  },
  title2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.22,
  },
  title3: {
    fontFamily,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.17,
  },
  body: { fontFamily, fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyBold: { fontFamily, fontSize: 16, fontWeight: '600', lineHeight: 24 },
  callout: { fontFamily, fontSize: 15, fontWeight: '400', lineHeight: 20 },
  caption: { fontFamily, fontSize: 13, fontWeight: '400', lineHeight: 18 },
  captionBold: { fontFamily, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  footnote: { fontFamily, fontSize: 11, fontWeight: '400', lineHeight: 14 },
} as const satisfies Record<string, Type>;

export type TypeToken = keyof typeof type;
