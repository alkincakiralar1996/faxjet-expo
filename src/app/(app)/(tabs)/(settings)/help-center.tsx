import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { Icon } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { getFaq, type FaqItem } from '@/lib/faqApi';

export default function HelpCenter() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [items, setItems] = useState<FaqItem[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getFaq().then((r) => {
      if (mounted) setItems(r);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray50, paddingTop: insets.top }}>
      <TopBar
        left={<IconButton name="chevron-left" onPress={() => router.back()} />}
        center={
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
            Help Center
          </Text>
        }
      />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 32, gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {items === null ? (
          <View style={{ paddingTop: 48, alignItems: 'center' }}>
            <ActivityIndicator color={colors.green700} />
          </View>
        ) : items.length === 0 ? (
          <Text style={{ color: colors.gray500, textAlign: 'center', marginTop: 32 }}>
            No help articles yet.
          </Text>
        ) : (
          items.map((it) => {
            const open = openId === it.id;
            return (
              <HapticPressable
                key={it.id}
                haptic="light"
                onPress={() => setOpenId(open ? null : it.id)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  padding: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Text style={{ flex: 1, fontSize: 16, fontWeight: '600', color: colors.black }}>
                    {it.question}
                  </Text>
                  <Icon name={open ? 'chevron-down' : 'chevron-right'} size={18} color={colors.gray500} />
                </View>
                {open ? (
                  <Text style={{ marginTop: 10, fontSize: 15, color: colors.gray700, lineHeight: 22 }}>
                    {it.answer}
                  </Text>
                ) : null}
              </HapticPressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
