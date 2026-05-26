import { create } from 'zustand';
import type { CoverPage } from '@/types/fax';

export type SendSource = 'camera' | 'photo' | 'files' | null;

type State = {
  source: SendSource;
  pageCount: number;
  documentTitle: string;
  recipientNumber: string;
  recipientCountry: 'US' | 'CA';
  coverEnabled: boolean;
  cover: CoverPage;
};

type Actions = {
  startDraft: (source: Exclude<SendSource, null>, pageCount?: number) => void;
  addPage: () => void;
  removePage: () => void;
  setRecipientNumber: (n: string) => void;
  setRecipientCountry: (c: 'US' | 'CA') => void;
  setCoverEnabled: (v: boolean) => void;
  setCoverField: (k: keyof CoverPage, v: string) => void;
  setCover: (c: CoverPage) => void;
  reset: () => void;
};

const DEFAULT_COVER: CoverPage = {
  to: '',
  from: '',
  subject: '',
  message: '',
};

const INITIAL: State = {
  source: null,
  pageCount: 0,
  documentTitle: 'New Document',
  recipientNumber: '',
  recipientCountry: 'US',
  coverEnabled: false,
  cover: DEFAULT_COVER,
};

export const useSendDraftStore = create<State & Actions>((set) => ({
  ...INITIAL,
  startDraft: (source, pageCount = 3) =>
    set({
      ...INITIAL,
      source,
      pageCount,
      documentTitle:
        source === 'camera'
          ? 'Scanned Document'
          : source === 'photo'
            ? 'Photo Fax'
            : 'Document',
    }),
  addPage: () => set((s) => ({ pageCount: s.pageCount + 1 })),
  removePage: () =>
    set((s) => ({ pageCount: Math.max(1, s.pageCount - 1) })),
  setRecipientNumber: (recipientNumber) => set({ recipientNumber }),
  setRecipientCountry: (recipientCountry) => set({ recipientCountry }),
  setCoverEnabled: (coverEnabled) => set({ coverEnabled }),
  setCoverField: (k, v) =>
    set((s) => ({ cover: { ...s.cover, [k]: v } })),
  setCover: (cover) => set({ cover }),
  reset: () => set(INITIAL),
}));
