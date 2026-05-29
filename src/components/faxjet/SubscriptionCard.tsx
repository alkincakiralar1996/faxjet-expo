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
} as const;

export function SubscriptionCard({
  onManage,
  onSubscribe,
}: {
  onManage?: () => void;
  onSubscribe?: () => void;
}) {
  const isSubscribed = useSubscriptionStore((s) => s.isSubscribed);
  const plan = useSubscriptionStore((s) => s.plan);
  const expiresAt = useSubscriptionStore((s) => s.expiresAt);
  const willRenew = useSubscriptionStore((s) => s.willRenew);

  // Not subscribed → prompt to subscribe.
  if (!isSubscribed) {
    return (
      <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18 }}>
        <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
          No active subscription
        </Text>
        <Text style={{ fontSize: 13, color: colors.gray500, marginTop: 2, marginBottom: 14 }}>
          Subscribe to send faxes from your phone.
        </Text>
        <Button label="View Plans" onPress={onSubscribe} />
      </View>
    );
  }

  const planLabel = plan ? PLAN_LABEL[plan] : 'FaxJet Pro';
  const dateLabel = expiresAt ? format(new Date(expiresAt), 'MMM d, yyyy') : '—';

  return (
    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18 }}>
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
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
            {planLabel}
          </Text>
        </View>
        {!willRenew ? <TrialPill label="CANCELLED" tone="danger" /> : null}
      </View>

      <View
        style={{
          backgroundColor: colors.gray50,
          borderRadius: 10,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 14,
        }}
      >
        <Icon name="clock" size={18} color={colors.gray500} />
        <Text style={{ flex: 1, fontSize: 13, color: colors.gray700, lineHeight: 18 }}>
          {willRenew ? 'Renews on ' : 'Access ends on '}
          <Text style={{ fontWeight: '700' }}>{dateLabel}</Text>
        </Text>
      </View>

      <Button kind="secondary" label="Manage Subscription" onPress={onManage} />
    </View>
  );
}
