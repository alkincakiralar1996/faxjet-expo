import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/theme/tokens';

export type DocumentPreviewProps = {
  pageNumber: number;
  totalPages: number;
  variant?: 'large' | 'thumb';
  active?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SAMPLE_FIELDS = [
  ['Patient name', 'Sarah J. Patel'],
  ['Date of birth', '04/12/2018'],
  ['Insurance', 'Cigna · #4471-A'],
  ['Reason for visit', 'Annual wellness exam'],
  ['Allergies', 'Penicillin (mild)'],
  ['Current medications', 'None'],
] as const;

export function DocumentPreview({
  pageNumber,
  totalPages,
  variant = 'large',
  active = false,
  style,
}: DocumentPreviewProps) {
  if (variant === 'thumb') {
    return (
      <View
        style={[
          {
            width: 76,
            height: 100,
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            borderWidth: active ? 2 : 1,
            borderColor: active ? colors.green700 : colors.gray300,
            padding: 8,
            position: 'relative',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: active ? 0.06 : 0.04,
            shadowRadius: active ? 8 : 2,
            elevation: active ? 3 : 1,
          },
          style,
        ]}
      >
        {[100, 70, 90, 60, 80, 40, 70].map((w, i) => (
          <View
            key={i}
            style={{
              height: 3,
              marginBottom: 4,
              backgroundColor: colors.gray300,
              borderRadius: 1,
              width: `${w}%`,
            }}
          />
        ))}
        <View
          style={{
            position: 'absolute',
            bottom: 6,
            left: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 9999,
            backgroundColor: active ? colors.green700 : colors.gray500,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 9,
              fontWeight: '700',
            }}
          >
            {pageNumber}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: '#FFFFFF',
          borderRadius: 8,
          paddingHorizontal: 24,
          paddingVertical: 28,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 3,
          position: 'relative',
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: colors.black,
          marginBottom: 8,
          letterSpacing: 0.5,
        }}
      >
        PATIENT INTAKE FORM
      </Text>
      <Text
        style={{
          fontSize: 9,
          color: colors.gray700,
          marginBottom: 16,
        }}
      >
        Mercy Health · Pediatrics
      </Text>
      {SAMPLE_FIELDS.map(([label, value]) => (
        <View key={label} style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 8,
              color: colors.gray500,
              marginBottom: 2,
              letterSpacing: 0.5,
            }}
          >
            {label.toUpperCase()}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: colors.black,
              borderBottomWidth: 0.5,
              borderBottomColor: colors.gray300,
              paddingBottom: 4,
            }}
          >
            {value}
          </Text>
        </View>
      ))}
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          left: 24,
          right: 24,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 8, color: colors.gray500 }}>
          Page {pageNumber} of {totalPages}
        </Text>
        <Text style={{ fontSize: 8, color: colors.gray500 }}>
          Mercy Health · 2026
        </Text>
      </View>
    </View>
  );
}
