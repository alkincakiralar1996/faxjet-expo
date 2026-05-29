import { create } from 'zustand';

type State = {
  networkStatus: 'connected' | 'disconnected';
  forceNetworkError: boolean;
};

type Actions = {
  setNetworkStatus: (s: 'connected' | 'disconnected') => void;
  toggleForceNetworkError: () => void;
};

export const useAppStore = create<State & Actions>((set) => ({
  networkStatus: 'connected',
  forceNetworkError: false,
  setNetworkStatus: (networkStatus) => set({ networkStatus }),
  toggleForceNetworkError: () =>
    set((s) => ({ forceNetworkError: !s.forceNetworkError })),
}));
