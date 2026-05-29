import { Alert, Linking, ScrollView, Text, View } from 'react-native';
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
import { useSettings } from '@/lib/useSettings';
import { openExternal } from '@/lib/links';
import { hasProEntitlement, restore } from '@/lib/revenuecat';

const MANAGE_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const setFromCustomerInfo = useSubscriptionStore((s) => s.setFromCustomerInfo);
  const settings = useSettings();

  const go = (path: string) => () => router.navigate(path as never);
  const onManage = () => {
    void Linking.openURL(MANAGE_SUBSCRIPTIONS_URL);
  };
  const onRestore = async () => {
    const info = await restore();
    setFromCustomerInfo(info);
    Alert.alert(
      hasProEntitlement(info) ? 'Purchases restored' : 'Nothing to restore',
      hasProEntitlement(info)
        ? 'Your subscription is active.'
        : 'No active subscription was found for your account.',
    );
  };

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
            onManage={onManage}
            onSubscribe={() => router.navigate('/(app)/paywall')}
          />
        </SettingsGroup>

        <SettingsGroup label="Account">
          <SettingsRow
            icon="check-circle"
            label="Restore purchases"
            onPress={onRestore}
          />
          <SettingsRow
            icon="shield"
            label="Data & privacy"
            isLast
            onPress={go('/(app)/(tabs)/(settings)/data-privacy')}
          />
        </SettingsGroup>

        <SettingsGroup label="Support">
          <SettingsRow
            icon="circle"
            label="Help center"
            onPress={go('/(app)/(tabs)/(settings)/help-center')}
          />
          <SettingsRow
            icon="paperplane"
            label="Contact support"
            onPress={go('/(app)/(tabs)/(settings)/contact-support')}
          />
          <SettingsRow
            icon="alert"
            label="Send feedback"
            isLast
            onPress={go('/(app)/(tabs)/(settings)/feedback')}
          />
        </SettingsGroup>

        <SettingsGroup label="About">
          <SettingsRow
            icon="check"
            label="Rate FaxJet"
            onPress={() => openExternal(settings.appStoreUrl)}
          />
          <SettingsRow
            icon="doc"
            label="Terms of Service"
            onPress={() => openExternal(settings.termsUrl)}
          />
          <SettingsRow
            icon="lock-shield"
            label="Privacy Policy"
            isLast
            onPress={() => openExternal(settings.privacyUrl)}
          />
        </SettingsGroup>

        <Text
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: colors.gray500,
            marginTop: 8,
          }}
        >
          FaxJet · Version 1.0.0 (build 4)
        </Text>
      </ScrollView>
    </View>
  );
}
