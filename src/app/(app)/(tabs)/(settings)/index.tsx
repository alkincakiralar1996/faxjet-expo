import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  SettingsGroup,
  SettingsRow,
} from '@/components/faxjet/SettingsRow';
import { SubscriptionCard } from '@/components/faxjet/SubscriptionCard';
import { DevTrigger } from '@/components/faxjet/DevMenu';
import { colors } from '@/theme/tokens';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isCancelled = useSubscriptionStore((s) => s.status === 'cancelled');

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray50 }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 4,
            marginBottom: 8,
          }}
        >
          <DevTrigger />
        </View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: colors.black,
            letterSpacing: -0.56,
            marginTop: 8,
            marginBottom: 16,
          }}
        >
          Settings
        </Text>

        <SettingsGroup label="Subscription">
          <SubscriptionCard
            onManage={() => {}}
            onResubscribe={() => router.navigate('/(app)/resubscribe')}
          />
        </SettingsGroup>

        <SettingsGroup label="Account">
          <SettingsRow icon="check-circle" label="Restore purchases" />
          <SettingsRow icon="shield" label="Data & privacy" isLast />
        </SettingsGroup>

        {isCancelled ? (
          <SettingsGroup label="Support">
            <SettingsRow icon="paperplane" label="Contact support" isLast />
          </SettingsGroup>
        ) : (
          <>
            <SettingsGroup label="Support">
              <SettingsRow icon="circle" label="Help center" />
              <SettingsRow icon="paperplane" label="Contact support" />
              <SettingsRow icon="alert" label="Send feedback" isLast />
            </SettingsGroup>

            <SettingsGroup label="About">
              <SettingsRow icon="check" label="Rate FaxJet" />
              <SettingsRow icon="doc" label="Terms of Service" />
              <SettingsRow icon="lock-shield" label="Privacy Policy" isLast />
            </SettingsGroup>
          </>
        )}

        <Text
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: colors.gray500,
            marginTop: 8,
          }}
        >
          FaxJet · Version 1.0.0 (build 42)
        </Text>
      </ScrollView>
    </View>
  );
}
