import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/tokens';
import { useUserStore } from '@/stores/userStore';
import { postWithRetry } from '@/lib/api';

export default function ContactSupport() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const serverUserId = useUserStore((s) => s.serverUserId);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    const ok = await postWithRetry('/api/feedback', {
      ...(serverUserId ? { user_id: serverUserId } : {}),
      kind: 'support',
      subject: subject.trim() || undefined,
      message: message.trim(),
      email: email.trim() || undefined,
    });
    setSubmitting(false);
    if (ok) {
      Alert.alert('Message sent', 'Our team will get back to you soon.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Could not send', 'Please try again in a moment.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray50, paddingTop: insets.top }}>
      <TopBar
        left={<IconButton name="chevron-left" onPress={() => router.back()} />}
        center={
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
            Contact Support
          </Text>
        }
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 44}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 24, gap: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontSize: 15, color: colors.gray700, lineHeight: 21 }}>
            Tell us what&apos;s going on and we&apos;ll help. Add your email if
            you&apos;d like a reply.
          </Text>

          <Field label="Subject">
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="What do you need help with?"
              placeholderTextColor={colors.gray500}
              style={inputStyle}
            />
          </Field>

          <Field label="Message">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Describe the issue…"
              placeholderTextColor={colors.gray500}
              multiline
              style={[inputStyle, { minHeight: 120, paddingTop: 14, textAlignVertical: 'top' }]}
            />
          </Field>

          <Field label="Email (optional)">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.gray500}
              autoCapitalize="none"
              keyboardType="email-address"
              style={inputStyle}
            />
          </Field>

          <Button
            label={submitting ? 'Sending…' : 'Send Message'}
            disabled={!message.trim() || submitting}
            onPress={submit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const inputStyle = {
  borderRadius: 12,
  backgroundColor: colors.gray100,
  borderWidth: 1.5,
  borderColor: 'transparent' as const,
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontSize: 16,
  color: colors.black,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray700 }}>
        {label}
      </Text>
      {children}
    </View>
  );
}
