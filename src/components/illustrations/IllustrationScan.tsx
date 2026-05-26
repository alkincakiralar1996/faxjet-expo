import { View } from 'react-native';
import { colors } from '@/theme/tokens';

export function IllustrationScan() {
  return (
    <View style={{ width: 300, height: 320 }}>
      {/* paper sheet back */}
      <View
        style={{
          position: 'absolute',
          left: 24,
          top: 80,
          width: 130,
          height: 170,
          backgroundColor: '#FFFFFF',
          borderRadius: 6,
          transform: [{ rotate: '-8deg' }],
          padding: 14,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 3,
        }}
      >
        {[100, 80, 90, 70, 95, 85, 60].map((w, i) => (
          <View
            key={i}
            style={{
              height: 5,
              marginBottom: 8,
              backgroundColor: colors.gray300,
              borderRadius: 2,
              width: `${w}%`,
            }}
          />
        ))}
      </View>
      {/* phone scanning front */}
      <View
        style={{
          position: 'absolute',
          right: 30,
          top: 24,
          width: 140,
          height: 260,
          borderRadius: 24,
          backgroundColor: colors.green900,
          padding: 10,
          shadowColor: colors.green900,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.22,
          shadowRadius: 32,
          elevation: 6,
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 16,
            backgroundColor: '#0F3D2E',
            overflow: 'hidden',
          }}
        >
          {/* viewfinder corners */}
          {[
            {
              top: 12,
              left: 12,
              borderTopWidth: 3,
              borderLeftWidth: 3,
            },
            {
              top: 12,
              right: 12,
              borderTopWidth: 3,
              borderRightWidth: 3,
            },
            {
              bottom: 12,
              left: 12,
              borderBottomWidth: 3,
              borderLeftWidth: 3,
            },
            {
              bottom: 12,
              right: 12,
              borderBottomWidth: 3,
              borderRightWidth: 3,
            },
          ].map((s, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: 18,
                height: 18,
                borderColor: colors.amber500,
                ...s,
              }}
            />
          ))}
          {/* captured doc preview */}
          <View
            style={{
              position: 'absolute',
              top: 30,
              left: 30,
              right: 30,
              bottom: 30,
              backgroundColor: '#FFFFFF',
              borderRadius: 4,
              padding: 12,
            }}
          >
            {[100, 70, 90, 60, 80].map((w, i) => (
              <View
                key={i}
                style={{
                  height: 4,
                  marginBottom: 6,
                  backgroundColor: colors.green900,
                  borderRadius: 1,
                  width: `${w}%`,
                }}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
