import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/icons/Icon';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { colors } from '@/theme/tokens';
import { useSendDraftStore } from '@/stores/sendDraftStore';

type Source = {
  id: 'camera' | 'photo' | 'files' | 'cloud';
  title: string;
  sub?: string;
  icon: IconName;
  iconBg: string;
  iconColor: string;
  disabled?: boolean;
};

const SOURCES: { primary: Source; grid: Source[]; trailing: Source } = {
  primary: {
    id: 'camera',
    title: 'Scan with Camera',
    sub: 'Auto-deskew, crop, and sharpen',
    icon: 'camera',
    iconBg: colors.green900,
    iconColor: '#FFFFFF',
  },
  grid: [
    {
      id: 'photo',
      title: 'Photo Library',
      icon: 'photo',
      iconBg: colors.green100,
      iconColor: colors.green700,
    },
    {
      id: 'files',
      title: 'Files',
      icon: 'folder',
      iconBg: colors.green100,
      iconColor: colors.green700,
    },
  ],
  trailing: {
    id: 'cloud',
    title: 'Cloud',
    sub: 'Google Drive, Dropbox',
    icon: 'cloud',
    iconBg: colors.gray100,
    iconColor: colors.gray500,
    disabled: true,
  },
};

export default function SourcePicker() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const startDraft = useSendDraftStore((s) => s.startDraft);

  const handleSelect = (id: Source['id']) => {
    if (id === 'cloud') return;
    router.dismiss();
    if (id === 'camera') {
      router.navigate('/(app)/(tabs)/(home)/send/permission-camera');
    } else if (id === 'photo') {
      router.navigate('/(app)/(tabs)/(home)/send/permission-photo');
    } else {
      startDraft('files');
      router.navigate('/(app)/(tabs)/(home)/send/preview');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={{
          ...StyleSheetAbsoluteFill,
          backgroundColor: 'rgba(10,10,10,0.45)',
        }}
      >
        <Pressable
          onPress={() => router.dismiss()}
          style={{ flex: 1 }}
          accessibilityLabel="Close sheet"
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
          paddingHorizontal: 20,
          paddingTop: 12,
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
            marginBottom: 16,
          }}
        />
        <Text
          style={{
            fontSize: 22,
            fontWeight: '600',
            color: colors.black,
            textAlign: 'center',
            marginBottom: 4,
            letterSpacing: -0.22,
          }}
        >
          Add Document
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: colors.gray500,
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Choose a source
        </Text>

        <SourceCard
          full
          source={SOURCES.primary}
          onPress={() => handleSelect(SOURCES.primary.id)}
        />

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginTop: 10,
          }}
        >
          {SOURCES.grid.map((s) => (
            <View key={s.id} style={{ flex: 1 }}>
              <SourceCard source={s} onPress={() => handleSelect(s.id)} />
            </View>
          ))}
        </View>

        <View style={{ marginTop: 10 }}>
          <SourceCard
            source={SOURCES.trailing}
            onPress={() => handleSelect(SOURCES.trailing.id)}
            full
          />
        </View>

        <HapticPressable
          haptic="light"
          onPress={() => router.dismiss()}
          style={{
            marginTop: 16,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.green700 }}>
            Cancel
          </Text>
        </HapticPressable>
      </Animated.View>
    </View>
  );
}

const StyleSheetAbsoluteFill = {
  position: 'absolute' as const,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

function SourceCard({
  source,
  onPress,
  full = false,
}: {
  source: Source;
  onPress: () => void;
  full?: boolean;
}) {
  const disabled = source.disabled;
  return (
    <HapticPressable
      haptic={disabled ? false : 'medium'}
      onPress={disabled ? undefined : onPress}
      style={{
        backgroundColor: disabled ? colors.gray50 : '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.gray100,
        minHeight: full ? 80 : 120,
        flexDirection: full ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: full ? 'flex-start' : 'center',
        gap: full ? 16 : 10,
        opacity: disabled ? 0.55 : 1,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: disabled ? 0 : 0.04,
        shadowRadius: 2,
        elevation: disabled ? 0 : 1,
      }}
      accessibilityRole="button"
      accessibilityLabel={source.title}
      accessibilityState={{ disabled: !!disabled }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: full ? 14 : 16,
          backgroundColor: source.iconBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={source.icon} size={28} color={source.iconColor} />
      </View>
      <View style={{ flex: full ? 1 : undefined, alignItems: full ? 'flex-start' : 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
          {source.title}
        </Text>
        {source.sub ? (
          <Text style={{ fontSize: 13, color: colors.gray500, marginTop: 2 }}>
            {source.sub}
          </Text>
        ) : null}
      </View>
      {disabled ? (
        <View
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 9999,
            backgroundColor: colors.gray100,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '600', color: colors.gray500 }}>
            Coming soon
          </Text>
        </View>
      ) : null}
    </HapticPressable>
  );
}
