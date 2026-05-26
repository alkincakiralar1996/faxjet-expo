import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { PaperPlane } from '@/components/faxjet/PaperPlane';
import { colors } from '@/theme/tokens';
import { useUserStore } from '@/stores/userStore';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setSeen = useUserStore((s) => s.setHasSeenWelcome);
  const reduce = useReduceMotion();
  const float = useSharedValue(0);

  useEffect(() => {
    if (reduce) return;
    float.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [reduce, float]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -8 + float.value * 16 }],
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.green900,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar style="light" />
      <View
        style={{
          marginTop: 100,
          alignItems: 'center',
          gap: 14,
        }}
      >
        <Image
          source={require('@/assets/images/icon.png')}
          style={{
            width: 88,
            height: 88,
            borderRadius: 20,
          }}
        />
        <Text
          style={{
            fontSize: 32,
            fontWeight: '700',
            color: '#FFFFFF',
            letterSpacing: -0.64,
          }}
        >
          FaxJet
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View style={floatStyle}>
          <PaperPlane size={260} angle={-22} />
        </Animated.View>
      </View>

      <View style={{ padding: 24, paddingBottom: 40 }}>
        <Text
          style={{
            fontSize: 34,
            fontWeight: '700',
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: -0.68,
            marginBottom: 12,
            lineHeight: 40,
          }}
        >
          Send a fax from your phone.
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.75)',
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 24,
          }}
        >
          No machine. No store. Done in 60 seconds.
        </Text>
        <Button
          label="Get Started"
          onPress={() => {
            setSeen(true);
            router.push('/(onboarding)/carousel');
          }}
        />
      </View>
    </View>
  );
}
