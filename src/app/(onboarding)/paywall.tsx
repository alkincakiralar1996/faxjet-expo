import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '@/components/ui/IconButton';
import { TopBar } from '@/components/ui/TopBar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/icons/Icon';
import { PlanCard } from '@/components/faxjet/PlanCard';
import { colors } from '@/theme/tokens';
import { useUserStore } from '@/stores/userStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { trigger } from '@/hooks/useHaptics';
import type { Plan } from '@/types/subscription';

type SegmentKey = 'medical' | 'legal' | 'business' | 'tax' | 'other';

const HEADLINES: Record<'medical' | 'legal' | 'default', string> = {
  medical: 'Send HIPAA-compliant faxes from your phone.',
  legal: 'Send legal documents securely from your phone.',
  default: 'Send unlimited faxes from your phone.',
};

const FEATURES = [
  'Send unlimited faxes anywhere in the US',
  'Delivery confirmation for every fax',
  'HIPAA-compliant, encrypted transmission',
];

const CTA_TEXT: Record<Plan, string> = {
  weekly: 'Start 3-Day Free Trial',
  monthly: 'Start 3-Day Free Trial',
  single: 'Send 1 Fax for $4.99',
};

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ segment?: SegmentKey }>();
  const storeSegment = useUserStore((s) => s.segment) ?? 'other';
  const segment = (params.segment ?? storeSegment) as SegmentKey;
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const startTrial = useSubscriptionStore((s) => s.startTrial);

  const [selected, setSelected] = useState<Plan>('weekly');
  const [purchasing, setPurchasing] = useState(false);
  const purchaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (purchaseTimer.current) clearTimeout(purchaseTimer.current);
    },
    [],
  );

  const headline =
    segment === 'medical' || segment === 'legal'
      ? HEADLINES[segment]
      : HEADLINES.default;
  const ctaText = CTA_TEXT[selected];
  const reassurance =
    selected === 'single'
      ? 'One-time charge. No subscription.'
      : "Cancel anytime. We'll remind you before the trial ends.";

  const handlePurchase = () => {
    if (purchasing) return;
    setPurchasing(true);
    trigger('medium');
    if (purchaseTimer.current) clearTimeout(purchaseTimer.current);
    purchaseTimer.current = setTimeout(() => {
      if (selected !== 'single') startTrial(selected);
      else startTrial('weekly');
      completeOnboarding();
      trigger('success');
      router.replace('/(app)');
    }, 2000);
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
            onPress={() => router.back()}
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
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: colors.black,
            textAlign: 'center',
            marginTop: 8,
            marginBottom: 16,
            letterSpacing: -0.56,
            lineHeight: 34,
          }}
        >
          {headline}
        </Text>

        <View style={{ gap: 10, marginBottom: 20 }}>
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
              <Text style={{ fontSize: 16, color: colors.black, flex: 1 }}>
                {f}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ gap: 10, marginBottom: 16 }}>
          <PlanCard
            plan="single"
            variant="decoy"
            selected={selected === 'single'}
            onSelect={() => setSelected('single')}
          />
          <PlanCard
            plan="weekly"
            variant="weekly"
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

        {purchasing ? (
          <View
            style={{
              height: 56,
              borderRadius: 12,
              backgroundColor: colors.amber500,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 12,
              shadowColor: colors.amber500,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 4,
            }}
          >
            <ActivityIndicator color={colors.black} />
            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
              Processing…
            </Text>
          </View>
        ) : (
          <Button label={ctaText} onPress={handlePurchase} />
        )}

        <Text
          style={{
            fontSize: 11,
            color: colors.gray500,
            textAlign: 'center',
            marginTop: 12,
          }}
        >
          {reassurance}
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
