import type { Fax } from '@/types/fax';

function iso(daysAgo: number, hour = 14, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function confirmation() {
  const a = Math.floor(10000 + Math.random() * 89999);
  const b = Array.from({ length: 3 })
    .map(() => 'ABCDEFGHJKMNPQRSTUVWXYZ'[Math.floor(Math.random() * 23)])
    .join('');
  return `FX-${a}-${b}`;
}

export const FAX_SEED: Fax[] = [
  {
    id: 'fx-1',
    recipientLabel: 'Dr. Patel — Patient form',
    recipientNumber: '+16175550142',
    pages: 3,
    status: 'delivered',
    sentAt: iso(0, 14, 34),
    deliveredAt: iso(0, 14, 34),
    durationSeconds: 47,
    confirmationNumber: confirmation(),
  },
  {
    id: 'fx-2',
    recipientLabel: 'Cigna claim 4471-A',
    recipientNumber: '+18005551234',
    pages: 5,
    status: 'pending',
    sentAt: iso(1, 9, 12),
  },
  {
    id: 'fx-3',
    recipientLabel: 'Lease agreement — pg 4–7',
    recipientNumber: '+12125550199',
    pages: 4,
    status: 'failed',
    sentAt: iso(5, 11, 4),
    failureReason: 'The receiving fax line was busy.',
    attemptCount: 1,
  },
  {
    id: 'fx-4',
    recipientLabel: 'IRS Form 8821',
    recipientNumber: '+18005551040',
    pages: 2,
    status: 'delivered',
    sentAt: iso(8, 16, 21),
    deliveredAt: iso(8, 16, 22),
    durationSeconds: 38,
    confirmationNumber: confirmation(),
  },
  {
    id: 'fx-5',
    recipientLabel: 'Allstate adjuster',
    recipientNumber: '+18004222277',
    pages: 6,
    status: 'delivered',
    sentAt: iso(12, 10, 51),
    deliveredAt: iso(12, 10, 53),
    durationSeconds: 92,
    confirmationNumber: confirmation(),
  },
  {
    id: 'fx-6',
    recipientLabel: 'Mercy Hospital records',
    recipientNumber: '+16174442000',
    pages: 12,
    status: 'delivered',
    sentAt: iso(17, 15, 8),
    deliveredAt: iso(17, 15, 11),
    durationSeconds: 165,
    confirmationNumber: confirmation(),
  },
  {
    id: 'fx-7',
    recipientLabel: 'Anya P. — Lease addendum',
    recipientNumber: '+13105550411',
    pages: 8,
    status: 'delivered',
    sentAt: iso(20, 12, 27),
    deliveredAt: iso(20, 12, 29),
    durationSeconds: 112,
    confirmationNumber: confirmation(),
  },
  {
    id: 'fx-8',
    recipientLabel: 'BCBS pre-auth',
    recipientNumber: '+18007728777',
    pages: 1,
    status: 'failed',
    sentAt: iso(22, 8, 2),
    failureReason: "The recipient's fax did not answer.",
    attemptCount: 2,
  },
  {
    id: 'fx-9',
    recipientLabel: 'Patel & Wright LLP',
    recipientNumber: '+12025558821',
    pages: 4,
    status: 'delivered',
    sentAt: iso(25, 17, 45),
    deliveredAt: iso(25, 17, 46),
    durationSeconds: 54,
    confirmationNumber: confirmation(),
  },
];
