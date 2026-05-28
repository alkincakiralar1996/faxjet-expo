import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { isToday, isYesterday } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HistoryRow } from '@/components/faxjet/HistoryRow';
import { FilterPills } from '@/components/faxjet/FilterPills';
import { EmptyState } from '@/components/faxjet/EmptyState';
import { SkeletonListCard } from '@/components/faxjet/SkeletonRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { useFaxStore, type FilterOption } from '@/stores/faxStore';
import { useUserStore } from '@/stores/userStore';
import { useArtificialDelay } from '@/hooks/useArtificialDelay';
import type { Fax } from '@/types/fax';

const FILTERS: readonly FilterOption[] = ['All', 'Delivered', 'Pending', 'Failed'];

type Group = { label: string; items: Fax[] };

function groupFaxes(faxes: Fax[]): Group[] {
  const today: Fax[] = [];
  const yesterday: Fax[] = [];
  const earlier: Fax[] = [];
  for (const f of faxes) {
    const d = new Date(f.sentAt);
    if (isToday(d)) today.push(f);
    else if (isYesterday(d)) yesterday.push(f);
    else earlier.push(f);
  }
  return [
    { label: 'Today', items: today },
    { label: 'Yesterday', items: yesterday },
    { label: 'Earlier', items: earlier },
  ].filter((g) => g.items.length);
}

export default function History() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const filter = useFaxStore((s) => s.filter);
  const setFilter = useFaxStore((s) => s.setFilter);
  const faxes = useFaxStore((s) => s.faxes);
  const loadFromServer = useFaxStore((s) => s.loadFromServer);
  const serverUserId = useUserStore((s) => s.serverUserId);
  const loading = useArtificialDelay(800);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh metadata from the backend whenever the tab gains focus.
  useFocusEffect(
    useCallback(() => {
      if (serverUserId) void loadFromServer(serverUserId);
    }, [serverUserId, loadFromServer]),
  );

  const onRefresh = useCallback(async () => {
    if (!serverUserId) return;
    setRefreshing(true);
    try {
      await loadFromServer(serverUserId);
    } finally {
      setRefreshing(false);
    }
  }, [serverUserId, loadFromServer]);

  const filtered = useMemo(() => {
    if (filter === 'All') return faxes;
    return faxes.filter(
      (f) => f.status.toLowerCase() === filter.toLowerCase(),
    );
  }, [filter, faxes]);

  const groups = useMemo(() => groupFaxes(filtered), [filtered]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray50 }}>
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: colors.black,
            letterSpacing: -0.56,
            marginTop: 8,
            marginBottom: 14,
          }}
        >
          Fax History
        </Text>
        <FilterPills options={FILTERS} active={filter} onChange={setFilter} />
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.green700}
          />
        }
      >
        {loading ? (
          <View style={{ paddingHorizontal: 20, gap: 16 }}>
            <Skeleton width={64} height={11} radius={3} />
            <SkeletonListCard rows={4} />
            <Skeleton width={92} height={11} radius={3} />
            <SkeletonListCard rows={2} />
          </View>
        ) : faxes.length === 0 ? (
          <View style={{ paddingTop: 32 }}>
            <EmptyState
              illustration={
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 24,
                    backgroundColor: colors.gray100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="doc" size={44} color={colors.gray500} />
                </View>
              }
              title="Nothing here yet."
              body="Your fax history will appear here once you send your first fax."
              action={
                <Button
                  fullWidth={false}
                  label="Send Your First Fax"
                  onPress={() =>
                    router.navigate('/(app)/(tabs)/(home)/send/source')
                  }
                />
              }
            />
          </View>
        ) : groups.length === 0 ? (
          <View style={{ paddingHorizontal: 20, paddingTop: 32 }}>
            <Text
              style={{ fontSize: 15, color: colors.gray500, textAlign: 'center' }}
            >
              No faxes match this filter.
            </Text>
          </View>
        ) : (
          groups.map((g) => (
            <View key={g.label} style={{ marginBottom: 16 }}>
              <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: colors.gray500,
                    letterSpacing: 1,
                  }}
                >
                  {g.label.toUpperCase()}
                </Text>
              </View>
              <View style={{ paddingHorizontal: 20 }}>
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
                  {g.items.map((f, i, arr) => (
                    <HistoryRow
                      key={f.id}
                      fax={f}
                      isLast={i === arr.length - 1}
                      onPress={() =>
                        router.navigate({
                          pathname: '/(app)/(tabs)/(history)/[id]',
                          params: { id: f.id },
                        })
                      }
                    />
                  ))}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
