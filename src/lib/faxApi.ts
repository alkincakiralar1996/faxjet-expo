import type { CoverPage, Fax, FaxStatus } from '@/types/fax';
import { getWithRetry, postWithRetry } from './api';

// Shape returned by the jetfax-nextjs faxes API (drizzle camelCase, ISO dates).
export type ServerFax = {
  id: string;
  userId: string | null;
  recipientLabel: string | null;
  recipientNumber: string;
  recipientCountry: string | null;
  pageCount: number;
  hasCover: boolean;
  cover: CoverPage | null;
  status: FaxStatus;
  confirmationNumber: string | null;
  failureReason: string | null;
  durationSeconds: number | null;
  sentAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
};

export type CreateFaxInput = {
  user_id?: string | null;
  recipient_label?: string;
  recipient_number: string;
  recipient_country?: string;
  page_count: number;
  has_cover?: boolean;
  cover?: CoverPage;
  status?: FaxStatus;
  duration_seconds?: number;
  failure_reason?: string;
};

export async function createFax(
  input: CreateFaxInput,
): Promise<ServerFax | null> {
  const res = await postWithRetry<{ fax: ServerFax }>('/api/faxes', input);
  return res?.fax ?? null;
}

export async function listFaxes(userId: string): Promise<ServerFax[]> {
  const res = await getWithRetry<{ faxes: ServerFax[] }>(
    `/api/faxes?user_id=${encodeURIComponent(userId)}`,
  );
  return res?.faxes ?? [];
}

export async function getFax(id: string): Promise<ServerFax | null> {
  const res = await getWithRetry<{ fax: ServerFax }>(`/api/faxes/${id}`);
  return res?.fax ?? null;
}

// Map a server fax onto the app's local Fax shape. Page image URIs (pagesList)
// are NOT part of the server record — they are loaded separately from device
// storage (faxStorage.getPages) keyed by fax id.
export function serverFaxToLocal(s: ServerFax): Fax {
  return {
    id: s.id,
    recipientLabel: s.recipientLabel ?? s.recipientNumber,
    recipientNumber: s.recipientNumber,
    pages: s.pageCount,
    cover: s.cover ?? undefined,
    status: s.status,
    sentAt: s.sentAt ?? s.createdAt,
    deliveredAt: s.deliveredAt ?? undefined,
    durationSeconds: s.durationSeconds ?? undefined,
    confirmationNumber: s.confirmationNumber ?? undefined,
    failureReason: s.failureReason ?? undefined,
  };
}
