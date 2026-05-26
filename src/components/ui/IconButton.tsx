import { Icon, type IconName } from '@/icons/Icon';
import { HapticPressable } from './HapticPressable';

export type IconButtonProps = {
  name: IconName;
  size?: number;
  color?: string;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
};

export function IconButton({
  name,
  size = 24,
  color = '#0A0A0A',
  onPress,
  testID,
  accessibilityLabel,
}: IconButtonProps) {
  return (
    <HapticPressable
      haptic="light"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? name}
      testID={testID}
      style={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={name} size={size} color={color} />
    </HapticPressable>
  );
}
