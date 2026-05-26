import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/tokens';
import { shadows } from '@/theme/shadows';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { trigger } from '@/hooks/useHaptics';

const STATS = [
  ['Faxes sent on your old plan', '47'],
  ['Pages transmitted', '184'],
  ['Average delivery', '52 seconds'],
] as const;

export default function Resubscribe() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const resubscribe = useSubscriptionStore((s) => s.resubscribe);
  const plan = useSubscriptionStore((s) => s.plan) ?? 'weekly';
  const [busy, setBusy] = useState(false);
  const purchaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (purchaseTimer.current) clearTimeout(purchaseTimer.current);
    },
    [],
  );

  const ctaLabel = {
    weekly: 'Resubscribe for $9.99/week',
    monthly: 'Resubscribe for $19.99/month',
    single: 'Buy 1 Fax for $4.99',
  }[plan];

  const handle = () => {
    if (busy) return;
    setBusy(true);
    trigger('medium');
    if (purchaseTimer.current) clearTimeout(purchaseTimer.current);
    purchaseTimer.current = setTimeout(() => {
      resubscribe(plan);
      trigger('success');
      router.replace('/(app)');
    }, 1500);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.gray50,
        paddingTop: insets.top,
      }}
    >
      <TopBar
        left={<IconButton name="chevron-left" onPress={() => router.replace('/(app)')} />}
      />
      <View style={{ paddingHorizontal: 24, alignItems: 'center', marginTop: 8 }}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 14 }}
        />
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: colors.black,
            textAlign: 'center',
            letterSpacing: -0.56,
            marginBottom: 6,
          }}
        >
          Welcome back to FaxJet.
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: colors.gray700,
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          Continue with the plan you had before.
        </Text>
      </View>

      <View style={{ padding: 20, paddingTop: 24 }}>
        {/* Pre-selected plan card */}
        <View
          style={[
            {
              backgroundColor: colors.green100,
              borderRadius: 20,
              padding: 20,
              paddingTop: 24,
              borderWidth: 2,
              borderColor: colors.green700,
              position: 'relative',
            },
            shadows.lg,
          ]}
        >
          <View
            style={{
              position: 'absolute',
              top: -10,
              left: 16,
              backgroundColor: colors.green900,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 9999,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: '#FFFFFF',
                letterSpacing: 0.88,
              }}
            >
              YOUR PREVIOUS PLAN
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: colors.black,
                  marginBottom: 4,
                }}
              >
                Unlimited Weekly
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: '600', color: colors.black }}
              >
                $9.99/week
              </Text>
              <Text
                style={{ fontSize: 13, color: colors.gray700, marginTop: 2 }}
              >
                Send unlimited faxes · cancel anytime
              </Text>
            </View>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 9999,
                borderWidth: 2,
                borderColor: colors.green700,
                backgroundColor: colors.green700,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  backgroundColor: '#FFFFFF',
                }}
              />
            </View>
          </View>
        </View>

        <Text
          style={{
            textAlign: 'center',
            marginTop: 16,
            fontSize: 16,
            fontWeight: '600',
            color: colors.green700,
          }}
        >
          See other plans
        </Text>

        {/* Stats card */}
        <View
          style={[
            {
              marginTop: 20,
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
            },
            shadows.sm,
          ]}
        >
          {STATS.map(([k, v], i) => (
            <View
              key={k}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                borderBottomWidth: i < STATS.length - 1 ? 0.5 : 0,
                borderBottomColor: colors.gray100,
              }}
            >
              <Text style={{ fontSize: 14, color: colors.gray700 }}>{k}</Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.black,
                }}
              >
                {v}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: insets.bottom + 16,
        }}
      >
        {busy ? (
          <View
            style={{
              height: 56,
              borderRadius: 12,
              backgroundColor: colors.amber500,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 12,
            }}
          >
            <ActivityIndicator color={colors.black} />
            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
              Processing…
            </Text>
          </View>
        ) : (
          <Button label={ctaLabel} onPress={handle} />
        )}
        <Text
          style={{
            fontSize: 11,
            color: colors.gray500,
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          Renews weekly. Cancel anytime from Settings.
        </Text>
      </View>
    </View>
  );
}
