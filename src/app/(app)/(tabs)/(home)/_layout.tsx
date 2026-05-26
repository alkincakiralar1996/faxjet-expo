import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FAFAF7' },
      }}
    />
  );
}
