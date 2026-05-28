import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Segment } from '@/types/user';
import { asyncStorage } from './persist';
import { backgroundPatch, backgroundPost } from '@/lib/api';

type State = {
  hasSeenWelcome: boolean;
  segment: Segment | null;
  onboardingCompleted: boolean;
  hydrated: boolean;
  // Server-assigned user id (from boot device-sync). Not persisted here —
  // the Keychain (identity.ts) is the cross-launch source of truth.
  serverUserId: string | null;
};

type Actions = {
  setHasSeenWelcome: (v: boolean) => void;
  setSegment: (s: Segment) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setHydrated: () => void;
  setServerUserId: (id: string | null) => void;
};

export const useUserStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      hasSeenWelcome: false,
      segment: null,
      onboardingCompleted: false,
      hydrated: false,
      serverUserId: null,
      setHasSeenWelcome: (v) => set({ hasSeenWelcome: v }),
      setSegment: (segment) => {
        set({ segment });
        const id = get().serverUserId;
        if (id) backgroundPatch('/api/users', { id, segment });
      },
      completeOnboarding: () => {
        set({ onboardingCompleted: true });
        const id = get().serverUserId;
        if (id) {
          backgroundPatch('/api/users', {
            id,
            has_onboarding_complete: true,
          });
          backgroundPost('/api/events', {
            user_id: id,
            name: 'onboarding_completed',
          });
        }
      },
      resetOnboarding: () =>
        set({
          hasSeenWelcome: false,
          segment: null,
          onboardingCompleted: false,
        }),
      setHydrated: () => set({ hydrated: true }),
      setServerUserId: (id) => set({ serverUserId: id }),
    }),
    {
      name: 'faxjet.user',
      storage: createJSONStorage(() => asyncStorage),
      partialize: ({ hasSeenWelcome, segment, onboardingCompleted }) => ({
        hasSeenWelcome,
        segment,
        onboardingCompleted,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
