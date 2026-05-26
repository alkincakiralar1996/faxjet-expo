import { View } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors } from '@/theme/tokens';

export function SkeletonRow({ isLast = false }: { isLast?: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        height: 72,
        paddingHorizontal: 16,
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: colors.gray100,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: colors.gray100,
        }}
      />
      <View style={{ flex: 1, gap: 8 }}>
        <Skeleton width="65%" height={12} />
        <Skeleton width="40%" height={10} />
      </View>
      <Skeleton width={72} height={20} radius={9999} />
    </View>
  );
}

export function SkeletonListCard({ rows = 3 }: { rows?: number }) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} isLast={i === rows - 1} />
      ))}
    </View>
  );
}
