import { Redirect } from 'expo-router';
import { useUserStore } from '@/stores/userStore';

export default function Boot() {
  const hasSeenWelcome = useUserStore((s) => s.hasSeenWelcome);
  const segment = useUserStore((s) => s.segment);

  if (!hasSeenWelcome) return <Redirect href="/(onboarding)/welcome" />;
  if (segment == null) return <Redirect href="/(onboarding)/carousel" />;
  // Onboarding ends at segmentation → straight to the app. The paywall is no
  // longer an onboarding step; it's presented at send time when not subscribed.
  return <Redirect href="/(app)" />;
}
