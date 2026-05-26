import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { useAppStore } from '@/stores/appStore';

export default function NetworkError() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const toggle = useAppStore((s) => s.toggleForceNetworkError);

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
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
            Send Fax
          </Text>
        }
      />

      <View
        style={{
          padding: 32,
          paddingTop: 80,
          alignItems: 'center',
        }}
      >
        <View
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
          <Icon name="wifi-off" size={42} color={colors.error} />
        </View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: colors.black,
            textAlign: 'center',
            letterSpacing: -0.56,
            marginBottom: 8,
          }}
        >
          Can&apos;t connect.
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: colors.gray700,
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          Check your internet connection and try again. Your fax is saved as a draft.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          {[
            { label: 'Wi-Fi', ok: false },
            { label: 'Cellular data', ok: true },
            { label: 'FaxJet servers', ok: true },
          ].map((d, i, arr) => (
            <View
              key={d.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 10,
                paddingHorizontal: 4,
                borderBottomWidth: i < arr.length - 1 ? 0.5 : 0,
                borderBottomColor: colors.gray100,
              }}
            >
              <Text style={{ fontSize: 16, color: colors.black }}>
                {d.label}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: d.ok ? colors.success : colors.error,
                }}
              >
                {d.ok ? 'OK' : 'Disconnected'}
              </Text>
            </View>
          ))}
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
        <Button
          label="Try Again"
          icon="refresh"
          onPress={() => {
            toggle();
            router.back();
          }}
        />
      </View>
    </View>
  );
}
