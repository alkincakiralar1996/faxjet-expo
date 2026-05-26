import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { colors } from '@/theme/tokens';
import { trigger } from '@/hooks/useHaptics';

export type ToggleProps = {
  on: boolean;
  onChange?: (on: boolean) => void;
  disabled?: boolean;
};

export function Toggle({ on, onChange, disabled = false }: ToggleProps) {
  const x = useSharedValue(on ? 22 : 2);
  const bgProgress = useSharedValue(on ? 1 : 0);

  useEffect(() => {
    x.value = withTiming(on ? 22 : 2, { duration: 150 });
    bgProgress.value = withTiming(on ? 1 : 0, { duration: 150 });
  }, [on, x, bgProgress]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor:
      bgProgress.value > 0.5 ? colors.green500 : colors.gray300,
  }));

  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        trigger('selection');
        onChange?.(!on);
      }}
      accessibilityRole="switch"
      accessibilityState={{ checked: on, disabled }}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        style={[
          { width: 51, height: 31, borderRadius: 9999 },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 2,
              width: 27,
              height: 27,
              borderRadius: 9999,
              backgroundColor: '#FFFFFF',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 2,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
