import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { CoverPagePreview } from '@/components/faxjet/CoverPagePreview';
import { Icon } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { useSendDraftStore } from '@/stores/sendDraftStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { formatPhone, toE164US } from '@/lib/format';

export default function Recipient() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pageCount = useSendDraftStore((s) => s.pageCount);
  const documentTitle = useSendDraftStore((s) => s.documentTitle);
  const recipientNumber = useSendDraftStore((s) => s.recipientNumber);
  const country = useSendDraftStore((s) => s.recipientCountry);
  const coverEnabled = useSendDraftStore((s) => s.coverEnabled);
  const cover = useSendDraftStore((s) => s.cover);
  const setRecipientNumber = useSendDraftStore((s) => s.setRecipientNumber);
  const setCoverEnabled = useSendDraftStore((s) => s.setCoverEnabled);
  const setCoverField = useSendDraftStore((s) => s.setCoverField);
  const canSendFax = useSubscriptionStore((s) => s.canSendFax);

  const [focused, setFocused] = useState(false);

  const digits = recipientNumber.replace(/\D/g, '').slice(0, 10);
  const formatted = formatPhone(digits);
  const valid = digits.length === 10;
  const totalPages = (pageCount || 1) + (coverEnabled ? 1 : 0);

  const onChangeNumber = (raw: string) => {
    setRecipientNumber(raw);
  };

  const onSend = () => {
    if (!valid) return;
    const recipient = toE164US(digits);
    // Gate: subscribers send; everyone else sees the paywall, which proceeds
    // to the send on a successful purchase (draft is preserved in the store).
    if (!canSendFax()) {
      router.navigate({ pathname: '/(app)/paywall', params: { recipient } });
      return;
    }
    router.navigate({
      pathname: '/(app)/(tabs)/(home)/send/sending',
      params: { recipient },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray50, paddingTop: insets.top }}>
      <TopBar
        left={<IconButton name="chevron-left" onPress={() => router.back()} />}
        center={
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
            Send Fax
          </Text>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 140,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Summary card */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <View
              style={{
                width: 44,
                height: 56,
                backgroundColor: colors.gray50,
                borderRadius: 6,
                borderWidth: 0.5,
                borderColor: colors.gray300,
                padding: 4,
              }}
            >
              {[100, 60, 80, 50, 70].map((w, i) => (
                <View
                  key={i}
                  style={{
                    height: 2,
                    marginBottom: 3,
                    backgroundColor: colors.gray300,
                    borderRadius: 1,
                    width: `${w}%`,
                  }}
                />
              ))}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 16, fontWeight: '600', color: colors.black }}
              >
                {documentTitle}
              </Text>
              <Text style={{ fontSize: 13, color: colors.gray500 }}>
                {coverEnabled
                  ? `${pageCount} pages + cover · ${totalPages} total`
                  : `${pageCount} pages · ready to send`}
              </Text>
            </View>
            <HapticPressable
              haptic="light"
              onPress={() => router.back()}
              style={{ padding: 6 }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: '600', color: colors.green700 }}
              >
                Edit
              </Text>
            </HapticPressable>
          </View>

          {/* Form card */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: colors.gray700,
                marginBottom: 8,
              }}
            >
              Recipient fax number
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
              <HapticPressable
                haptic="light"
                onPress={() => router.navigate('/(app)/(tabs)/(home)/send/country')}
                style={{
                  height: 56,
                  paddingHorizontal: 12,
                  backgroundColor: colors.gray100,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  minWidth: 92,
                }}
                accessibilityRole="button"
                accessibilityLabel="Country code"
              >
                <Icon name="flag-us" size={20} />
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
                  +1
                </Text>
                <Icon name="chevron-down" size={14} color={colors.gray500} />
              </HapticPressable>
              <View
                style={{
                  flex: 1,
                  padding: focused ? 4 : 0,
                  borderRadius: 14,
                  backgroundColor: focused ? colors.green100 : 'transparent',
                }}
              >
              <View
                style={{
                  height: 56,
                  backgroundColor: colors.gray100,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: focused ? colors.green500 : 'transparent',
                }}
              >
                <TextInput
                  value={formatted}
                  onChangeText={onChangeNumber}
                  placeholder="(555) 123-4567"
                  placeholderTextColor={colors.gray500}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{
                    flex: 1,
                    fontSize: 17,
                    color: colors.black,
                  }}
                />
              </View>
              </View>
            </View>
            <Text
              style={{
                fontSize: 11,
                color: colors.gray500,
                marginBottom: 18,
              }}
            >
              {country === 'US'
                ? 'Enter the US fax number you want to send to'
                : 'Enter the Canadian fax number you want to send to'}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                borderTopWidth: 0.5,
                borderTopColor: colors.gray100,
                borderBottomWidth: coverEnabled ? 0.5 : 0,
                borderBottomColor: colors.gray100,
              }}
            >
              <View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
                  Add cover page
                </Text>
                <Text style={{ fontSize: 13, color: colors.gray500 }}>
                  {coverEnabled ? 'Adds 1 page · auto-generated' : 'Optional · adds 1 page'}
                </Text>
              </View>
              <Toggle on={coverEnabled} onChange={setCoverEnabled} />
            </View>

            {coverEnabled ? (
              <View style={{ marginTop: 16, gap: 14 }}>
                <CoverField
                  label="To"
                  value={cover.to}
                  placeholder="Dr. Sarah Chen"
                  onChange={(v) => setCoverField('to', v)}
                />
                <CoverField
                  label="From"
                  value={cover.from}
                  placeholder="Marcus Wright"
                  onChange={(v) => setCoverField('from', v)}
                />
                <CoverField
                  label="Subject"
                  value={cover.subject}
                  placeholder="Patient Intake — John Doe"
                  onChange={(v) => setCoverField('subject', v)}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '700',
                      color: colors.gray700,
                      marginBottom: 6,
                    }}
                  >
                    Message
                  </Text>
                  <TextInput
                    multiline
                    value={cover.message}
                    onChangeText={(v) => setCoverField('message', v)}
                    placeholder="Add a short note for the recipient…"
                    placeholderTextColor={colors.gray500}
                    style={{
                      minHeight: 96,
                      backgroundColor: colors.gray100,
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 15,
                      color: colors.black,
                      textAlignVertical: 'top',
                    }}
                  />
                </View>
              </View>
            ) : null}
          </View>

          {coverEnabled ? (
            <View style={{ marginTop: 16 }}>
              <CoverPagePreview cover={cover} totalPages={pageCount} />
            </View>
          ) : null}

          {/* Trust footer */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 20,
            }}
          >
            <Icon name="lock-shield" size={14} color={colors.green700} />
            <Text style={{ fontSize: 13, color: colors.gray500 }}>
              HIPAA-compliant · 256-bit encrypted
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Anchored send */}
      <BlurView
        intensity={28}
        tint="light"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: insets.bottom + 16,
          backgroundColor: 'rgba(250,250,247,0.78)',
          borderTopWidth: 0.5,
          borderTopColor: colors.gray100,
        }}
      >
        <Button
          label={
            coverEnabled
              ? `Send Fax · ${pageCount + 1} pages`
              : `Send Fax · ${pageCount} ${pageCount === 1 ? 'page' : 'pages'}`
          }
          icon="paperplane-fill"
          disabled={!valid}
          onPress={onSend}
        />
        <Text
          style={{
            fontSize: 11,
            color: colors.gray500,
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          Delivery typically takes 30–90 seconds
        </Text>
      </BlurView>
    </View>
  );
}

function CoverField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <View>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: colors.gray700,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.gray500}
        style={{
          height: 48,
          backgroundColor: colors.gray100,
          borderRadius: 10,
          paddingHorizontal: 14,
          fontSize: 15,
          color: colors.black,
        }}
      />
    </View>
  );
}
