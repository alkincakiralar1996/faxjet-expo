import { forwardRef } from 'react';
import {
  Pressable,
  type PressableProps,
  type View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { trigger, type HapticKind } from '@/hooks/useHaptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type HapticPressableProps = PressableProps & {
  haptic?: HapticKind | false;
  pressScale?: number;
  pressOpacity?: number;
};

export const HapticPressable = forwardRef<View, HapticPressableProps>(
  function HapticPressable(
    {
      haptic = 'light',
      pressScale = 0.98,
      pressOpacity = 0.9,
      onPressIn,
      onPressOut,
      onPress,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    return (
      <AnimatedPressable
        ref={ref as never}
        onPressIn={(e) => {
          scale.value = withTiming(pressScale, { duration: 80 });
          opacity.value = withTiming(pressOpacity, { duration: 80 });
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.value = withTiming(1, { duration: 120 });
          opacity.value = withTiming(1, { duration: 120 });
          onPressOut?.(e);
        }}
        onPress={(e) => {
          if (haptic) trigger(haptic);
          onPress?.(e);
        }}
        style={[animatedStyle, style as never]}
        {...rest}
      >
        {children as never}
      </AnimatedPressable>
    );
  },
);
