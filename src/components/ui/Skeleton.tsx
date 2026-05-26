import { useEffect } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme/tokens';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({
  width = '100%',
  height = 12,
  radius = 6,
  style,
}: SkeletonProps) {
  const progress = useSharedValue(0);
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) return;
    progress.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.linear }),
      -1,
      false,
    );
  }, [reduceMotion, progress]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0.3 : 0.4 + 0.4 * progress.value,
    transform: [{ translateX: -100 + progress.value * 200 }],
  }));

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: colors.gray100,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 100,
            backgroundColor: '#E9EAEE',
          },
          overlayStyle,
        ]}
      />
    </View>
  );
}
