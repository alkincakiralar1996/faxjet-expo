import { Linking, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { Icon, type IconName } from '@/icons/Icon';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/tokens';

export type PermissionDeniedViewProps = {
  icon: IconName;
  headline: string;
  body: string;
};

export function PermissionDeniedView({
  icon,
  headline,
  body,
}: PermissionDeniedViewProps) {
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
        left={<IconButton name="x" onPress={() => router.back()} />}
      />

      <View
        style={{
          padding: 32,
          paddingTop: 56,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            backgroundColor: colors.green100,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
          }}
        >
          <Icon name={icon} size={56} color={colors.green700} />
        </View>
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
        <Button
          label="Open Settings"
          onPress={() => {
            Linking.openSettings().catch(() => {});
          }}
        />
        <Button
          kind="secondary"
          label="Choose Another Source"
          onPress={() => {
            router.back();
            router.navigate('/(app)/(tabs)/(home)/send/source');
          }}
        />
      </View>
    </View>
  );
}
