import type { Fax, SendPayload } from '@/types/fax';

export type SendProgressStage =
  | 'connecting'
  | 'transmitting'
  | 'finalizing';

export type SendProgressEvent = {
  stage: SendProgressStage;
  page: number;
  totalPages: number;
  percent: number;
  label: string;
};

export type SendOutcome =
  | { status: 'delivered'; fax: Fax }
  | { status: 'failed'; fax: Fax; reason: string };

const FAILURE_REASONS = [
  'The receiving fax line was busy.',
  "The recipient's fax did not answer.",
  'Transmission interrupted. Try again.',
];

let counter = 1;

function confirmation(): string {
  const a = Math.floor(10000 + Math.random() * 89999);
  const letters = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const b = Array.from({ length: 3 })
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join('');
  return `FX-${a}-${b}`;
}

export type CancelSend = () => void;

export function startMockSend(
  payload: SendPayload,
  onProgress: (e: SendProgressEvent) => void,
  onDone: (outcome: SendOutcome) => void,
  options: { forceOutcome?: 'delivered' | 'failed'; speed?: number } = {},
): CancelSend {
  const speed = options.speed ?? 1;
  const totalDurationMs = (30 + Math.random() * 60) * 1000 * speed;
  const startedAt = Date.now();
  const willFail =
    options.forceOutcome === 'failed' ||
    (options.forceOutcome !== 'delivered' && Math.random() < 0.1);

  let cancelled = false;
  const timers: ReturnType<typeof setTimeout>[] = [];

  const fire = (e: SendProgressEvent) => {
    if (cancelled) return;
    onProgress(e);
  };

  const totalPages = payload.pages;
  const phases: SendProgressEvent[] = [];

  phases.push({
    stage: 'connecting',
    page: 0,
    totalPages,
    percent: 5,
    label: 'Connecting…',
  });
  phases.push({
    stage: 'connecting',
    page: 0,
    totalPages,
    percent: 15,
    label: 'Connecting…',
  });

  for (let i = 1; i <= totalPages; i++) {
    const startPct = 20 + ((i - 1) / totalPages) * 60;
    const endPct = 20 + (i / totalPages) * 60;
    phases.push({
      stage: 'transmitting',
      page: i,
      totalPages,
      percent: Math.round((startPct + endPct) / 2),
      label: `Transmitting page ${i} of ${totalPages}…`,
    });
  }

  phases.push({
    stage: 'finalizing',
    page: totalPages,
    totalPages,
    percent: 88,
    label: 'Finalizing…',
  });
  phases.push({
    stage: 'finalizing',
    page: totalPages,
    totalPages,
    percent: 100,
    label: 'Finalizing…',
  });

  const step = totalDurationMs / phases.length;

  phases.forEach((evt, idx) => {
    const delay = step * (idx + 1);
    timers.push(setTimeout(() => fire(evt), delay));
  });

  const settleAt = totalDurationMs + 250;
  timers.push(setTimeout(() => {
    if (cancelled) return;
    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    const baseFax: Fax = {
      id: `local-${Date.now()}-${counter++}`,
      recipientLabel:
        payload.recipientLabel ?? formatRecipientLabel(payload.recipientNumber),
      recipientNumber: payload.recipientNumber,
      pages: totalPages + (payload.cover ? 1 : 0),
      sentAt: new Date(startedAt).toISOString(),
      cover: payload.cover,
      status: 'delivered',
    };

    if (willFail) {
      const reason =
        FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)] ??
        FAILURE_REASONS[0]!;
      const fax: Fax = {
        ...baseFax,
        status: 'failed',
        failureReason: reason,
        attemptCount: 1,
      };
      onDone({ status: 'failed', fax, reason });
    } else {
      const fax: Fax = {
        ...baseFax,
        status: 'delivered',
        deliveredAt: new Date().toISOString(),
        durationSeconds,
        confirmationNumber: confirmation(),
      };
      onDone({ status: 'delivered', fax });
    }
  }, settleAt));

  return () => {
    cancelled = true;
    for (const t of timers) clearTimeout(t);
    timers.length = 0;
  };
}

function formatRecipientLabel(e164: string): string {
  return `Fax to ${e164}`;
}
