import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/icons/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { TopBar } from '@/components/ui/TopBar';
import { colors } from '@/theme/tokens';
import { shadows } from '@/theme/shadows';
import { useUserStore } from '@/stores/userStore';
import { trigger } from '@/hooks/useHaptics';
import type { Segment } from '@/types/user';

const OPTIONS: {
  id: Segment;
  emoji: string;
  title: string;
  sub: string;
}[] = [
  {
    id: 'medical',
    emoji: '🏥',
    title: 'Medical',
    sub: 'Patient forms, prescriptions, records',
  },
  {
    id: 'legal',
    emoji: '⚖️',
    title: 'Legal',
    sub: 'Contracts, court documents, signatures',
  },
  {
    id: 'business',
    emoji: '💼',
    title: 'Business',
    sub: 'Invoices, agreements, paperwork',
  },
  {
    id: 'tax',
    emoji: '💰',
    title: 'Tax & Financial',
    sub: 'Returns, statements, claims',
  },
  {
    id: 'other',
    emoji: '📋',
    title: 'Other',
    sub: 'Something else',
  },
];

export default function Segmentation() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const setSegment = useUserStore((s) => s.setSegment);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const [picked, setPicked] = useState<Segment | null>(null);
  const pickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (pickTimer.current) clearTimeout(pickTimer.current);
    },
    [],
  );

  const pick = (id: Segment) => {
    trigger('selection');
    setPicked(id);
    setSegment(id);
    if (pickTimer.current) clearTimeout(pickTimer.current);
    pickTimer.current = setTimeout(() => {
      completeOnboarding();
      router.replace('/(app)');
    }, 220);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray50, paddingTop: insets.top }}>
      <TopBar
        left={<IconButton name="chevron-left" onPress={() => router.back()} />}
      />
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '600',
            color: colors.black,
            textAlign: 'center',
            marginTop: 8,
            marginBottom: 6,
            letterSpacing: -0.22,
          }}
        >
          What are you faxing?
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: colors.gray500,
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 20,
          }}
        >
          Help us tailor your experience
        </Text>

        <View style={{ gap: 10 }}>
          {OPTIONS.map((o) => {
            const active = picked === o.id;
            return (
              <Pressable
                key={o.id}
                onPress={() => pick(o.id)}
                style={[
                  {
                    backgroundColor: active ? colors.green100 : '#FFFFFF',
                    borderRadius: 16,
                    padding: 16,
                    height: 72,
                    borderWidth: 1.5,
                    borderColor: active ? colors.green700 : 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                  },
                  shadows.sm,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${o.title}: ${o.sub}`}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: active ? colors.green700 : colors.gray50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{o.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: colors.black,
                    }}
                  >
                    {o.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.gray500 }}>
                    {o.sub}
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={active ? colors.green700 : colors.gray300}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
