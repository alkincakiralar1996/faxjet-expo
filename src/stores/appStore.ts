import { create } from 'zustand';

type State = {
  networkStatus: 'connected' | 'disconnected';
  forceNetworkError: boolean;
  forceTrialEndingTomorrow: boolean;
  forcePastDue: boolean;
};

type Actions = {
  setNetworkStatus: (s: 'connected' | 'disconnected') => void;
  toggleForceNetworkError: () => void;
  toggleForceTrialEndingTomorrow: () => void;
  toggleForcePastDue: () => void;
};

export const useAppStore = create<State & Actions>((set) => ({
  networkStatus: 'connected',
  forceNetworkError: false,
  forceTrialEndingTomorrow: false,
  forcePastDue: false,
  setNetworkStatus: (networkStatus) => set({ networkStatus }),
  toggleForceNetworkError: () =>
    set((s) => ({ forceNetworkError: !s.forceNetworkError })),
  toggleForceTrialEndingTomorrow: () =>
    set((s) => ({
      forceTrialEndingTomorrow: !s.forceTrialEndingTomorrow,
    })),
  toggleForcePastDue: () => set((s) => ({ forcePastDue: !s.forcePastDue })),
}));
