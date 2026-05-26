import { Tabs } from 'expo-router';
import { TabBar } from '@/components/ui/TabBar';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#FAFAF7' },
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="(home)" />
      <Tabs.Screen name="(history)" />
      <Tabs.Screen name="(settings)" />
    </Tabs>
  );
}
