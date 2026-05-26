import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon, type IconName } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { trigger } from '@/hooks/useHaptics';
import { shadows } from '@/theme/shadows';

export type BannerTone = 'warning' | 'danger' | 'info';

export type BannerProps = {
  tone?: BannerTone;
  icon: IconName;
  label: string;
  action?: { label: string; onPress: () => void };
  children?: ReactNode;
};

const TONE: Record<
  BannerTone,
  { bg: string; border: string; fg: string; actionBg: string; actionFg: string }
> = {
  warning: {
    bg: colors.amber100,
    border: colors.amber500,
    fg: '#7A5300',
    actionBg: 'transparent',
    actionFg: colors.warning,
  },
  danger: {
    bg: colors.errorBg,
    border: colors.error,
    fg: '#7A1D1D',
    actionBg: colors.amber500,
    actionFg: colors.black,
  },
  info: {
    bg: colors.green100,
    border: colors.green500,
    fg: colors.green700,
    actionBg: 'transparent',
    actionFg: colors.green700,
  },
};

export function Banner({
  tone = 'warning',
  icon,
  label,
  action,
}: BannerProps) {
  const palette = TONE[tone];
  return (
    <View
      style={{
        marginHorizontal: 20,
        marginTop: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: palette.bg,
        borderWidth: 1,
        borderColor: palette.border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <Icon name={icon} size={20} color={palette.fg} />
      <Text
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: '600',
          color: palette.fg,
        }}
      >
        {label}
      </Text>
      {action ? (
        <Pressable
          onPress={() => {
            trigger('light');
            action.onPress();
          }}
          style={[
            {
              height: 32,
              paddingHorizontal: 14,
              borderRadius: 8,
              backgroundColor: palette.actionBg,
              borderWidth: tone === 'danger' ? 0 : 1,
              borderColor: palette.border,
              alignItems: 'center',
              justifyContent: 'center',
            },
            tone === 'danger' ? shadows.cta : null,
          ]}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: palette.actionFg,
            }}
          >
            {action.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
