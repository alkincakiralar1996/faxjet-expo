export type FaxStatus = 'delivered' | 'pending' | 'failed';

export type CoverPage = {
  to: string;
  from: string;
  subject: string;
  message: string;
};

export type FaxPage = {
  id: string;
  /** Local URI of captured/picked image, mock-only placeholder string for now. */
  uri: string;
  width: number;
  height: number;
};

export type Fax = {
  id: string;
  recipientLabel: string;
  recipientNumber: string;
  pages: number;
  pagesList?: FaxPage[];
  cover?: CoverPage;
  status: FaxStatus;
  /** ISO string */
  sentAt: string;
  /** ISO string, only if delivered */
  deliveredAt?: string;
  /** seconds elapsed during transmission, only if delivered */
  durationSeconds?: number;
  confirmationNumber?: string;
  failureReason?: string;
  attemptCount?: number;
};

export type SendPayload = {
  recipientLabel?: string;
  recipientNumber: string;
  pages: number;
  cover?: CoverPage;
};
