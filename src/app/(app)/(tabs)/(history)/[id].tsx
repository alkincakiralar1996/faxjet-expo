import { useEffect, useState } from 'react';
import { Alert, ScrollView, Share, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { Icon } from '@/icons/Icon';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors } from '@/theme/tokens';
import { useFaxStore } from '@/stores/faxStore';
import { useSendDraftStore } from '@/stores/sendDraftStore';
import { getPages } from '@/lib/faxStorage';
import {
  formatFaxDetailTimestamp,
  formatPhoneDisplay,
} from '@/lib/format';
import { useArtificialDelay } from '@/hooks/useArtificialDelay';

export default function FaxDetail() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const fax = useFaxStore((s) => s.getById(id));
  const loading = useArtificialDelay(600);
  const startDraft = useSendDraftStore((s) => s.startDraft);
  const setPages = useSendDraftStore((s) => s.setPages);
  const setRecipientNumber = useSendDraftStore((s) => s.setRecipientNumber);
  const setCoverEnabled = useSendDraftStore((s) => s.setCoverEnabled);
  const setCover = useSendDraftStore((s) => s.setCover);
  const [pageUris, setPageUris] = useState<string[]>([]);

  // Page images live on this device only; load them by fax id.
  useEffect(() => {
    if (!id) return;
    let mounted = true;
    void getPages(id).then((uris) => {
      if (mounted) setPageUris(uris);
    });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.gray50,
          paddingTop: insets.top,
        }}
      >
        <TopBar
          left={<IconButton name="chevron-left" onPress={() => router.back()} />}
          center={
            <Text
              style={{ fontSize: 17, fontWeight: '600', color: colors.black }}
            >
              Fax Details
            </Text>
          }
          right={<IconButton name="share" />}
        />
        <View style={{ padding: 20, gap: 16 }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 9999,
                backgroundColor: colors.gray100,
              }}
            />
            <View style={{ flex: 1, gap: 8 }}>
              <Skeleton width={64} height={14} radius={4} />
              <Skeleton width="80%" height={14} />
              <Skeleton width="55%" height={10} />
            </View>
          </View>
          <Skeleton width={86} height={11} radius={3} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={{
                  width: 76,
                  height: 100,
                  borderRadius: 12,
                  backgroundColor: colors.gray100,
                }}
              />
            ))}
          </View>
          <Skeleton width={108} height={11} radius={3} />
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              gap: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingBottom: 12,
                  borderBottomWidth: i < 5 ? 0.5 : 0,
                  borderBottomColor: colors.gray100,
                }}
              >
                <Skeleton width={84} height={12} />
                <Skeleton width={120} height={12} />
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  if (!fax) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: colors.gray50 }}>
        <TopBar
          left={<IconButton name="chevron-left" onPress={() => router.back()} />}
          center={<Text style={{ fontSize: 17, fontWeight: '600' }}>Fax Details</Text>}
        />
        <View style={{ padding: 32, alignItems: 'center' }}>
          <Text style={{ color: colors.gray500 }}>Fax not found.</Text>
        </View>
      </View>
    );
  }

  const isDelivered = fax.status === 'delivered';
  const phoneLabel = formatPhoneDisplay(fax.recipientNumber);
  const iconBg = {
    delivered: colors.green100,
    pending: colors.amber100,
    failed: colors.errorBg,
  }[fax.status];
  const iconColor = {
    delivered: colors.success,
    pending: colors.warning,
    failed: colors.error,
  }[fax.status];

  // Re-seed a send draft from this fax's local pages, then go to recipient
  // (prefilled number for "same", empty for "different").
  const reuseDraftAndGo = async (changeNumber: boolean) => {
    const uris = await getPages(fax.id);
    if (uris.length === 0) {
      Alert.alert(
        'Pages unavailable',
        "The original pages for this fax aren't on this device. Start a new fax instead.",
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'New Fax',
            onPress: () => router.navigate('/(app)/(tabs)/(home)/send/source'),
          },
        ],
      );
      return;
    }
    startDraft('photo');
    setPages(uris.map((u) => ({ uri: u, width: 0, height: 0 })));
    if (fax.cover) {
      setCoverEnabled(true);
      setCover(fax.cover);
    }
    setRecipientNumber(changeNumber ? '' : fax.recipientNumber);
    router.navigate('/(app)/(tabs)/(home)/send/recipient');
  };

  const shareFax = async () => {
    const lines = [
      `Fax to ${fax.recipientLabel}`,
      phoneLabel,
      `Status: ${fax.status}`,
      fax.confirmationNumber ? `Confirmation: ${fax.confirmationNumber}` : '',
      `Sent: ${formatFaxDetailTimestamp(fax.sentAt)}`,
      `${fax.pages} page${fax.pages === 1 ? '' : 's'}`,
    ].filter(Boolean);
    try {
      await Share.share({ message: lines.join('\n') });
    } catch {
      // user cancelled
    }
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
        left={<IconButton name="chevron-left" onPress={() => router.back()} />}
        center={<Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>Fax Details</Text>}
        right={<IconButton name="share" onPress={shareFax} />}
      />

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status hero */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 9999,
              backgroundColor: iconBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              name={isDelivered ? 'check' : fax.status === 'failed' ? 'x' : 'clock'}
              size={24}
              color={iconColor}
            />
          </View>
          <View style={{ flex: 1 }}>
            <StatusBadge status={fax.status} />
            <Text
              style={{
                marginTop: 6,
                fontSize: 16,
                fontWeight: '600',
                color: colors.black,
              }}
            >
              {fax.recipientLabel}
            </Text>
            <Text style={{ fontSize: 13, color: colors.gray500, marginTop: 2 }}>
              {phoneLabel} · {formatFaxDetailTimestamp(fax.sentAt)}
            </Text>
          </View>
        </View>

        {/* Pages */}
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: colors.gray500,
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          PAGES SENT · {fax.pages}
        </Text>
        {pageUris.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
          >
            {pageUris.map((uri, i) => (
              <Image
                key={uri}
                source={{ uri }}
                style={{
                  width: 76,
                  height: 100,
                  borderRadius: 12,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: colors.gray300,
                }}
                contentFit="cover"
                accessibilityLabel={`Page ${i + 1}`}
              />
            ))}
          </ScrollView>
        ) : (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Icon name="doc" size={22} color={colors.gray500} />
            <Text style={{ flex: 1, fontSize: 13, color: colors.gray500, lineHeight: 18 }}>
              Page previews aren&apos;t available on this device. Pages are stored
              locally and don&apos;t transfer when you reinstall.
            </Text>
          </View>
        )}

        {/* Metadata */}
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: colors.gray500,
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          TRANSMISSION
        </Text>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 6,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          {[
            ['Recipient', phoneLabel],
            ['Sent at', formatFaxDetailTimestamp(fax.sentAt)],
            ...(fax.deliveredAt
              ? [
                  ['Delivered at', formatFaxDetailTimestamp(fax.deliveredAt)] as [
                    string,
                    string,
                  ],
                ]
              : []),
            ...(fax.durationSeconds
              ? ([['Duration', `${fax.durationSeconds} seconds`]] as [
                  string,
                  string,
                ][])
              : []),
            ['Pages', String(fax.pages)],
            ...(fax.confirmationNumber
              ? ([['Confirmation', fax.confirmationNumber]] as [
                  string,
                  string,
                ][])
              : []),
            ...(fax.failureReason
              ? ([['Failure reason', fax.failureReason]] as [
                  string,
                  string,
                ][])
              : []),
            ['Cost', 'Included with plan'],
          ].map(([k, v], i, arr) => (
            <View
              key={k}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 14,
                borderBottomWidth: i < arr.length - 1 ? 0.5 : 0,
                borderBottomColor: colors.gray100,
              }}
            >
              <Text style={{ fontSize: 16, color: colors.gray700 }}>{k}</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.black,
                  maxWidth: '60%',
                  textAlign: 'right',
                }}
              >
                {v}
              </Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: colors.gray500,
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          ACTIONS
        </Text>
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
          {isDelivered ? (
            <ActionRow
              icon="download"
              label="Download PDF receipt"
              onPress={() =>
                router.navigate({
                  pathname: '/(app)/(tabs)/(history)/receipt',
                  params: { id: fax.id },
                })
              }
            />
          ) : null}
          <ActionRow
            icon="refresh"
            label="Resend to same number"
            onPress={() => reuseDraftAndGo(false)}
          />
          <ActionRow
            icon="paperplane"
            label="Send to different number"
            isLast
            onPress={() => reuseDraftAndGo(true)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function ActionRow({
  icon,
  label,
  onPress,
  isLast = false,
}: {
  icon: 'download' | 'refresh' | 'paperplane';
  label: string;
  onPress?: () => void;
  isLast?: boolean;
}) {
  return (
    <HapticPressable
      haptic="light"
      onPress={onPress}
      pressOpacity={0.6}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: colors.gray100,
      }}
    >
      <Icon name={icon} size={20} color={colors.green700} />
      <Text style={{ flex: 1, fontSize: 16, color: colors.black }}>{label}</Text>
      <Icon name="chevron-right" size={16} color={colors.gray300} />
    </HapticPressable>
  );
}
