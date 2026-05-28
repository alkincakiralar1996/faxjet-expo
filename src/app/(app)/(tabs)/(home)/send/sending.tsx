import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  ZoomIn,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { TopBar } from '@/components/ui/TopBar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/icons/Icon';
import { PaperPlane } from '@/components/faxjet/PaperPlane';
import { colors } from '@/theme/tokens';
import { useSendDraftStore } from '@/stores/sendDraftStore';
import { useFaxStore } from '@/stores/faxStore';
import { useUserStore } from '@/stores/userStore';
import { createFax, serverFaxToLocal } from '@/lib/faxApi';
import { savePages } from '@/lib/faxStorage';
import {
  startMockSend,
  type SendProgressEvent,
  type SendOutcome,
} from '@/lib/mockSendSimulator';
import { trigger } from '@/hooks/useHaptics';
import { formatPhone } from '@/lib/format';
import type { Fax } from '@/types/fax';
import { useReduceMotion } from '@/hooks/useReduceMotion';

type Phase =
  | { kind: 'sending'; event: SendProgressEvent | null }
  | { kind: 'delivered'; fax: Fax }
  | { kind: 'failed'; fax: Fax; reason: string };

const AnimatedSvgPath = Animated.createAnimatedComponent(Path);

export default function Sending() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ recipient?: string }>();
  const recipient = params.recipient ?? '';
  const pageCount = useSendDraftStore((s) => s.pageCount);
  const documentTitle = useSendDraftStore((s) => s.documentTitle);
  const coverEnabled = useSendDraftStore((s) => s.coverEnabled);
  const cover = useSendDraftStore((s) => s.cover);
  const draftPages = useSendDraftStore((s) => s.pages);
  const attachment = useSendDraftStore((s) => s.attachment);
  const country = useSendDraftStore((s) => s.recipientCountry);
  const resetDraft = useSendDraftStore((s) => s.reset);
  const addFax = useFaxStore((s) => s.addFax);
  const serverUserId = useUserStore((s) => s.serverUserId);
  const reduce = useReduceMotion();

  const [phase, setPhase] = useState<Phase>({
    kind: 'sending',
    event: null,
  });
  const mountedRef = useRef(true);

  const planeX = useSharedValue(0);
  const planeY = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduce) return;
    planeX.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(-20, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
    planeY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(10, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
    return () => {
      cancelAnimation(planeX);
      cancelAnimation(planeY);
    };
  }, [reduce, planeX, planeY]);

  useEffect(() => {
    mountedRef.current = true;
    // Snapshot draft values up front so a later resetDraft() can't blank them.
    const recipientLabel = cover.to
      ? `${cover.to}${cover.subject ? ` — ${cover.subject}` : ''}`.trim()
      : undefined;
    const totalPages = Math.max(1, pageCount + (coverEnabled ? 1 : 0));
    // The actual page image/PDF URIs to persist on-device (never uploaded).
    const pageUris = attachment
      ? [attachment.uri]
      : draftPages.map((p) => p.uri);
    const snapshot = {
      recipientNumber: recipient,
      recipientLabel,
      pages: totalPages,
      cover: coverEnabled ? cover : undefined,
    };

    // The mock simulator drives the progress animation + decides the outcome
    // (delivered / 10%-fail). On settle we persist the real record via the API
    // and save the page files locally, keyed by the server-issued fax id.
    const finalize = async (outcome: SendOutcome) => {
      const created = await createFax({
        user_id: serverUserId ?? undefined,
        recipient_number: recipient,
        recipient_label: recipientLabel,
        recipient_country: country,
        page_count: totalPages,
        has_cover: coverEnabled,
        cover: coverEnabled ? cover : undefined,
        status: outcome.status,
        duration_seconds: outcome.fax.durationSeconds,
        failure_reason:
          outcome.status === 'failed' ? outcome.reason : undefined,
      });
      // Fall back to the simulator's local fax if the API is unreachable.
      const fax = created ? serverFaxToLocal(created) : outcome.fax;
      if (pageUris.length > 0) {
        try {
          await savePages(fax.id, pageUris);
        } catch {
          // non-fatal — detail screen shows a placeholder if pages are missing
        }
      }
      addFax(fax);
      if (outcome.status === 'delivered') resetDraft();
      if (!mountedRef.current) return;
      if (outcome.status === 'delivered') {
        trigger('success');
        setPhase({ kind: 'delivered', fax });
      } else {
        // Keep draft so Try Again can reuse the captured pages.
        trigger('error');
        setPhase({ kind: 'failed', fax, reason: outcome.reason });
      }
    };

    const cancel = startMockSend(
      snapshot,
      (event) => {
        if (!mountedRef.current) return;
        setPhase({ kind: 'sending', event });
        progress.value = withTiming(event.percent / 100, { duration: 250 });
      },
      (outcome) => {
        void finalize(outcome);
      },
      { speed: 0.35 },
    );
    return () => {
      mountedRef.current = false;
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const planeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: planeX.value },
      { translateY: planeY.value },
    ],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (phase.kind === 'delivered') {
    return (
      <DeliveredView
        recipient={recipient}
        durationSeconds={phase.fax.durationSeconds ?? 0}
        confirmation={phase.fax.confirmationNumber ?? ''}
        totalPages={phase.fax.pages}
        documentTitle={documentTitle}
        onAnother={() => {
          router.dismissAll();
          router.navigate('/(app)/(tabs)/(home)/send/source');
        }}
        onDone={() => router.dismissAll()}
        insets={insets}
      />
    );
  }

  if (phase.kind === 'failed') {
    return (
      <FailedView
        recipient={recipient}
        reason={phase.reason}
        totalPages={phase.fax.pages}
        documentTitle={documentTitle}
        attempt={phase.fax.attemptCount ?? 1}
        onRetry={() => router.replace('/(app)/(tabs)/(home)/send/recipient')}
        onSupport={() => {}}
        insets={insets}
      />
    );
  }

  const event = phase.event;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.green900,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
          padding: 32,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View style={[{ marginBottom: 32 }, planeStyle]}>
          <PaperPlane size={140} angle={-22} />
        </Animated.View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 12,
            letterSpacing: -0.56,
          }}
        >
          Sending your fax…
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          Please don&apos;t close the app
        </Text>

        <View
          style={{
            width: '100%',
            height: 8,
            borderRadius: 9999,
            backgroundColor: 'rgba(255,255,255,0.16)',
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={[
              {
                height: '100%',
                borderRadius: 9999,
                backgroundColor: colors.amber500,
              },
              progressStyle,
            ]}
          />
        </View>
        <Text
          style={{
            marginTop: 14,
            fontSize: 13,
            fontWeight: '700',
            color: colors.amber500,
            letterSpacing: 0.4,
          }}
        >
          {event ? `${event.label.toUpperCase()} · ${event.percent}%` : 'CONNECTING…'}
        </Text>
      </View>

      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 36,
          padding: 16,
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.12)',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.12)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="doc-fill" size={20} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
            {documentTitle}
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            To {formatPhoneE164(recipient)} · {pageCount}{' '}
            {pageCount === 1 ? 'page' : 'pages'}
            {coverEnabled ? ' + cover' : ''}
          </Text>
        </View>
      </View>
    </View>
  );
}

function DeliveredView({
  recipient,
  durationSeconds,
  confirmation,
  totalPages,
  documentTitle,
  onAnother,
  onDone,
  insets,
}: {
  recipient: string;
  durationSeconds: number;
  confirmation: string;
  totalPages: number;
  documentTitle: string;
  onAnother: () => void;
  onDone: () => void;
  insets: { top: number; bottom: number };
}) {
  const stroke = useSharedValue(0);
  useEffect(() => {
    stroke.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [stroke]);

  const checkProps = useAnimatedStyle(() => ({
    opacity: stroke.value,
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.gray50,
        paddingTop: insets.top,
      }}
    >
      <TopBar
        right={
          <Text
            onPress={onDone}
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.green700,
              paddingRight: 12,
            }}
          >
            Done
          </Text>
        }
      />
      <View
        style={{
          paddingHorizontal: 24,
          alignItems: 'center',
          marginTop: 48,
        }}
      >
        <Animated.View
          entering={ZoomIn.duration(280)}
          style={{
            width: 96,
            height: 96,
            borderRadius: 9999,
            backgroundColor: colors.green100,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <Animated.View style={checkProps}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Circle
                cx={12}
                cy={12}
                r={10}
                stroke={colors.success}
                strokeWidth={0}
                fill="transparent"
              />
              <AnimatedSvgPath
                d="M5 12.5 L10.5 18 L19.5 8"
                stroke={colors.success}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </Animated.View>
        </Animated.View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: colors.black,
            letterSpacing: -0.56,
            marginBottom: 8,
          }}
        >
          Fax delivered.
        </Text>
        <Text style={{ fontSize: 16, color: colors.gray700, textAlign: 'center' }}>
          Sent to {formatPhoneE164(recipient)} at{' '}
          {new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
      </View>

      <View style={{ padding: 20, paddingTop: 32 }}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: colors.green100,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="doc-fill" size={20} color={colors.green700} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
                {documentTitle}
              </Text>
              <Text style={{ fontSize: 13, color: colors.gray500 }}>
                {totalPages} pages · sent in {durationSeconds}s
              </Text>
            </View>
            <Icon name="download" size={20} color={colors.green700} />
          </View>
          <View
            style={{
              borderTopWidth: 0.5,
              borderTopColor: colors.gray100,
              paddingTop: 12,
              gap: 8,
            }}
          >
          {[
            ['Recipient', formatPhoneE164(recipient)],
            ['Pages', String(totalPages)],
            ['Transmission', `${durationSeconds} seconds`],
            ['Confirmation', confirmation],
          ].map(([k, v]) => (
            <View
              key={k}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 13, color: colors.gray500 }}>{k}</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: colors.black,
                }}
              >
                {v}
              </Text>
            </View>
          ))}
          </View>
          <View
            style={{
              marginTop: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: colors.green100,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon name="lock-shield" size={16} color={colors.green700} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.green700 }}>
              Encrypted · HIPAA-compliant transmission
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: insets.bottom + 16,
          gap: 10,
        }}
      >
        <Button label="Send Another Fax" onPress={onAnother} />
        <Button kind="secondary" label="Done" onPress={onDone} />
      </View>
    </View>
  );
}

function FailedView({
  recipient,
  reason,
  totalPages,
  documentTitle,
  attempt,
  onRetry,
  onSupport,
  insets,
}: {
  recipient: string;
  reason: string;
  totalPages: number;
  documentTitle: string;
  attempt: number;
  onRetry: () => void;
  onSupport: () => void;
  insets: { top: number; bottom: number };
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.gray50,
        paddingTop: insets.top,
      }}
    >
      <TopBar
        right={
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.green700,
              paddingRight: 12,
            }}
          >
            Done
          </Text>
        }
      />
      <View
        style={{ paddingHorizontal: 24, alignItems: 'center', marginTop: 48 }}
      >
        <Animated.View
          entering={ZoomIn.duration(280)}
          style={{
            width: 96,
            height: 96,
            borderRadius: 9999,
            backgroundColor: colors.errorBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <Icon name="x" size={48} color={colors.error} />
        </Animated.View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: colors.black,
            letterSpacing: -0.56,
            marginBottom: 8,
          }}
        >
          Fax didn&apos;t send.
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: colors.gray700,
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          {reason} No charge was applied.
        </Text>
      </View>

      <View style={{ padding: 20, paddingTop: 32 }}>
        <View
          style={{
            backgroundColor: colors.green100,
            borderRadius: 12,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Icon name="check-circle" size={20} color={colors.green700} />
          <Text
            style={{
              flex: 1,
              fontSize: 13,
              fontWeight: '600',
              color: colors.green700,
            }}
          >
            You weren&apos;t charged. Try again at no cost.
          </Text>
        </View>
        <View
          style={{
            marginTop: 16,
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 16,
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
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: colors.errorBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="doc-fill" size={20} color={colors.error} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
              {documentTitle}
            </Text>
            <Text style={{ fontSize: 13, color: colors.gray500 }}>
              {formatPhoneE164(recipient)} · {totalPages} pages · attempt {attempt} of 3
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: insets.bottom + 16,
          gap: 10,
        }}
      >
        <Button label="Try Again" icon="refresh" onPress={onRetry} />
        <Button kind="secondary" label="Contact Support" onPress={onSupport} />
      </View>
    </View>
  );
}

function formatPhoneE164(e164: string): string {
  const digits = e164.replace(/\D/g, '');
  if (digits.startsWith('1') && digits.length === 11) {
    return formatPhone(digits.slice(1));
  }
  return formatPhone(digits);
}
