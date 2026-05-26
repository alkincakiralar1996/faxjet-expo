import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { format } from 'date-fns';
import { colors } from '@/theme/tokens';
import type { CoverPage } from '@/types/fax';

export type CoverPagePreviewProps = {
  cover: CoverPage;
  totalPages: number;
};

export function CoverPagePreview({ cover, totalPages }: CoverPagePreviewProps) {
  const now = format(new Date(), "MMM d, yyyy · h:mm a");
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
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
          color: colors.gray500,
          letterSpacing: 0.78,
          marginBottom: 10,
        }}
      >
        COVER PAGE PREVIEW
      </Text>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: colors.gray300,
          borderRadius: 6,
          padding: 14,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Image
            source={require('@/assets/images/icon.png')}
            style={{ width: 24, height: 24, borderRadius: 5 }}
          />
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.black }}>
            FaxJet · Cover Page
          </Text>
        </View>
        {[
          ['To', cover.to || '—'],
          ['From', cover.from || '—'],
          ['Subject', cover.subject || '—'],
          ['Pages', `${totalPages} + this cover`],
          ['Sent', now],
        ].map(([k, v]) => (
          <View
            key={k}
            style={{ flexDirection: 'row', marginBottom: 6 }}
          >
            <Text
              style={{
                width: 60,
                fontSize: 11,
                color: colors.gray500,
              }}
            >
              {k}
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 11,
                color: colors.black,
                fontWeight: '500',
              }}
            >
              {v}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
