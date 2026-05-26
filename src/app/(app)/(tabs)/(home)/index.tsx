import { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeroSendCard } from '@/components/faxjet/HeroSendCard';
import { HistoryRow } from '@/components/faxjet/HistoryRow';
import { TrialPill } from '@/components/faxjet/TrialPill';
import { EmptyState } from '@/components/faxjet/EmptyState';
import { SkeletonListCard } from '@/components/faxjet/SkeletonRow';
import { Banner } from '@/components/ui/Banner';
import { PaperPlane } from '@/components/faxjet/PaperPlane';
import { colors } from '@/theme/tokens';
import { useFaxStore } from '@/stores/faxStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useAppStore } from '@/stores/appStore';
import { useArtificialDelay } from '@/hooks/useArtificialDelay';
import { trigger } from '@/hooks/useHaptics';

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const faxes = useFaxStore((s) => s.faxes);
  const subStatus = useSubscriptionStore((s) => s.effectiveStatus());
  const daysLeft = useSubscriptionStore((s) => s.daysLeftInTrial());
  const forceTrialEnding = useAppStore((s) => s.forceTrialEndingTomorrow);
  const forcePastDue = useAppStore((s) => s.forcePastDue);
  const loading = useArtificialDelay(800);

  const effectiveStatus = forcePastDue ? 'past_due' : subStatus;
  const showTrialEnding =
    effectiveStatus === 'trial' && (forceTrialEnding || daysLeft <= 1);
  const showPastDue = effectiveStatus === 'past_due';
  const recent = faxes.slice(0, 4);

  const prevTrialEnding = useRef(showTrialEnding);
  const prevPastDue = useRef(showPastDue);
  useEffect(() => {
    if (showTrialEnding && !prevTrialEnding.current) trigger('warning');
    prevTrialEnding.current = showTrialEnding;
  }, [showTrialEnding]);
  useEffect(() => {
    if (showPastDue && !prevPastDue.current) trigger('error');
    prevPastDue.current = showPastDue;
  }, [showPastDue]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray50 }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 4,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: 20,
            height: 44,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
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
          </View>
          {effectiveStatus === 'trial' && !forcePastDue ? (
            <TrialPill
              label={
                daysLeft === 1
                  ? '1 day left'
                  : `${daysLeft} days left in trial`
              }
            />
          ) : null}
          {effectiveStatus === 'past_due' ? (
            <TrialPill label="Past due" tone="danger" />
          ) : null}
        </View>

        {showTrialEnding ? (
          <Banner
            tone="warning"
            icon="clock"
            label="Your trial ends tomorrow. You'll be billed $9.99."
            action={{
              label: 'Manage',
              onPress: () => router.navigate('/(app)/(tabs)/(settings)'),
            }}
          />
        ) : null}
        {showPastDue ? (
          <Banner
            tone="danger"
            icon="alert"
            label="Your payment didn't go through."
            action={{
              label: 'Update',
              onPress: () => router.navigate('/(app)/past-due'),
            }}
          />
        ) : null}

        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <HeroSendCard
            locked={showPastDue}
            onPress={() => {
              if (showPastDue) {
                router.navigate('/(app)/past-due');
              } else {
                router.navigate('/(app)/(tabs)/(home)/send/source');
              }
            }}
          />
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: colors.gray500,
              letterSpacing: 1,
            }}
          >
            RECENT FAXES
          </Text>
          {faxes.length > 0 ? (
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: colors.green700,
              }}
              onPress={() => router.navigate('/(app)/(tabs)/(history)')}
            >
              See all
            </Text>
          ) : null}
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {loading ? (
            <SkeletonListCard rows={3} />
          ) : faxes.length === 0 ? (
            <View style={{ paddingTop: 24, paddingBottom: 16 }}>
              <EmptyState
                illustration={
                  <View
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: 9999,
                      backgroundColor: colors.green100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PaperPlane
                      size={100}
                      angle={-22}
                      planeColor={colors.green700}
                      trailColor={colors.amber500}
                    />
                  </View>
                }
                title="No faxes yet."
                body="Tap the green card above to send your first one."
              />
            </View>
          ) : (
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              {recent.map((f, i) => (
                <HistoryRow
                  key={f.id}
                  fax={f}
                  isLast={i === recent.length - 1}
                  onPress={() =>
                    router.navigate({
                      pathname: '/(app)/(tabs)/(history)/[id]',
                      params: { id: f.id },
                    })
                  }
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
