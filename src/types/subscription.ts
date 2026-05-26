export type SubscriptionStatus =
  | 'none'
  | 'trial'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired';

export type Plan = 'weekly' | 'monthly' | 'single';
