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

export default function Feedback() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const serverUserId = useUserStore((s) => s.serverUserId);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    const ok = await postWithRetry('/api/feedback', {
      ...(serverUserId ? { user_id: serverUserId } : {}),
      kind: 'feedback',
      message: message.trim(),
      email: email.trim() || undefined,
    });
    setSubmitting(false);
    if (ok) {
      Alert.alert('Thank you!', 'Your feedback helps make FaxJet better.', [
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
            Send Feedback
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
            Ideas, praise, or papercuts — we read every message.
          </Text>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray700 }}>
              Your feedback
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="What could be better?"
              placeholderTextColor={colors.gray500}
              multiline
              style={{
                borderRadius: 12,
                backgroundColor: colors.gray100,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                color: colors.black,
                minHeight: 140,
                textAlignVertical: 'top',
              }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray700 }}>
              Email (optional)
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.gray500}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{
                borderRadius: 12,
                backgroundColor: colors.gray100,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                color: colors.black,
              }}
            />
          </View>

          <Button
            label={submitting ? 'Sending…' : 'Send Feedback'}
            disabled={!message.trim() || submitting}
            onPress={submit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
