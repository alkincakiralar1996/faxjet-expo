import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/ui/TopBar';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/icons/Icon';
import { colors } from '@/theme/tokens';

export type PrimingScreenProps = {
  illustration: ReactNode;
  headline: string;
  body: string;
  allowLabel: string;
  onAllow: () => void;
  trustText?: string;
};

export function PrimingScreen({
  illustration,
  headline,
  body,
  allowLabel,
  onAllow,
  trustText = 'We never store your images on our servers.',
}: PrimingScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
          <HapticPressable
            haptic="light"
            onPress={() => router.back()}
            style={{ paddingHorizontal: 12 }}
          >
            <Text style={{ fontSize: 16, color: colors.gray500 }}>Not now</Text>
          </HapticPressable>
        }
      />

      <View
        style={{
          paddingHorizontal: 32,
          paddingTop: 24,
          alignItems: 'center',
        }}
      >
        <View style={{ marginBottom: 32 }}>{illustration}</View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: colors.black,
            textAlign: 'center',
            letterSpacing: -0.56,
            marginBottom: 12,
            lineHeight: 34,
          }}
        >
          {headline}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: colors.gray700,
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          {body}
        </Text>

        <View
          style={{
            marginTop: 24,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: colors.green100,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Icon name="lock-shield" size={16} color={colors.green700} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.green700 }}>
            {trustText}
          </Text>
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
        <Button label={allowLabel} onPress={onAllow} />
        <Text
          style={{
            fontSize: 11,
            color: colors.gray500,
            textAlign: 'center',
          }}
        >
          You&apos;ll see a system prompt next.
        </Text>
      </View>
    </View>
  );
}
