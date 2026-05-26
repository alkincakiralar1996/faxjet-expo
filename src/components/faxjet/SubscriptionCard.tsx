import { Text, View } from 'react-native';
import { format } from 'date-fns';
import { colors } from '@/theme/tokens';
import { Button } from '@/components/ui/Button';
import { TrialPill } from './TrialPill';
import { Icon } from '@/icons/Icon';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

const PLAN_LABEL = {
  weekly: 'Unlimited Weekly',
  monthly: 'Unlimited Monthly',
  single: 'Single Fax',
} as const;

const PLAN_PRICE = {
  weekly: '$9.99/week',
  monthly: '$19.99/month',
  single: '$4.99',
} as const;

export function SubscriptionCard({
  onManage,
  onResubscribe,
}: {
  onManage?: () => void;
  onResubscribe?: () => void;
}) {
  const status = useSubscriptionStore((s) => s.status);
  const plan = useSubscriptionStore((s) => s.plan) ?? 'weekly';
  const daysLeft = useSubscriptionStore((s) => s.daysLeftInTrial());
  const trialEndsAt = useSubscriptionStore((s) => s.trialEndsAt);
  const nextBillingAt = useSubscriptionStore((s) => s.nextBillingAt);

  const planLabel = PLAN_LABEL[plan];
  const planPrice = PLAN_PRICE[plan];

  if (status === 'cancelled') {
    const endsLabel = trialEndsAt
      ? format(new Date(trialEndsAt), 'MMM d, yyyy')
      : '—';
    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 18,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: colors.gray500,
            letterSpacing: 0.78,
            marginBottom: 2,
          }}
        >
          CANCELLED · STILL ACTIVE
        </Text>
        <Text
          style={{
            fontSize: 17,
            fontWeight: '600',
            color: colors.black,
          }}
        >
          {planLabel}
        </Text>
        <Text style={{ fontSize: 13, color: colors.gray500, marginTop: 2 }}>
          {planPrice} · You won&apos;t be charged again
        </Text>

        <View
          style={{
            backgroundColor: colors.gray50,
            borderRadius: 10,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: 14,
            marginBottom: 14,
          }}
        >
          <Icon name="clock" size={18} color={colors.gray500} />
          <Text style={{ flex: 1, fontSize: 13, color: colors.gray700, lineHeight: 18 }}>
            Your subscription ends on{' '}
            <Text style={{ fontWeight: '700' }}>{endsLabel}</Text>. You can keep
            sending faxes until then.
          </Text>
        </View>

        <Button kind="secondary" label="Resubscribe" onPress={onResubscribe} />
      </View>
    );
  }

  const nextBillingLabel = nextBillingAt
    ? format(new Date(nextBillingAt), 'MMM d')
    : '—';

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 14,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: colors.green700,
              letterSpacing: 0.78,
              marginBottom: 2,
            }}
          >
            ACTIVE PLAN
          </Text>
          <Text
            style={{ fontSize: 17, fontWeight: '600', color: colors.black }}
          >
            {planLabel}
          </Text>
          <Text style={{ fontSize: 13, color: colors.gray500, marginTop: 2 }}>
            {planPrice} · Renews {nextBillingLabel}
          </Text>
        </View>
        {status === 'trial' ? (
          <TrialPill label={`TRIAL · ${daysLeft} ${daysLeft === 1 ? 'DAY' : 'DAYS'} LEFT`} />
        ) : null}
        {status === 'past_due' ? <TrialPill label="PAST DUE" tone="danger" /> : null}
      </View>
      <Button kind="secondary" label="Manage Subscription" onPress={onManage} />
    </View>
  );
}
