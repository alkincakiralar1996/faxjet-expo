import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Icon, type IconName } from '@/icons/Icon';
import { shadows } from '@/theme/shadows';
import { HapticPressable } from './HapticPressable';

export type ButtonKind = 'primary' | 'secondary' | 'tertiary' | 'ghost';

export type ButtonProps = {
  kind?: ButtonKind;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  iconPosition?: 'leading' | 'trailing';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  haptic?: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' | 'selection';
  testID?: string;
};

const STYLES: Record<
  ButtonKind,
  {
    bg: string;
    fg: string;
    border: string;
    disabledBg: string;
    disabledFg: string;
    elevated: boolean;
  }
> = {
  primary: {
    bg: '#FFB020',
    fg: '#0A0A0A',
    border: 'transparent',
    disabledBg: '#D1D5DB',
    disabledFg: '#6B7280',
    elevated: true,
  },
  secondary: {
    bg: 'transparent',
    fg: '#0F3D2E',
    border: '#1B5E47',
    disabledBg: 'transparent',
    disabledFg: '#6B7280',
    elevated: false,
  },
  tertiary: {
    bg: 'transparent',
    fg: '#1B5E47',
    border: 'transparent',
    disabledBg: 'transparent',
    disabledFg: '#6B7280',
    elevated: false,
  },
  ghost: {
    bg: '#F3F4F6',
    fg: '#3F3F46',
    border: 'transparent',
    disabledBg: '#F3F4F6',
    disabledFg: '#6B7280',
    elevated: false,
  },
};

export function Button({
  kind = 'primary',
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'leading',
  fullWidth = true,
  style,
  haptic,
  testID,
}: ButtonProps) {
  const s = STYLES[kind];
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    height: kind === 'tertiary' ? 48 : 56,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: isDisabled ? s.disabledBg : s.bg,
    borderWidth: kind === 'secondary' ? 1.5 : 0,
    borderColor: isDisabled && kind === 'secondary' ? '#D1D5DB' : s.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    width: fullWidth ? '100%' : undefined,
    ...(s.elevated && !isDisabled ? shadows.cta : null),
  };

  const fg = isDisabled ? s.disabledFg : s.fg;
  const defaultHaptic = kind === 'primary' ? 'medium' : 'light';

  return (
    <HapticPressable
      onPress={isDisabled ? undefined : onPress}
      haptic={isDisabled ? false : (haptic ?? defaultHaptic)}
      style={[containerStyle, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={label}
      testID={testID}
    >
      {icon && iconPosition === 'leading' ? (
        <Icon name={icon} size={20} color={fg} />
      ) : null}
      <Text
        style={{
          color: fg,
          fontSize: 17,
          fontWeight: '600',
          letterSpacing: -0.17,
        }}
      >
        {label}
      </Text>
      {icon && iconPosition === 'trailing' ? (
        <Icon name={icon} size={20} color={fg} />
      ) : null}
      {loading ? (
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: fg,
            borderTopColor: 'transparent',
          }}
        />
      ) : null}
    </HapticPressable>
  );
}
