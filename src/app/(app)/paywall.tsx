import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '@/components/ui/IconButton';
import { TopBar } from '@/components/ui/TopBar';
import { Button } from '@/components/ui/Button';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { Icon } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { useUserStore } from '@/stores/userStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useSettings } from '@/lib/useSettings';
import { openExternal } from '@/lib/links';
import { trigger } from '@/hooks/useHaptics';
import {
  getCurrentOffering,
  hasProEntitlement,
  isRevenueCatEnabled,
  planFromPackage,
  purchase,
  restore,
  type PurchasesPackage,
} from '@/lib/revenuecat';
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

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ segment?: SegmentKey; recipient?: string }>();
  const storeSegment = useUserStore((s) => s.segment) ?? 'other';
  const segment = (params.segment ?? storeSegment) as SegmentKey;
  const setFromCustomerInfo = useSubscriptionStore((s) => s.setFromCustomerInfo);
  const settings = useSettings();

  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selected, setSelected] = useState<Plan>('monthly');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const offering = await getCurrentOffering();
      if (!active) return;
      const pkgs = offering?.availablePackages ?? [];
      setPackages(pkgs);
      // Prefer monthly (best value); fall back to whatever's first.
      const hasMonthly = pkgs.some((p) => planFromPackage(p) === 'monthly');
      setSelected(hasMonthly ? 'monthly' : 'weekly');
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const headline =
    segment === 'medical' || segment === 'legal'
      ? HEADLINES[segment]
      : HEADLINES.default;

  const pkgFor = (plan: Plan) => packages.find((p) => planFromPackage(p) === plan);
  const selectedPkg = pkgFor(selected);

  const proceed = () => {
    if (params.recipient) {
      router.replace({
        pathname: '/(app)/(tabs)/(home)/send/sending',
        params: { recipient: params.recipient },
      });
    } else {
      router.back();
    }
  };

  const onPurchase = async () => {
    if (purchasing || !selectedPkg) return;
    setPurchasing(true);
    trigger('medium');
    const res = await purchase(selectedPkg);
    setPurchasing(false);
    if (res.ok && res.pro) {
      setFromCustomerInfo(res.info);
      trigger('success');
      proceed();
    } else if (!res.ok && !res.cancelled) {
      trigger('error');
    }
  };

  const onRestore = async () => {
    const info = await restore();
    setFromCustomerInfo(info);
    if (hasProEntitlement(info)) {
      trigger('success');
      proceed();
    }
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.gray50, paddingTop: insets.top }}
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
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
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
              <Text style={{ fontSize: 16, color: colors.black, flex: 1 }}>{f}</Text>
            </View>
          ))}
        </View>

        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator color={colors.green700} />
          </View>
        ) : packages.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 16,
              padding: 18,
            }}
          >
            <Text style={{ fontSize: 15, color: colors.gray700, textAlign: 'center' }}>
              {isRevenueCatEnabled()
                ? 'Plans are loading. Check your connection and try again.'
                : 'Subscriptions are unavailable on this build.'}
            </Text>
          </View>
        ) : (
          <View style={{ gap: 10, marginBottom: 16 }}>
            {(['weekly', 'monthly'] as const).map((plan) => {
              const pkg = pkgFor(plan);
              if (!pkg) return null;
              const isSel = selected === plan;
              const best = plan === 'monthly';
              return (
                <HapticPressable
                  key={plan}
                  haptic="light"
                  onPress={() => setSelected(plan)}
                  style={{
                    borderRadius: 16,
                    borderWidth: isSel ? 2 : 1,
                    borderColor: isSel ? colors.green700 : colors.gray300,
                    backgroundColor: isSel ? colors.green100 : colors.white,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                    >
                      <Text
                        style={{ fontSize: 17, fontWeight: '700', color: colors.black }}
                      >
                        {plan === 'weekly' ? 'Unlimited Weekly' : 'Unlimited Monthly'}
                      </Text>
                      {best ? (
                        <View
                          style={{
                            backgroundColor: colors.amber500,
                            borderRadius: 9999,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                          }}
                        >
                          <Text
                            style={{ fontSize: 10, fontWeight: '700', color: colors.black }}
                          >
                            BEST VALUE
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={{ fontSize: 13, color: colors.gray500, marginTop: 2 }}>
                      {pkg.product.priceString}
                      {plan === 'weekly' ? ' / week' : ' / month'}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 9999,
                      borderWidth: 2,
                      borderColor: isSel ? colors.green700 : colors.gray300,
                      backgroundColor: isSel ? colors.green700 : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSel ? <Icon name="check" size={13} color={colors.white} /> : null}
                  </View>
                </HapticPressable>
              );
            })}
          </View>
        )}

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
            }}
          >
            <ActivityIndicator color={colors.black} />
            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
              Processing…
            </Text>
          </View>
        ) : (
          <Button
            label="Subscribe"
            disabled={!selectedPkg}
            onPress={onPurchase}
          />
        )}

        <Text
          style={{
            fontSize: 11,
            color: colors.gray500,
            textAlign: 'center',
            marginTop: 12,
          }}
        >
          Auto-renews until cancelled. Cancel anytime in Settings.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 16,
            marginTop: 10,
          }}
        >
          <FooterLink label="Restore Purchases" onPress={onRestore} />
          <FooterLink
            label="Terms"
            onPress={() => openExternal(settings.termsUrl)}
          />
          <FooterLink
            label="Privacy"
            onPress={() => openExternal(settings.privacyUrl)}
          />
        </View>
      </View>
    </View>
  );
}

function FooterLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Text
      onPress={onPress}
      style={{
        fontSize: 11,
        color: colors.gray500,
        textDecorationLine: 'underline',
      }}
    >
      {label}
    </Text>
  );
}
