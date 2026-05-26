import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { Icon } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { useSendDraftStore } from '@/stores/sendDraftStore';

export default function CameraScan() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const startDraft = useSendDraftStore((s) => s.startDraft);

  const handleCapture = () => {
    startDraft('camera', 3);
    router.replace('/(app)/(tabs)/(home)/send/preview');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.green900,
        paddingTop: insets.top,
      }}
    >
      <StatusBar style="light" />
      <TopBar
        dark
        left={
          <IconButton name="x" color="#FFFFFF" onPress={() => router.back()} />
        }
        center={
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#FFFFFF' }}>
            Scan
          </Text>
        }
        right={
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.amber500,
              paddingRight: 12,
            }}
          >
            Auto
          </Text>
        }
      />

      <View
        style={{
          position: 'absolute',
          top: insets.top + 60,
          left: 16,
          right: 16,
          bottom: insets.bottom + 140,
          backgroundColor: '#0A1D14',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {/* Detected paper */}
        <View
          style={{
            position: 'absolute',
            top: '15%',
            left: '12%',
            right: '14%',
            bottom: '20%',
            backgroundColor: '#F6F4EE',
            borderRadius: 4,
            padding: 24,
          }}
        >
          {[100, 75, 88, 64, 92, 70, 80, 56, 92].map((w, i) => (
            <View
              key={i}
              style={{
                height: 5,
                marginBottom: 8,
                backgroundColor: '#CFC8B8',
                borderRadius: 1,
                width: `${w}%`,
              }}
            />
          ))}
        </View>

        {/* Amber detection corners */}
        {[
          { top: '14%', left: '11%', borderTopWidth: 4, borderLeftWidth: 4 },
          { top: '14%', right: '13%', borderTopWidth: 4, borderRightWidth: 4 },
          {
            bottom: '19%',
            left: '11%',
            borderBottomWidth: 4,
            borderLeftWidth: 4,
          },
          {
            bottom: '19%',
            right: '13%',
            borderBottomWidth: 4,
            borderRightWidth: 4,
          },
        ].map((s, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: 28,
              height: 28,
              borderColor: colors.amber500,
              ...(s as object),
            }}
          />
        ))}

        {/* Status pill */}
        <View
          style={{
            position: 'absolute',
            top: 16,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 9999,
              backgroundColor: 'rgba(255,176,32,0.15)',
              borderWidth: 1,
              borderColor: 'rgba(255,176,32,0.35)',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 9999,
                backgroundColor: colors.amber500,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.amber500,
              }}
            >
              Hold still — detecting page
            </Text>
          </View>
        </View>
      </View>

      {/* Shutter row */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: insets.bottom + 36,
          paddingHorizontal: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Icon name="photo" size={28} color="#FFFFFF" />
        <HapticPressable
          haptic="heavy"
          onPress={handleCapture}
          accessibilityLabel="Capture"
          style={{
            width: 76,
            height: 76,
            borderRadius: 9999,
            borderWidth: 4,
            borderColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}
        >
          <View
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 9999,
              backgroundColor: '#FFFFFF',
            }}
          />
        </HapticPressable>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 9999,
            backgroundColor: 'rgba(255,255,255,0.15)',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
            1 page
          </Text>
        </View>
      </View>
    </View>
  );
}
