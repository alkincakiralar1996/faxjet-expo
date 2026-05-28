import { getWithRetry } from './api';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
};

export async function getFaq(): Promise<FaqItem[]> {
  const res = await getWithRetry<{ faq: FaqItem[] }>('/api/faq');
  return res?.faq ?? [];
}
