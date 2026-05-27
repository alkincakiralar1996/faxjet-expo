import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Segment } from '@/types/user';
import { asyncStorage } from './persist';

type State = {
  hasSeenWelcome: boolean;
  segment: Segment | null;
  onboardingCompleted: boolean;
  hydrated: boolean;
};

type Actions = {
  setHasSeenWelcome: (v: boolean) => void;
  setSegment: (s: Segment) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setHydrated: () => void;
};

export const useUserStore = create<State & Actions>()(
  persist(
    (set) => ({
      hasSeenWelcome: false,
      segment: null,
      onboardingCompleted: false,
      hydrated: false,
      setHasSeenWelcome: (v) => set({ hasSeenWelcome: v }),
      setSegment: (segment) => set({ segment }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      resetOnboarding: () =>
        set({
          hasSeenWelcome: false,
          segment: null,
          onboardingCompleted: false,
        }),
      setHydrated: () => set({ hydrated: true }),
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
