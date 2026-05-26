import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Fax, FaxStatus } from '@/types/fax';
import { FAX_SEED } from '@/mocks/faxSeed';
import { asyncStorage } from './persist';

export type FilterOption = 'All' | 'Delivered' | 'Pending' | 'Failed';

type State = {
  faxes: Fax[];
  filter: FilterOption;
  hydrated: boolean;
};

type Actions = {
  addFax: (fax: Fax) => void;
  updateFax: (id: string, patch: Partial<Fax>) => void;
  setFilter: (f: FilterOption) => void;
  clear: () => void;
  resetSeed: () => void;
  setHydrated: () => void;
  getById: (id: string) => Fax | undefined;
  filtered: () => Fax[];
};

const filterMap: Record<FilterOption, FaxStatus | 'all'> = {
  All: 'all',
  Delivered: 'delivered',
  Pending: 'pending',
  Failed: 'failed',
};

export const useFaxStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      faxes: FAX_SEED,
      filter: 'All',
      hydrated: false,
      addFax: (fax) => set((s) => ({ faxes: [fax, ...s.faxes] })),
      updateFax: (id, patch) =>
        set((s) => ({
          faxes: s.faxes.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        })),
      setFilter: (filter) => set({ filter }),
      clear: () => set({ faxes: [] }),
      resetSeed: () => set({ faxes: FAX_SEED }),
      setHydrated: () => set({ hydrated: true }),
      getById: (id) => get().faxes.find((f) => f.id === id),
      filtered: () => {
        const target = filterMap[get().filter];
        if (target === 'all') return get().faxes;
        return get().faxes.filter((f) => f.status === target);
      },
    }),
    {
      name: 'faxjet.fax',
      storage: createJSONStorage(() => asyncStorage),
      partialize: ({ faxes }) => ({ faxes }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
