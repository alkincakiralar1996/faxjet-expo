import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/icons/Icon';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/tokens';

export default function PastDue() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(10,10,10,0.55)',
        }}
      >
        <Pressable
          accessibilityLabel="Close"
          onPress={() => router.dismiss()}
          style={{ flex: 1 }}
        />
      </Animated.View>

      <Animated.View
        entering={SlideInDown.duration(280)}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 12,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 9999,
            backgroundColor: colors.gray300,
            alignSelf: 'center',
            marginBottom: 18,
          }}
        />

        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 9999,
            backgroundColor: colors.errorBg,
            alignSelf: 'center',
            marginBottom: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="alert" size={36} color={colors.error} />
        </View>

        <Text
          style={{
            fontSize: 22,
            fontWeight: '600',
            color: colors.black,
            textAlign: 'center',
            marginBottom: 8,
            letterSpacing: -0.22,
          }}
        >
          Update your payment method.
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: colors.gray700,
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          We tried to charge the card on file but it was declined. You can still
          view your history.
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: colors.gray500,
            textAlign: 'center',
            marginTop: 6,
            marginBottom: 20,
          }}
        >
          Last attempt · Today at 8:02 AM · Card ending 4242
        </Text>

        <Button label="Update Payment Method" onPress={() => router.dismiss()} />
        <View style={{ height: 10 }} />
        <Button kind="tertiary" label="Not Now" onPress={() => router.dismiss()} />
      </Animated.View>
    </View>
  );
}
