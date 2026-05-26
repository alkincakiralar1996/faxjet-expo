import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/ui/TopBar';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { DocumentPreview } from '@/components/illustrations/DocumentPreview';
import { Icon, type IconName } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { useSendDraftStore } from '@/stores/sendDraftStore';

const TOOLS: {
  icon: IconName;
  label: string;
  color?: string;
  mirror?: boolean;
}[] = [
  { icon: 'refresh', label: 'Rotate L' },
  { icon: 'refresh', label: 'Rotate R', mirror: true },
  { icon: 'photo', label: 'Re-crop' },
  { icon: 'x', label: 'Delete', color: colors.error },
];

export default function PageEditor() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pageCount = useSendDraftStore((s) => s.pageCount);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1A1A1A',
        paddingTop: insets.top,
      }}
    >
      <StatusBar style="light" />
      <TopBar
        dark
        left={
          <Text
            onPress={() => router.back()}
            style={{
              fontSize: 16,
              color: '#FFFFFF',
              paddingLeft: 12,
            }}
          >
            Cancel
          </Text>
        }
        center={
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#FFFFFF' }}>
            Edit Page 1 of {Math.max(1, pageCount)}
          </Text>
        }
        right={
          <Text
            onPress={() => router.back()}
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: colors.amber500,
              paddingRight: 12,
            }}
          >
            Done
          </Text>
        }
      />

      {/* Preview */}
      <View
        style={{
          flex: 1,
          padding: 28,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 230,
            height: 320,
            position: 'relative',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.5,
            shadowRadius: 32,
            elevation: 6,
          }}
        >
          <DocumentPreview
            pageNumber={1}
            totalPages={Math.max(1, pageCount)}
            style={{ height: '100%' }}
          />
          {[
            { top: -6, left: -6 },
            { top: -6, right: -6 },
            { bottom: -6, left: -6 },
            { bottom: -6, right: -6 },
          ].map((s, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: 14,
                height: 14,
                backgroundColor: colors.amber500,
                borderRadius: 3,
                borderWidth: 2,
                borderColor: '#FFFFFF',
                ...(s as object),
              }}
            />
          ))}
        </View>
      </View>

      {/* Glass toolbar */}
      <View
        style={{
          marginHorizontal: 16,
          marginBottom: insets.bottom + 24,
          height: 100,
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: 20,
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.18)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        {TOOLS.map((t) => (
          <HapticPressable
            haptic={t.color === colors.error ? 'warning' : 'light'}
            key={t.label}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              alignItems: 'center',
              gap: 6,
            }}
            accessibilityLabel={t.label}
          >
            <View
              style={{
                transform: [{ scaleX: t.mirror ? -1 : 1 }],
              }}
            >
              <Icon name={t.icon} size={22} color={t.color ?? '#FFFFFF'} />
            </View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color:
                  t.color === colors.error ? colors.error : 'rgba(255,255,255,0.85)',
              }}
            >
              {t.label}
            </Text>
          </HapticPressable>
        ))}
      </View>
    </View>
  );
}
