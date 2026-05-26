import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { Icon } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { useSendDraftStore } from '@/stores/sendDraftStore';
import { trigger } from '@/hooks/useHaptics';

type Country = {
  id: 'US' | 'CA' | 'UK' | 'DE' | 'FR';
  name: string;
  code: string;
  flag: () => React.ReactNode;
  disabled?: boolean;
};

const AVAILABLE: Country[] = [
  { id: 'US', name: 'United States', code: '+1', flag: () => <Icon name="flag-us" size={22} /> },
  {
    id: 'CA',
    name: 'Canada',
    code: '+1',
    flag: () => (
      <Svg width={22} height={14} viewBox="0 0 22 14">
        <Rect width={22} height={14} fill="#D52B1E" />
        <Rect x={5.5} y={0} width={11} height={14} fill="#FFFFFF" />
        <Path
          d="M11 3 L11.6 5 L13.5 5 L12 6.3 L12.5 8.5 L11 7 L9.5 8.5 L10 6.3 L8.5 5 L10.4 5 Z"
          fill="#D52B1E"
        />
      </Svg>
    ),
  },
];

const COMING: Country[] = [
  { id: 'UK', name: 'United Kingdom', code: '+44', flag: () => <FlagPill colors={['#012169', '#FFFFFF', '#C8102E']} />, disabled: true },
  { id: 'DE', name: 'Germany', code: '+49', flag: () => <FlagPill colors={['#000000', '#DD0000', '#FFCE00']} />, disabled: true },
  { id: 'FR', name: 'France', code: '+33', flag: () => <FlagPill colors={['#0055A4', '#FFFFFF', '#EF4135']} />, disabled: true },
];

export default function CountryPicker() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const selected = useSendDraftStore((s) => s.recipientCountry);
  const setCountry = useSendDraftStore((s) => s.setRecipientCountry);

  const pick = (c: Country) => {
    if (c.disabled) return;
    if (c.id !== 'US' && c.id !== 'CA') return;
    trigger('selection');
    setCountry(c.id);
    router.dismiss();
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={{
          position: 'absolute',
          inset: 0 as never,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(10,10,10,0.5)',
        }}
      >
        <Pressable
          accessibilityLabel="Close"
          onPress={() => router.dismiss()}
          style={{ flex: 1 }}
        />
      </Animated.View>
      <Animated.View
        entering={SlideInDown.duration(280)}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: '70%',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 12,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 9999,
            backgroundColor: colors.gray300,
            alignSelf: 'center',
            marginBottom: 12,
          }}
        />
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 12,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: '600', color: colors.black, letterSpacing: -0.22 }}>
            Select country
          </Text>
          <Pressable onPress={() => router.dismiss()}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.green700 }}>
              Done
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <View
            style={{
              height: 44,
              backgroundColor: colors.gray100,
              borderRadius: 10,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-3.5-3.5"
                stroke={colors.gray500}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
            <TextInput
              placeholder="Search country"
              placeholderTextColor={colors.gray500}
              style={{ flex: 1, fontSize: 15, color: colors.black }}
              editable={false}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
          <SectionTitle text="Available in v1" />
          <SectionCard>
            {AVAILABLE.map((c, i) => (
              <CountryRow
                key={c.id}
                country={c}
                isLast={i === AVAILABLE.length - 1}
                selected={selected === c.id}
                onPress={() => pick(c)}
              />
            ))}
          </SectionCard>

          <SectionTitle text="Coming in v2" />
          <SectionCard>
            {COMING.map((c, i) => (
              <CountryRow
                key={c.id}
                country={c}
                isLast={i === COMING.length - 1}
                selected={false}
                onPress={() => {}}
              />
            ))}
          </SectionCard>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <Text
      style={{
        fontSize: 13,
        fontWeight: '700',
        color: colors.gray500,
        letterSpacing: 0.78,
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 6,
        textTransform: 'uppercase',
      }}
    >
      {text}
    </Text>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.gray100,
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </View>
  );
}

function CountryRow({
  country,
  selected,
  isLast,
  onPress,
}: {
  country: Country;
  selected: boolean;
  isLast: boolean;
  onPress: () => void;
}) {
  const disabled = country.disabled;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: colors.gray100,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {country.flag()}
      <Text style={{ flex: 1, fontSize: 16, color: colors.black }}>
        {country.name}
      </Text>
      <Text style={{ fontSize: 13, color: colors.gray500 }}>{country.code}</Text>
      {selected ? <Icon name="check" size={18} color={colors.green700} /> : null}
      {disabled ? (
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 9999,
            backgroundColor: colors.gray100,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              color: colors.gray500,
              letterSpacing: 0.4,
            }}
          >
            SOON
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function FlagPill({ colors }: { colors: string[] }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: 22,
        height: 14,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {colors.map((c, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: c }} />
      ))}
    </View>
  );
}
