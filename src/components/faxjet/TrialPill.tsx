import { Text, View } from 'react-native';
import { colors } from '@/theme/tokens';

export type TrialPillProps = {
  label: string;
  tone?: 'warning' | 'danger';
};

export function TrialPill({ label, tone = 'warning' }: TrialPillProps) {
  const palette =
    tone === 'danger'
      ? { bg: colors.errorBg, fg: colors.error }
      : { bg: colors.amber100, fg: colors.warning };
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 9999,
        backgroundColor: palette.bg,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: palette.fg,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
