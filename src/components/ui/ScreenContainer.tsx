import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import {
  SafeAreaView,
  type Edge,
} from 'react-native-safe-area-context';
import { colors } from '@/theme/tokens';

export type ScreenContainerProps = {
  children: ReactNode;
  background?: string;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  unsafe?: boolean;
};

export function ScreenContainer({
  children,
  background = colors.gray50,
  edges = ['top', 'bottom'],
  style,
  unsafe = false,
}: ScreenContainerProps) {
  if (unsafe) {
    return (
      <View
        style={[{ flex: 1, backgroundColor: background }, style]}
      >
        {children}
      </View>
    );
  }
  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: background }, style]}
    >
      {children}
    </SafeAreaView>
  );
}
