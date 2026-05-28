import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { Icon, type IconName } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { openExternal } from '@/lib/links';
import { useSettings } from '@/lib/useSettings';

const SECTIONS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'lock-shield',
    title: 'Your documents stay on your device',
    body: 'The pages you fax are stored only on this iPhone. We never upload or keep your document images on our servers.',
  },
  {
    icon: 'doc',
    title: 'What we do store',
    body: 'We keep a record of each fax you send — the recipient number, time, status, page count, and confirmation number — so your history works across reinstalls.',
  },
  {
    icon: 'shield',
    title: 'Anonymous by default',
    body: 'FaxJet has no accounts or passwords. Your identity is a random device ID. We also collect basic device info (model, OS, country, language) to improve the app.',
  },
  {
    icon: 'check-circle',
    title: 'You are in control',
    body: 'Deleting the app removes every page image from your device. Contact support anytime to request deletion of your fax records.',
  },
];

export default function DataPrivacy() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const settings = useSettings();

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray50, paddingTop: insets.top }}>
      <TopBar
        left={<IconButton name="chevron-left" onPress={() => router.back()} />}
        center={
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
            Data &amp; Privacy
          </Text>
        }
      />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 32, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 15, color: colors.gray700, lineHeight: 22 }}>
          FaxJet is built privacy-first. Here&apos;s exactly how your data is
          handled.
        </Text>

        {SECTIONS.map((s) => (
          <View
            key={s.title}
            style={{
              flexDirection: 'row',
              gap: 14,
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
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.green100,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={s.icon} size={18} color={colors.green700} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
                {s.title}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 14, color: colors.gray700, lineHeight: 20 }}>
                {s.body}
              </Text>
            </View>
          </View>
        ))}

        <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'center', marginTop: 8 }}>
          <Text
            onPress={() => openExternal(settings.privacyUrl)}
            style={{ fontSize: 14, fontWeight: '600', color: colors.green700, textDecorationLine: 'underline' }}
          >
            Privacy Policy
          </Text>
          <Text
            onPress={() => openExternal(settings.termsUrl)}
            style={{ fontSize: 14, fontWeight: '600', color: colors.green700, textDecorationLine: 'underline' }}
          >
            Terms of Service
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
