import { Stack } from 'expo-router';

export default function SendStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FAFAF7' },
      }}
    >
      <Stack.Screen
        name="source"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="country"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen name="camera" />
      <Stack.Screen name="preview" />
      <Stack.Screen name="recipient" />
      <Stack.Screen
        name="page-editor"
        options={{
          presentation: 'fullScreenModal',
          contentStyle: { backgroundColor: '#1A1A1A' },
        }}
      />
      <Stack.Screen
        name="sending"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
}
