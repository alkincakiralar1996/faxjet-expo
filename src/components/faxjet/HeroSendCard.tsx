import { Text, View } from 'react-native';
import { PaperPlane } from './PaperPlane';
import { Icon } from '@/icons/Icon';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { colors } from '@/theme/tokens';

export type HeroSendCardProps = {
  locked?: boolean;
  onPress?: () => void;
};

export function HeroSendCard({ locked = false, onPress }: HeroSendCardProps) {
  return (
    <HapticPressable
      haptic={locked ? 'warning' : 'medium'}
      onPress={onPress}
      style={{
        backgroundColor: colors.green900,
        borderRadius: 24,
        height: 160,
        padding: 24,
        overflow: 'hidden',
        position: 'relative',
        opacity: locked ? 0.92 : 1,
      }}
      accessibilityLabel={locked ? 'Send paused' : 'Send a fax'}
    >
      <View
        style={{
          position: 'absolute',
          right: -20,
          bottom: -30,
        }}
      >
        <PaperPlane size={200} angle={-22} />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '600',
              color: '#FFFFFF',
              letterSpacing: -0.22,
              marginBottom: 4,
            }}
          >
            Send a Fax
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: colors.green100,
              lineHeight: 20,
            }}
          >
            {locked ? 'Update payment to continue' : 'Tap to start · 60 seconds'}
          </Text>
        </View>
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 9999,
            backgroundColor: locked ? 'rgba(255,255,255,0.18)' : colors.amber500,
          }}
        >
          <Icon
            name={locked ? 'lock-shield' : 'plus'}
            size={16}
            color={locked ? '#FFFFFF' : colors.black}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: locked ? '#FFFFFF' : colors.black,
            }}
          >
            {locked ? 'Paused' : 'New Fax'}
          </Text>
        </View>
      </View>
    </HapticPressable>
  );
}
