import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { differenceInCalendarDays } from 'date-fns';
import type { Plan, SubscriptionStatus } from '@/types/subscription';
import { secureStorage } from './persist';

type State = {
  status: SubscriptionStatus;
  plan: Plan | null;
  trialEndsAt: string | null;
  nextBillingAt: string | null;
  hydrated: boolean;
};

type Actions = {
  startTrial: (plan: Plan) => void;
  markPastDue: () => void;
  cancel: () => void;
  resubscribe: (plan?: Plan) => void;
  expire: () => void;
  reset: () => void;
  setHydrated: () => void;
  isInTrial: () => boolean;
  daysLeftInTrial: () => number;
  canSendFax: () => boolean;
  effectiveStatus: () => SubscriptionStatus;
};

const TRIAL_DAYS = 3;

function isTrialPast(trialEndsAt: string | null): boolean {
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt).getTime() < Date.now();
}

export const useSubscriptionStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      status: 'none',
      plan: null,
      trialEndsAt: null,
      nextBillingAt: null,
      hydrated: false,
      startTrial: (plan) => {
        const ends = new Date();
        ends.setDate(ends.getDate() + TRIAL_DAYS);
        set({
          status: 'trial',
          plan,
          trialEndsAt: ends.toISOString(),
          nextBillingAt: ends.toISOString(),
        });
      },
      markPastDue: () => set({ status: 'past_due' }),
      cancel: () => set({ status: 'cancelled' }),
      resubscribe: (plan) =>
        set((s) => ({
          status: 'active',
          plan: plan ?? s.plan ?? 'weekly',
          trialEndsAt: null,
          nextBillingAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        })),
      expire: () => set({ status: 'expired', trialEndsAt: null }),
      reset: () =>
        set({
          status: 'none',
          plan: null,
          trialEndsAt: null,
          nextBillingAt: null,
        }),
      setHydrated: () => set({ hydrated: true }),
      isInTrial: () => get().effectiveStatus() === 'trial',
      daysLeftInTrial: () => {
        const ends = get().trialEndsAt;
        if (!ends) return 0;
        return Math.max(
          0,
          differenceInCalendarDays(new Date(ends), new Date()),
        );
      },
      canSendFax: () => {
        const s = get().effectiveStatus();
        return s === 'trial' || s === 'active' || s === 'cancelled';
      },
      effectiveStatus: () => {
        const { status, trialEndsAt } = get();
        if (status === 'trial' && isTrialPast(trialEndsAt)) {
          return 'expired';
        }
        return status;
      },
    }),
    {
      name: 'faxjet.subscription',
      storage: createJSONStorage(() => secureStorage),
      partialize: ({ status, plan, trialEndsAt, nextBillingAt }) => ({
        status,
        plan,
        trialEndsAt,
        nextBillingAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
