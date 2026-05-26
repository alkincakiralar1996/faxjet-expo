import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { colors } from '@/theme/tokens';

export type EmptyStateProps = {
  illustration: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
};

export function EmptyState({
  illustration,
  title,
  body,
  action,
}: EmptyStateProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingTop: 32,
      }}
    >
      {illustration}
      <Text
        style={{
          fontSize: 17,
          fontWeight: '600',
          color: colors.black,
          marginTop: 20,
          marginBottom: 6,
          textAlign: 'center',
          letterSpacing: -0.17,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: colors.gray500,
          textAlign: 'center',
          lineHeight: 22,
        }}
      >
        {body}
      </Text>
      {action ? <View style={{ marginTop: 24 }}>{action}</View> : null}
    </View>
  );
}
