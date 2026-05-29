import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Plan } from '@/types/subscription';
import type { CustomerInfo } from '@/lib/revenuecat';
import { ENTITLEMENT_ID, planFromProductId } from '@/lib/revenuecat';
import { asyncStorage } from './persist';

type State = {
  isSubscribed: boolean;
  plan: Plan | null;
  expiresAt: string | null;
  willRenew: boolean;
  hydrated: boolean;
};

type Actions = {
  // Source of truth: RevenueCat CustomerInfo (set by useSubscriptionSync).
  setFromCustomerInfo: (info: CustomerInfo | null) => void;
  // Dev/sandbox override only.
  setSubscribed: (v: boolean) => void;
  canSendFax: () => boolean;
  setHydrated: () => void;
  reset: () => void;
};

export const useSubscriptionStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      isSubscribed: false,
      plan: null,
      expiresAt: null,
      willRenew: false,
      hydrated: false,

      setFromCustomerInfo: (info) => {
        const ent = info?.entitlements.active[ENTITLEMENT_ID];
        if (!ent) {
          set({ isSubscribed: false, plan: null, expiresAt: null, willRenew: false });
          return;
        }
        set({
          isSubscribed: true,
          plan: planFromProductId(ent.productIdentifier),
          expiresAt: ent.expirationDate ?? null,
          willRenew: ent.willRenew,
        });
      },

      setSubscribed: (v) =>
        set({
          isSubscribed: v,
          plan: v ? (get().plan ?? 'weekly') : null,
          willRenew: v,
        }),

      canSendFax: () => get().isSubscribed,

      setHydrated: () => set({ hydrated: true }),
      reset: () =>
        set({ isSubscribed: false, plan: null, expiresAt: null, willRenew: false }),
    }),
    {
      name: 'faxjet.subscription',
      storage: createJSONStorage(() => asyncStorage),
      // Cache the entitlement for an instant offline-first boot gate; RC
      // refreshes it on launch + via the update listener.
      partialize: ({ isSubscribed, plan, expiresAt, willRenew }) => ({
        isSubscribed,
        plan,
        expiresAt,
        willRenew,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
