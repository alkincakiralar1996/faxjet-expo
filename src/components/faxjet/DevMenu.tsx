import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/icons/Icon';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { colors } from '@/theme/tokens';
import { useUserStore } from '@/stores/userStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useFaxStore } from '@/stores/faxStore';
import { useAppStore } from '@/stores/appStore';
import { FAX_SEED } from '@/mocks/faxSeed';

const TAP_COUNT_THRESHOLD = 3;
const TAP_WINDOW_MS = 500;

export function DevTrigger() {
  const [taps, setTaps] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

  const onTap = () => {
    const now = Date.now();
    const recent = [...taps.filter((t) => now - t < TAP_WINDOW_MS), now];
    setTaps(recent);
    if (recent.length >= TAP_COUNT_THRESHOLD) {
      setTaps([]);
      setOpen(true);
    }
  };

  return (
    <>
      <Pressable
        onPress={onTap}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        accessibilityLabel="FaxJet"
      >
        <Image
          source={require('@/assets/images/icon.png')}
          style={{ width: 28, height: 28, borderRadius: 7 }}
        />
        <Text
          style={{
            fontSize: 17,
            fontWeight: '700',
            color: colors.black,
            letterSpacing: -0.17,
          }}
        >
          FaxJet
        </Text>
      </Pressable>
      {open ? <DevMenu onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function DevMenu({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const resetOnboarding = useUserStore((s) => s.resetOnboarding);
  const resetSubscription = useSubscriptionStore((s) => s.reset);
  const setSubscribed = useSubscriptionStore((s) => s.setSubscribed);
  const isSubscribed = useSubscriptionStore((s) => s.isSubscribed);
  const resetSeed = useFaxStore((s) => s.resetSeed);
  const clearFaxes = useFaxStore((s) => s.clear);
  const addFax = useFaxStore((s) => s.addFax);
  const toggleNetErr = useAppStore((s) => s.toggleForceNetworkError);
  const forceNetErr = useAppStore((s) => s.forceNetworkError);

  const ROWS: {
    label: string;
    icon: IconName;
    action: () => void;
    danger?: boolean;
    detail?: string;
  }[] = [
    {
      label: 'Reset onboarding',
      icon: 'refresh',
      action: () => {
        resetOnboarding();
        onClose();
        router.replace('/');
      },
      danger: true,
    },
    {
      label: isSubscribed ? 'Subscribed: ON (sandbox)' : 'Subscribed: OFF (sandbox)',
      icon: 'check-circle',
      action: () => {
        setSubscribed(!isSubscribed);
      },
      detail: 'Local override for UI testing only',
    },
    {
      label: 'Reset subscription',
      icon: 'refresh',
      action: () => {
        resetSubscription();
        onClose();
      },
    },
    {
      label: forceNetErr ? 'Network error: ON' : 'Network error: OFF',
      icon: 'wifi-off',
      action: toggleNetErr,
    },
    {
      label: 'Open network error screen',
      icon: 'wifi-off',
      action: () => {
        onClose();
        router.navigate('/(app)/network-error');
      },
    },
    {
      label: 'Reset fax history (seed)',
      icon: 'list',
      action: () => {
        resetSeed();
        onClose();
      },
    },
    {
      label: 'Clear fax history',
      icon: 'list',
      action: () => {
        clearFaxes();
        onClose();
      },
      danger: true,
    },
    {
      label: 'Add fake delivered fax',
      icon: 'plus',
      action: () => {
        const seedItem = FAX_SEED[0]!;
        addFax({
          ...seedItem,
          id: `dev-${Date.now()}`,
          sentAt: new Date().toISOString(),
          deliveredAt: new Date().toISOString(),
          status: 'delivered',
          recipientLabel: 'Dev test recipient',
        });
        onClose();
      },
    },
    {
      label: 'Open paywall',
      icon: 'paperplane',
      action: () => {
        onClose();
        router.navigate('/(app)/paywall');
      },
    },
    {
      label: 'Open camera-denied screen',
      icon: 'camera',
      action: () => {
        onClose();
        router.navigate({
          pathname: '/(app)/(tabs)/(home)/send/permission-denied',
          params: { kind: 'camera' },
        });
      },
    },
    {
      label: 'Open photo-denied screen',
      icon: 'photo',
      action: () => {
        onClose();
        router.navigate({
          pathname: '/(app)/(tabs)/(home)/send/permission-denied',
          params: { kind: 'photo' },
        });
      },
    },
  ];

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(10,10,10,0.55)',
        }}
      >
        <Pressable
          accessibilityLabel="Close dev menu"
          onPress={onClose}
          style={{ flex: 1 }}
        />
      </Animated.View>

      <Animated.View
        entering={SlideInDown.duration(280)}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#1A1A1A',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 12,
          paddingBottom: insets.bottom + 16,
          maxHeight: '85%',
        }}
      >
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 9999,
            backgroundColor: 'rgba(255,255,255,0.35)',
            alignSelf: 'center',
            marginBottom: 14,
          }}
        />
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <View>
            <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '700' }}>
              Dev Menu
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
              Hidden — triple-tap FaxJet logo to open · {isSubscribed ? 'subscribed' : 'free'}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 8 }}>
          {ROWS.map((row) => (
            <HapticPressable
              haptic={row.danger ? 'warning' : 'light'}
              key={row.label}
              onPress={row.action}
              pressOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                padding: 14,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderWidth: 0.5,
                borderColor: 'rgba(255,255,255,0.12)',
              }}
            >
              <Icon
                name={row.icon}
                size={20}
                color={row.danger ? colors.error : '#FFFFFF'}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: row.danger ? colors.error : '#FFFFFF',
                  }}
                >
                  {row.label}
                </Text>
                {row.detail ? (
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.55)',
                      marginTop: 2,
                    }}
                  >
                    {row.detail}
                  </Text>
                ) : null}
              </View>
            </HapticPressable>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
