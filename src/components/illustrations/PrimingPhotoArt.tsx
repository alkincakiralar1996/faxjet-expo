import { View } from 'react-native';
import { Icon } from '@/icons/Icon';
import { colors } from '@/theme/tokens';

export function PrimingPhotoArt() {
  const photos = [
    { rot: -10, dx: -40, dy: 10, color: '#CFE8DA' },
    { rot: 2, dx: 10, dy: -6, color: '#FFFFFF' },
    { rot: 12, dx: 50, dy: 14, color: '#FFFFFF' },
  ];
  return (
    <View
      style={{
        width: 220,
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {photos.map((p, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: 110,
            height: 130,
            backgroundColor: p.color,
            borderRadius: 6,
            transform: [{ translateX: p.dx }, { translateY: p.dy }, { rotate: `${p.rot}deg` }],
            padding: 8,
            borderWidth: 1,
            borderColor: colors.gray100,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 3,
          }}
        >
          <View
            style={{
              width: '100%',
              height: '70%',
              backgroundColor: colors.green100,
              borderRadius: 3,
            }}
          />
          <View
            style={{
              height: 3,
              marginTop: 6,
              marginBottom: 4,
              backgroundColor: colors.gray300,
              borderRadius: 1,
            }}
          />
          <View
            style={{
              height: 3,
              backgroundColor: colors.gray300,
              borderRadius: 1,
              width: '60%',
            }}
          />
        </View>
      ))}
      <View
        style={{
          position: 'absolute',
          width: 24,
          height: 24,
          borderRadius: 9999,
          backgroundColor: colors.amber500,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ translateX: 35 }, { translateY: -55 }],
          borderWidth: 2,
          borderColor: '#FFFFFF',
        }}
      >
        <Icon name="check" size={14} color={colors.black} />
      </View>
    </View>
  );
}
