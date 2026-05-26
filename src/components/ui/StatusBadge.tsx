import { Text, View } from 'react-native';
import { statusColors, type FaxStatus } from '@/theme/statusColors';

export type StatusBadgeProps = {
  status: FaxStatus;
  label?: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const c = statusColors[status];
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 9999,
        backgroundColor: c.bg,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: '700', color: c.fg }}>
        {label ?? c.label}
      </Text>
    </View>
  );
}
