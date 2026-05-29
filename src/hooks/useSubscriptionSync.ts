import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import {
  Purchases,
  configureRevenueCat,
  getCustomerInfoSafe,
  identifyRevenueCat,
  isRevenueCatEnabled,
  type CustomerInfo,
} from '@/lib/revenuecat';

/**
 * Keeps the subscription store in lockstep with RevenueCat:
 *   - configures the SDK once,
 *   - aliases the RC user to our server uuid (app_user_id == users.id),
 *   - seeds the entitlement from CustomerInfo on launch,
 *   - subscribes to live updates (renewals/expirations while app is open).
 * No-op when RevenueCat is disabled (no key / non-iOS / old build).
 */
export function useSubscriptionSync(enabled: boolean): void {
  const serverUserId = useUserStore((s) => s.serverUserId);
  const setFromCustomerInfo = useSubscriptionStore((s) => s.setFromCustomerInfo);

  // Configure + attach the update listener once the app is ready.
  useEffect(() => {
    if (!enabled || !isRevenueCatEnabled()) return;
    configureRevenueCat();

    const listener = (info: CustomerInfo) => setFromCustomerInfo(info);
    Purchases.addCustomerInfoUpdateListener(listener);

    void (async () => {
      const info = await getCustomerInfoSafe();
      if (info) setFromCustomerInfo(info);
    })();

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [enabled, setFromCustomerInfo]);

  // Alias to our server uuid whenever it resolves, then refresh entitlement.
  useEffect(() => {
    if (!enabled || !isRevenueCatEnabled() || !serverUserId) return;
    void (async () => {
      await identifyRevenueCat(serverUserId);
      const info = await getCustomerInfoSafe();
      if (info) setFromCustomerInfo(info);
    })();
  }, [enabled, serverUserId, setFromCustomerInfo]);
}
