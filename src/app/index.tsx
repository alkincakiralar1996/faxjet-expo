import { Redirect } from 'expo-router';
import { useUserStore } from '@/stores/userStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

export default function Boot() {
  const hasSeenWelcome = useUserStore((s) => s.hasSeenWelcome);
  const segment = useUserStore((s) => s.segment);
  const onboardingCompleted = useUserStore((s) => s.onboardingCompleted);
  const effectiveStatus = useSubscriptionStore((s) => s.effectiveStatus());

  if (!hasSeenWelcome) return <Redirect href="/(onboarding)/welcome" />;
  if (segment == null) return <Redirect href="/(onboarding)/carousel" />;
  if (!onboardingCompleted)
    return <Redirect href={{ pathname: '/(onboarding)/paywall', params: { segment } }} />;
  if (effectiveStatus === 'expired')
    return <Redirect href="/(app)/reengage-paywall" />;
  return <Redirect href="/(app)" />;
}
