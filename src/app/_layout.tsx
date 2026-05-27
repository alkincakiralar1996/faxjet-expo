import '../../global.css';

import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUserStore } from '@/stores/userStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useFaxStore } from '@/stores/faxStore';
import { ensureFirstLaunchClean } from '@/lib/firstLaunch';

SplashScreen.preventAutoHideAsync().catch(() => {});
ensureFirstLaunchClean();

export default function RootLayout() {
  const userHydrated = useUserStore((s) => s.hydrated);
  const subHydrated = useSubscriptionStore((s) => s.hydrated);
  const faxHydrated = useFaxStore((s) => s.hydrated);

  const ready = userHydrated && subHydrated && faxHydrated;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FAFAF7' },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
