import { colors } from './tokens';

export type FaxStatus = 'delivered' | 'pending' | 'failed';

export const statusColors: Record<
  FaxStatus,
  { bg: string; fg: string; label: string }
> = {
  delivered: { bg: colors.green100, fg: colors.success, label: 'Delivered' },
  pending: { bg: colors.amber100, fg: colors.warning, label: 'Pending' },
  failed: { bg: colors.errorBg, fg: colors.error, label: 'Failed' },
};
