import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '@/components/ui/IconButton';
import { TopBar } from '@/components/ui/TopBar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/icons/Icon';
import { PlanCard } from '@/components/faxjet/PlanCard';
import { PaperPlane } from '@/components/faxjet/PaperPlane';
import { colors } from '@/theme/tokens';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { trigger } from '@/hooks/useHaptics';
import type { Plan } from '@/types/subscription';

const FEATURES = [
  'Send unlimited faxes anywhere in the US',
  'Delivery confirmation for every fax',
  'Your fax history is still saved',
];

const CTA: Record<Plan, string> = {
  single: 'Send 1 Fax for $4.99',
  weekly: 'Resubscribe for $9.99/week',
  monthly: 'Resubscribe for $19.99/month',
};

export default function ReengagePaywall() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const resubscribe = useSubscriptionStore((s) => s.resubscribe);
  const [selected, setSelected] = useState<Plan>('weekly');
  const [busy, setBusy] = useState(false);
  const purchaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (purchaseTimer.current) clearTimeout(purchaseTimer.current);
    },
    [],
  );

  const handlePurchase = () => {
    if (busy) return;
    setBusy(true);
    trigger('medium');
    if (purchaseTimer.current) clearTimeout(purchaseTimer.current);
    purchaseTimer.current = setTimeout(() => {
      resubscribe(selected);
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
        left={
          <IconButton
            name="x"
            size={22}
            color={colors.gray500}
            onPress={() => router.replace('/(app)')}
          />
        }
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 12,
        }}
      >
        {/* Soft hero card */}
        <View
          style={{
            backgroundColor: colors.green100,
            borderRadius: 24,
            padding: 18,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            borderWidth: 1,
            borderColor: '#CFE8DA',
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: colors.green900,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PaperPlane size={42} angle={-22} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '600',
                color: colors.black,
                letterSpacing: -0.22,
              }}
            >
              Welcome back.
            </Text>
            <Text style={{ fontSize: 15, color: colors.gray700 }}>
              Pick up where you left off. Send your next fax now.
            </Text>
          </View>
        </View>

        <View style={{ gap: 10, marginBottom: 18 }}>
          {FEATURES.map((f) => (
            <View
              key={f}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 9999,
                  backgroundColor: colors.green100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="check" size={14} color={colors.green700} />
              </View>
              <Text
                style={{ fontSize: 16, color: colors.black, flex: 1 }}
              >
                {f}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ gap: 10 }}>
          <PlanCard
            plan="single"
            variant="decoy"
            selected={selected === 'single'}
            onSelect={() => setSelected('single')}
          />
          <PlanCard
            plan="weekly"
            variant="weeklyReturn"
            selected={selected === 'weekly'}
            onSelect={() => setSelected('weekly')}
          />
          <PlanCard
            plan="monthly"
            variant="monthly"
            selected={selected === 'monthly'}
            onSelect={() => setSelected('monthly')}
          />
        </View>

        <View style={{ flex: 1 }} />

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
            <Text
              style={{ fontSize: 17, fontWeight: '600', color: colors.black }}
            >
              Processing…
            </Text>
          </View>
        ) : (
          <Button label={CTA[selected]} onPress={handlePurchase} />
        )}

        <Text
          style={{
            fontSize: 11,
            color: colors.gray500,
            textAlign: 'center',
            marginTop: 12,
          }}
        >
          Cancel anytime. Same trusted FaxJet you used before.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 16,
            marginTop: 10,
          }}
        >
          {['Restore Purchases', 'Terms', 'Privacy'].map((t) => (
            <Text
              key={t}
              style={{
                fontSize: 11,
                color: colors.gray500,
                textDecorationLine: 'underline',
              }}
            >
              {t}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
