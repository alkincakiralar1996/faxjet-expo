import { Stack } from 'expo-router';

export default function AppRootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FAFAF7' },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="past-due"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="reengage-paywall"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="resubscribe"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="network-error"
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
}
