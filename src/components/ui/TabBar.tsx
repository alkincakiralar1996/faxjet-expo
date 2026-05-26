import { Text, View } from 'react-native';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/icons/Icon';
import { HapticPressable } from './HapticPressable';
import { colors } from '@/theme/tokens';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const TAB_META: Record<
  string,
  { label: string; icon: IconName; activeIcon: IconName }
> = {
  '(home)': { label: 'Home', icon: 'home', activeIcon: 'home-fill' },
  '(history)': { label: 'History', icon: 'list', activeIcon: 'list' },
  '(settings)': { label: 'Settings', icon: 'gear', activeIcon: 'gear' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0.5,
        borderTopColor: colors.gray300,
        height: 49 + (insets.bottom > 0 ? insets.bottom : 8),
      }}
    >
      {state.routes.map((route, i) => {
        const meta = TAB_META[route.name];
        if (!meta) return null;
        const active = state.index === i;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!active && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params as never);
          }
        };
        return (
          <TabItem
            key={route.key}
            label={meta.label}
            icon={active ? meta.activeIcon : meta.icon}
            active={active}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}

function TabItem({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: IconName;
  active: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(active ? 1.1 : 1);
  useEffect(() => {
    scale.value = withTiming(active ? 1.1 : 1, { duration: 150 });
  }, [active, scale]);
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const color = active ? colors.green700 : colors.gray500;
  return (
    <HapticPressable
      haptic="selection"
      onPress={onPress}
      pressScale={0.96}
      pressOpacity={0.85}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 8,
        gap: 2,
      }}
    >
      <Animated.View style={iconStyle}>
        <Icon name={icon} size={24} color={color} />
      </Animated.View>
      <Text style={{ fontSize: 10, fontWeight: '500', color }}>{label}</Text>
    </HapticPressable>
  );
}
