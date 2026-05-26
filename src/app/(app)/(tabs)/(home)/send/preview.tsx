import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { DocumentPreview } from '@/components/illustrations/DocumentPreview';
import { Icon } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { useSendDraftStore } from '@/stores/sendDraftStore';

export default function Preview() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pageCount = useSendDraftStore((s) => s.pageCount);
  const startDraft = useSendDraftStore((s) => s.startDraft);
  const addPage = useSendDraftStore((s) => s.addPage);
  const [active, setActive] = useState(1);

  useEffect(() => {
    if (pageCount === 0) startDraft('photo', 3);
  }, [pageCount, startDraft]);

  const total = Math.max(1, pageCount);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.gray100,
        paddingTop: insets.top,
      }}
    >
      <TopBar
        left={<IconButton name="chevron-left" onPress={() => router.back()} />}
        center={
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
              Preview
            </Text>
            <Text style={{ fontSize: 13, color: colors.gray500 }}>
              {total} {total === 1 ? 'page' : 'pages'}
            </Text>
          </View>
        }
        right={
          <HapticPressable
            haptic="light"
            onPress={() => router.navigate('/(app)/(tabs)/(home)/send/page-editor')}
            style={{ paddingHorizontal: 12 }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.green700,
              }}
            >
              Edit
            </Text>
          </HapticPressable>
        }
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 8,
          gap: 10,
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const num = i + 1;
          return (
            <HapticPressable
              key={num}
              haptic="selection"
              onPress={() => setActive(num)}
              pressOpacity={0.7}
            >
              <DocumentPreview
                pageNumber={num}
                totalPages={total}
                variant="thumb"
                active={num === active}
              />
            </HapticPressable>
          );
        })}
        <HapticPressable
          haptic="light"
          onPress={addPage}
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

      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 100,
          alignItems: 'center',
        }}
      >
        <View style={{ width: '85%', height: '100%' }}>
          <DocumentPreview
            pageNumber={active}
            totalPages={total}
            style={{ height: '100%' }}
          />
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: insets.bottom + 16,
        }}
      >
        <Button
          label="Continue"
          onPress={() => router.navigate('/(app)/(tabs)/(home)/send/recipient')}
        />
      </View>
    </View>
  );
}
