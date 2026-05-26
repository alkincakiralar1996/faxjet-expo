import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { shadows, type ShadowToken } from '@/theme/shadows';

export type CardProps = {
  children: ReactNode;
  shadow?: ShadowToken | 'none';
  radius?: number;
  padding?: number;
  background?: string;
  style?: StyleProp<ViewStyle>;
};

export function Card({
  children,
  shadow = 'sm',
  radius = 16,
  padding = 20,
  background = '#FFFFFF',
  style,
}: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: background,
          borderRadius: radius,
          padding,
        },
        shadow !== 'none' ? shadows[shadow] : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}
