import { View } from 'react-native';
import { colors } from '@/theme/tokens';

export function PrimingCameraArt() {
  return (
    <View style={{ width: 220, height: 220 }}>
      {/* paper sheet */}
      <View
        style={{
          position: 'absolute',
          left: 14,
          top: 36,
          width: 110,
          height: 144,
          backgroundColor: '#FFFFFF',
          borderRadius: 4,
          transform: [{ rotate: '-8deg' }],
          padding: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        {[100, 80, 90, 70, 95, 60, 80].map((w, i) => (
          <View
            key={i}
            style={{
              height: 4,
              marginBottom: 6,
              backgroundColor: colors.gray300,
              borderRadius: 1,
              width: `${w}%`,
            }}
          />
        ))}
      </View>
      {/* phone with camera viewfinder */}
      <View
        style={{
          position: 'absolute',
          right: 14,
          top: 14,
          width: 110,
          height: 200,
          borderRadius: 20,
          backgroundColor: colors.green900,
          padding: 10,
          shadowColor: colors.green900,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.22,
          shadowRadius: 28,
          elevation: 6,
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 12,
            backgroundColor: '#0A1D14',
            position: 'relative',
          }}
        >
          {[
            { top: 10, left: 10, borderTopWidth: 3, borderLeftWidth: 3 },
            { top: 10, right: 10, borderTopWidth: 3, borderRightWidth: 3 },
            {
              bottom: 10,
              left: 10,
              borderBottomWidth: 3,
              borderLeftWidth: 3,
            },
            {
              bottom: 10,
              right: 10,
              borderBottomWidth: 3,
              borderRightWidth: 3,
            },
          ].map((s, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: 14,
                height: 14,
                borderColor: colors.amber500,
                ...(s as object),
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
