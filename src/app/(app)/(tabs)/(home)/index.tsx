import { ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeroSendCard } from '@/components/faxjet/HeroSendCard';
import { HistoryRow } from '@/components/faxjet/HistoryRow';
import { TrialPill } from '@/components/faxjet/TrialPill';
import { EmptyState } from '@/components/faxjet/EmptyState';
import { SkeletonListCard } from '@/components/faxjet/SkeletonRow';
import { PaperPlane } from '@/components/faxjet/PaperPlane';
import { colors } from '@/theme/tokens';
import { useFaxStore } from '@/stores/faxStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useArtificialDelay } from '@/hooks/useArtificialDelay';

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const faxes = useFaxStore((s) => s.faxes);
  const isSubscribed = useSubscriptionStore((s) => s.isSubscribed);
  const loading = useArtificialDelay(800);

  const recent = faxes.slice(0, 4);

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
          {isSubscribed ? <TrialPill label="Pro" tone="success" /> : null}
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <HeroSendCard
            onPress={() =>
              router.navigate('/(app)/(tabs)/(home)/send/source')
            }
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
