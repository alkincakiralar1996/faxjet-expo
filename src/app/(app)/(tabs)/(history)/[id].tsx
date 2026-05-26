import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { Icon } from '@/icons/Icon';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { DocumentPreview } from '@/components/illustrations/DocumentPreview';
import { colors } from '@/theme/tokens';
import { useFaxStore } from '@/stores/faxStore';
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
        right={<IconButton name="share" />}
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
        >
          {Array.from({ length: Math.min(fax.pages, 6) }).map((_, i) => (
            <DocumentPreview
              key={i}
              pageNumber={i + 1}
              totalPages={fax.pages}
              variant="thumb"
              active={i === 0}
            />
          ))}
        </ScrollView>

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
          <ActionRow icon="refresh" label="Resend to same number" />
          <ActionRow
            icon="paperplane"
            label="Send to different number"
            isLast
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
