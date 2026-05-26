import type { ReactNode } from 'react';
import { View } from 'react-native';
import { colors } from '@/theme/tokens';

export type TopBarProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  dark?: boolean;
};

export function TopBar({ left, center, right, dark = false }: TopBarProps) {
  return (
    <View
      style={{
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        position: 'relative',
        backgroundColor: dark ? 'transparent' : 'transparent',
      }}
    >
      <View
        style={{
          minWidth: 44,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {left}
      </View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {center}
      </View>
      <View
        style={{
          minWidth: 44,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {right}
      </View>
      {/* visual-only ref to colors to keep tree-shake happy when no dark variant used */}
      {dark ? <View style={{ width: 0, backgroundColor: colors.black }} /> : null}
    </View>
  );
}
