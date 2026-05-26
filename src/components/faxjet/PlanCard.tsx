import { View, Text, Pressable } from 'react-native';
import { colors } from '@/theme/tokens';
import { shadows } from '@/theme/shadows';
import { trigger } from '@/hooks/useHaptics';
import type { Plan } from '@/types/subscription';

export type PlanVariant = 'decoy' | 'weekly' | 'monthly' | 'weeklyReturn';

export type PlanCardProps = {
  plan: Plan;
  variant: PlanVariant;
  selected: boolean;
  onSelect: () => void;
};

function RadioDot({ selected, color }: { selected: boolean; color: string }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: selected ? color : colors.gray300,
        backgroundColor: selected ? color : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {selected ? (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            backgroundColor: '#FFFFFF',
          }}
        />
      ) : null}
    </View>
  );
}

function PlanDecoy({ selected, onSelect }: PlanCardProps) {
  return (
    <Pressable
      onPress={() => {
        trigger('medium');
        onSelect();
      }}
      style={{
        backgroundColor: colors.gray100,
        borderRadius: 16,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: selected ? colors.gray500 : 'transparent',
      }}
    >
      <View>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
          Send 1 fax
        </Text>
        <Text style={{ fontSize: 13, color: colors.gray700 }}>$4.99 one-time</Text>
      </View>
      <RadioDot selected={selected} color={colors.gray500} />
    </Pressable>
  );
}

function PlanWeekly({ selected, onSelect }: PlanCardProps) {
  return (
    <Pressable
      onPress={() => {
        trigger('medium');
        onSelect();
      }}
      style={[
        {
          backgroundColor: colors.green100,
          borderRadius: 20,
          padding: 18,
          paddingTop: 22,
          borderWidth: 2,
          borderColor: colors.green700,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        selected ? shadows.lg : null,
      ]}
    >
      <View
        style={{
          position: 'absolute',
          top: -10,
          left: 16,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 9999,
          backgroundColor: colors.amber500,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: '700',
            color: colors.black,
            letterSpacing: 0.88,
          }}
        >
          MOST POPULAR
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: '600',
            color: colors.black,
            marginBottom: 6,
          }}
        >
          Unlimited Weekly
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
          <Text style={{ color: colors.green700 }}>3 days free</Text>, then $9.99/week
        </Text>
        <Text style={{ fontSize: 13, color: colors.gray700, marginTop: 2 }}>
          Send unlimited faxes
        </Text>
      </View>
      <RadioDot selected={selected} color={colors.green700} />
    </Pressable>
  );
}

function PlanMonthly({ selected, onSelect }: PlanCardProps) {
  return (
    <Pressable
      onPress={() => {
        trigger('medium');
        onSelect();
      }}
      style={[
        {
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 14,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? colors.green700 : colors.gray300,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        selected ? shadows.md : shadows.sm,
      ]}
    >
      <View>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
          Unlimited Monthly
        </Text>
        <Text style={{ fontSize: 13, color: colors.gray700 }}>$19.99/month</Text>
        <Text style={{ fontSize: 13, color: colors.green700, marginTop: 2 }}>
          Save 50% vs weekly
        </Text>
      </View>
      <RadioDot selected={selected} color={colors.green700} />
    </Pressable>
  );
}

function PlanWeeklyReturn({ selected, onSelect }: PlanCardProps) {
  return (
    <Pressable
      onPress={() => {
        trigger('medium');
        onSelect();
      }}
      style={[
        {
          backgroundColor: selected ? colors.green100 : '#FFFFFF',
          borderRadius: 20,
          padding: 18,
          borderWidth: 2,
          borderColor: selected ? colors.green700 : colors.gray300,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        selected ? shadows.lg : shadows.sm,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: '600',
            color: colors.black,
            marginBottom: 4,
          }}
        >
          Unlimited Weekly
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
          $9.99/week
        </Text>
        <Text style={{ fontSize: 13, color: colors.gray700, marginTop: 2 }}>
          Your previous plan
        </Text>
      </View>
      <RadioDot selected={selected} color={colors.green700} />
    </Pressable>
  );
}

export function PlanCard(props: PlanCardProps) {
  switch (props.variant) {
    case 'decoy':
      return <PlanDecoy {...props} />;
    case 'weekly':
      return <PlanWeekly {...props} />;
    case 'monthly':
      return <PlanMonthly {...props} />;
    case 'weeklyReturn':
      return <PlanWeeklyReturn {...props} />;
  }
}
