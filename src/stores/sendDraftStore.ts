import { create } from 'zustand';
import type { CoverPage } from '@/types/fax';

export type SendSource = 'camera' | 'photo' | 'files' | null;

/** A real captured/picked image page (local device URI). */
export type DraftPage = { uri: string; width: number; height: number };

/** A picked PDF kept as a single attachment (not split into pages). */
export type DraftAttachment = { uri: string; name: string; mime: string };

type State = {
  source: SendSource;
  pages: DraftPage[];
  attachment: DraftAttachment | null;
  /** Derived: attachment ? 1 : pages.length. Kept as a field so screens can
   *  select it directly. */
  pageCount: number;
  documentTitle: string;
  recipientNumber: string;
  recipientCountry: 'US' | 'CA';
  coverEnabled: boolean;
  cover: CoverPage;
};

type Actions = {
  startDraft: (source: Exclude<SendSource, null>) => void;
  setPages: (pages: DraftPage[]) => void;
  addPages: (pages: DraftPage[]) => void;
  removePageAt: (index: number) => void;
  setAttachment: (att: DraftAttachment) => void;
  setRecipientNumber: (n: string) => void;
  setRecipientCountry: (c: 'US' | 'CA') => void;
  setCoverEnabled: (v: boolean) => void;
  setCoverField: (k: keyof CoverPage, v: string) => void;
  setCover: (c: CoverPage) => void;
  reset: () => void;
};

const DEFAULT_COVER: CoverPage = { to: '', from: '', subject: '', message: '' };

const INITIAL: State = {
  source: null,
  pages: [],
  attachment: null,
  pageCount: 0,
  documentTitle: 'New Document',
  recipientNumber: '',
  recipientCountry: 'US',
  coverEnabled: false,
  cover: DEFAULT_COVER,
};

function titleFor(source: Exclude<SendSource, null>): string {
  return source === 'camera'
    ? 'Scanned Document'
    : source === 'photo'
      ? 'Photo Fax'
      : 'Document';
}

export const useSendDraftStore = create<State & Actions>((set) => ({
  ...INITIAL,
  startDraft: (source) =>
    set({ ...INITIAL, pages: [], source, documentTitle: titleFor(source) }),
  setPages: (pages) => set({ pages, attachment: null, pageCount: pages.length }),
  addPages: (incoming) =>
    set((s) => {
      const pages = [...s.pages, ...incoming];
      return { pages, attachment: null, pageCount: pages.length };
    }),
  removePageAt: (index) =>
    set((s) => {
      const pages = s.pages.filter((_, i) => i !== index);
      return { pages, pageCount: pages.length };
    }),
  setAttachment: (attachment) =>
    set({ attachment, pages: [], pageCount: 1 }),
  setRecipientNumber: (recipientNumber) => set({ recipientNumber }),
  setRecipientCountry: (recipientCountry) => set({ recipientCountry }),
  setCoverEnabled: (coverEnabled) => set({ coverEnabled }),
  setCoverField: (k, v) => set((s) => ({ cover: { ...s.cover, [k]: v } })),
  setCover: (cover) => set({ cover }),
  reset: () => set({ ...INITIAL, pages: [] }),
}));
