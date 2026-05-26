import { Text, View } from 'react-native';
import { Icon, type IconName } from '@/icons/Icon';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { colors } from '@/theme/tokens';

export type SettingsRowProps = {
  icon: IconName;
  label: string;
  detail?: string;
  isLast?: boolean;
  onPress?: () => void;
};

export function SettingsRow({
  icon,
  label,
  detail,
  isLast = false,
  onPress,
}: SettingsRowProps) {
  return (
    <HapticPressable
      haptic="light"
      onPress={onPress}
      pressOpacity={0.6}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: colors.gray100,
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          backgroundColor: colors.green100,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={16} color={colors.green700} />
      </View>
      <Text
        style={{ flex: 1, fontSize: 16, color: colors.black }}
      >
        {label}
      </Text>
      {detail ? (
        <Text style={{ fontSize: 13, color: colors.gray500 }}>{detail}</Text>
      ) : null}
      <Icon name="chevron-right" size={16} color={colors.gray300} />
    </HapticPressable>
  );
}

export function SettingsGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: colors.gray500,
          letterSpacing: 1,
          paddingHorizontal: 4,
          paddingBottom: 8,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        {children}
      </View>
    </View>
  );
}
