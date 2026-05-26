import { format, formatDistanceToNowStrict, isToday, isYesterday } from 'date-fns';

export function formatFaxTimestamp(iso: string): string {
  const d = new Date(iso);
  if (isToday(d)) return `Today, ${format(d, 'h:mm a')}`;
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
}

export function formatFaxDetailTimestamp(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy 'at' h:mm a");
}

export function formatLongTimestamp(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy · h:mm:ss a");
}

export function formatRelative(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
}

export function formatPhone(digits: string): string {
  const clean = digits.replace(/\D/g, '').slice(0, 10);
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `(${clean.slice(0, 3)}) ${clean.slice(3)}`;
  return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
}

export function formatPhoneDisplay(e164: string): string {
  const digits = e164.replace(/\D/g, '');
  if (digits.startsWith('1') && digits.length === 11) {
    return formatPhone(digits.slice(1));
  }
  return formatPhone(digits);
}

export function toE164US(digits: string): string {
  const clean = digits.replace(/\D/g, '').slice(0, 10);
  return clean.length === 10 ? `+1${clean}` : digits;
}
