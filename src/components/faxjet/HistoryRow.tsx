import { Text, View } from 'react-native';
import { Icon } from '@/icons/Icon';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { colors } from '@/theme/tokens';
import { statusColors } from '@/theme/statusColors';
import { formatFaxTimestamp } from '@/lib/format';
import type { Fax } from '@/types/fax';

export type HistoryRowProps = {
  fax: Fax;
  isLast?: boolean;
  onPress?: () => void;
};

export function HistoryRow({ fax, isLast = false, onPress }: HistoryRowProps) {
  const c = statusColors[fax.status];
  const iconColor = {
    delivered: colors.green700,
    pending: colors.warning,
    failed: colors.error,
  }[fax.status];

  return (
    <HapticPressable
      haptic="light"
      onPress={onPress}
      pressOpacity={0.6}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        height: 72,
        paddingHorizontal: 16,
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: colors.gray100,
      }}
      accessibilityRole="button"
      accessibilityLabel={`${fax.recipientLabel}, ${c.label}`}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: c.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="doc-fill" size={20} color={iconColor} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.black,
          }}
          numberOfLines={1}
        >
          {fax.recipientLabel}
        </Text>
        <Text style={{ fontSize: 13, color: colors.gray500 }}>
          {formatFaxTimestamp(fax.sentAt)} · {fax.pages}{' '}
          {fax.pages === 1 ? 'page' : 'pages'}
        </Text>
      </View>
      <StatusBadge status={fax.status} />
    </HapticPressable>
  );
}
