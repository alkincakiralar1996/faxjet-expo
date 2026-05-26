import { useEffect, useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/icons/Icon';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { Button } from '@/components/ui/Button';
import { IllustrationSpeed } from '@/components/illustrations/IllustrationSpeed';
import { IllustrationScan } from '@/components/illustrations/IllustrationScan';
import { IllustrationTrust } from '@/components/illustrations/IllustrationTrust';
import { colors } from '@/theme/tokens';

type Slide = {
  headline: string;
  body: string;
  cta: string;
  showTrust?: boolean;
  illustration: React.ComponentType;
};

const SLIDES: Slide[] = [
  {
    headline: 'Send a fax in 60 seconds.',
    body: 'Snap a photo of your document, enter the fax number, hit send. We handle the rest.',
    cta: 'Continue',
    illustration: IllustrationSpeed,
  },
  {
    headline: 'Scan paper with your camera.',
    body: 'Point your phone at any document. We automatically straighten, sharpen, and convert it for fax.',
    cta: 'Continue',
    illustration: IllustrationScan,
  },
  {
    headline: 'HIPAA-compliant and secure.',
    body: 'Your documents are encrypted in transit. Trusted by medical, legal, and financial professionals.',
    cta: 'See Plans',
    showTrust: true,
    illustration: IllustrationTrust,
  },
];

const TRUST_BADGES: {
  icon: 'lock-shield' | 'check-circle' | 'shield';
  label: string;
}[] = [
  { icon: 'lock-shield', label: 'HIPAA Compliant' },
  { icon: 'check-circle', label: 'Delivery Confirmed' },
  { icon: 'shield', label: '256-bit Encryption' },
];

export default function Carousel() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const offset = useSharedValue(0);
  const startOffset = useSharedValue(0);

  useEffect(() => {
    offset.value = withTiming(-idx * width, { duration: 220 });
  }, [idx, width, offset]);

  const handleNext = () => {
    if (idx < SLIDES.length - 1) setIdx(idx + 1);
    else router.push('/(onboarding)/segmentation');
  };

  const handleIndexFromPan = (next: number) => {
    setIdx(Math.max(0, Math.min(SLIDES.length - 1, next)));
  };

  /* eslint-disable react-hooks/immutability -- Reanimated SharedValue writes inside worklet gesture callbacks are the canonical API. */
  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .onBegin(() => {
      startOffset.value = offset.value;
    })
    .onUpdate((e) => {
      offset.value = startOffset.value + e.translationX;
    })
    .onEnd((e) => {
      const projected =
        startOffset.value + e.translationX + e.velocityX * 0.15;
      const next = Math.max(
        0,
        Math.min(SLIDES.length - 1, Math.round(-projected / width)),
      );
      // Always snap offset back to the target slide so a sub-threshold swipe
      // doesn't leave the track partially translated.
      offset.value = withTiming(-next * width, { duration: 220 });
      runOnJS(handleIndexFromPan)(next);
    });
  /* eslint-enable react-hooks/immutability */

  const trackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const current = SLIDES[idx]!;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.gray50,
        paddingTop: insets.top,
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: insets.top + 8,
          right: 20,
          zIndex: 10,
        }}
      >
        <HapticPressable
          haptic="light"
          onPress={() => router.push('/(onboarding)/segmentation')}
          style={{ padding: 8 }}
        >
          <Text style={{ fontSize: 16, color: colors.gray500 }}>Skip</Text>
        </HapticPressable>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
          marginTop: 40,
        }}
      >
        {SLIDES.map((_, i) => (
          <Dot key={i} active={i === idx} />
        ))}
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              width: width * SLIDES.length,
              flex: 1,
            },
            trackStyle,
          ]}
        >
          {SLIDES.map((slide, i) => {
            const Illustration = slide.illustration;
            return (
              <View
                key={i}
                style={{
                  width,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingTop: 32,
                }}
              >
                <View
                  style={{
                    height: 360,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Illustration />
                </View>
                <View
                  style={{ paddingHorizontal: 32, alignItems: 'center' }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: '700',
                      color: colors.black,
                      textAlign: 'center',
                      letterSpacing: -0.56,
                      marginBottom: 12,
                      lineHeight: 34,
                    }}
                  >
                    {slide.headline}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.gray700,
                      textAlign: 'center',
                      lineHeight: 24,
                    }}
                  >
                    {slide.body}
                  </Text>
                  {slide.showTrust ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 8,
                        marginTop: 24,
                      }}
                    >
                      {TRUST_BADGES.map((b) => (
                        <View
                          key={b.label}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 9999,
                            backgroundColor: colors.green100,
                          }}
                        >
                          <Icon
                            name={b.icon}
                            size={14}
                            color={colors.green700}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '600',
                              color: colors.green700,
                            }}
                          >
                            {b.label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}
        </Animated.View>
      </GestureDetector>

      <View
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: insets.bottom + 32,
        }}
      >
        <Button label={current.cta} onPress={handleNext} />
      </View>
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  return (
    <Animated.View
      style={{
        height: 6,
        borderRadius: 9999,
        width: active ? 20 : 6,
        backgroundColor: active ? colors.green700 : colors.gray300,
      }}
    />
  );
}
