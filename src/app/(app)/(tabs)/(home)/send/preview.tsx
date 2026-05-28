import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { Icon } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { useSendDraftStore } from '@/stores/sendDraftStore';

export default function Preview() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const source = useSendDraftStore((s) => s.source);
  const pages = useSendDraftStore((s) => s.pages);
  const attachment = useSendDraftStore((s) => s.attachment);
  const addPages = useSendDraftStore((s) => s.addPages);
  const removePageAt = useSendDraftStore((s) => s.removePageAt);
  const [active, setActive] = useState(0);

  const addMore = async () => {
    if (source === 'camera') {
      router.replace('/(app)/(tabs)/(home)/send/camera');
      return;
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (res.canceled) return;
    addPages(
      res.assets.map((a) => ({
        uri: a.uri,
        width: a.width ?? 0,
        height: a.height ?? 0,
      })),
    );
  };

  const total = attachment ? 1 : pages.length;
  const activeUri = pages[Math.min(active, pages.length - 1)]?.uri;
  const canContinue = total > 0;

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.gray100, paddingTop: insets.top }}
    >
      <TopBar
        left={<IconButton name="chevron-left" onPress={() => router.back()} />}
        center={
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
              Preview
            </Text>
            <Text style={{ fontSize: 13, color: colors.gray500 }}>
              {attachment
                ? 'PDF document'
                : `${total} ${total === 1 ? 'page' : 'pages'}`}
            </Text>
          </View>
        }
        right={
          !attachment && total > 0 ? (
            <HapticPressable
              haptic="light"
              onPress={() => router.navigate('/(app)/(tabs)/(home)/send/page-editor')}
              style={{ paddingHorizontal: 12 }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.green700 }}>
                Edit
              </Text>
            </HapticPressable>
          ) : undefined
        }
      />

      {attachment ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
          <View
            style={{
              width: 120,
              height: 150,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Icon name="doc" size={40} color={colors.error} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.error }}>PDF</Text>
          </View>
          <Text style={{ fontSize: 15, color: colors.gray700, textAlign: 'center' }} numberOfLines={2}>
            {attachment.name}
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8, gap: 10 }}
          >
            {pages.map((p, i) => (
              <HapticPressable
                key={`${p.uri}-${i}`}
                haptic="selection"
                onPress={() => setActive(i)}
                pressOpacity={0.7}
                style={{
                  width: 76,
                  height: 100,
                  borderRadius: 12,
                  overflow: 'hidden',
                  borderWidth: i === active ? 2 : 1,
                  borderColor: i === active ? colors.green700 : colors.gray300,
                }}
              >
                <Image source={{ uri: p.uri }} style={{ flex: 1 }} contentFit="cover" />
                <HapticPressable
                  haptic="light"
                  onPress={() => {
                    removePageAt(i);
                    setActive((a) => Math.max(0, a - (i <= a ? 1 : 0)));
                  }}
                  accessibilityLabel={`Remove page ${i + 1}`}
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 22,
                    height: 22,
                    borderRadius: 9999,
                    backgroundColor: 'rgba(10,10,10,0.6)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="x" size={12} color="#FFFFFF" />
                </HapticPressable>
              </HapticPressable>
            ))}
            <HapticPressable
              haptic="light"
              onPress={addMore}
              style={{
                width: 76,
                height: 100,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: colors.gray300,
                borderStyle: 'dashed',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <Icon name="plus" size={20} color={colors.green700} />
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.green700 }}>
                Add page
              </Text>
            </HapticPressable>
          </ScrollView>

          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100, alignItems: 'center' }}>
            {activeUri ? (
              <Image
                source={{ uri: activeUri }}
                style={{ width: '85%', height: '100%', borderRadius: 8, backgroundColor: '#FFFFFF' }}
                contentFit="contain"
              />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <Icon name="photo" size={36} color={colors.gray300} />
                <Text style={{ color: colors.gray500, fontSize: 15 }}>No pages yet</Text>
                <Button label="Add pages" onPress={addMore} />
              </View>
            )}
          </View>
        </>
      )}

      <View style={{ position: 'absolute', left: 20, right: 20, bottom: insets.bottom + 16 }}>
        <Button
          label="Continue"
          disabled={!canContinue}
          onPress={() => router.navigate('/(app)/(tabs)/(home)/send/recipient')}
        />
      </View>
    </View>
  );
}
