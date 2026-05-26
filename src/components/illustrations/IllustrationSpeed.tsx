import { Text, View } from 'react-native';
import { PaperPlane } from '@/components/faxjet/PaperPlane';
import { colors } from '@/theme/tokens';

export function IllustrationSpeed() {
  return (
    <View style={{ width: 280, height: 320 }}>
      <View
        style={{
          position: 'absolute',
          left: 60,
          top: 40,
          width: 160,
          height: 280,
          borderRadius: 28,
          backgroundColor: colors.green900,
          padding: 12,
          shadowColor: colors.green900,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.2,
          shadowRadius: 32,
          elevation: 6,
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 18,
            backgroundColor: colors.green700,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 40,
              left: '50%',
              marginLeft: -48,
              width: 96,
              height: 96,
              borderRadius: 9999,
              borderWidth: 4,
              borderColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: -16,
                width: 12,
                height: 8,
                backgroundColor: '#FFFFFF',
                borderRadius: 2,
              }}
            />
            <View>
              <View />
            </View>
            <ZeroSixty />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 40,
              left: '50%',
              marginLeft: -40,
              width: 80,
              height: 60,
              borderRadius: 6,
              backgroundColor: '#FFFFFF',
              padding: 8,
            }}
          >
            <View
              style={{
                height: 4,
                marginBottom: 6,
                backgroundColor: colors.gray300,
                borderRadius: 2,
              }}
            />
            <View
              style={{
                height: 4,
                marginBottom: 6,
                backgroundColor: colors.gray300,
                borderRadius: 2,
                width: '60%',
              }}
            />
            <View
              style={{
                height: 4,
                backgroundColor: colors.gray300,
                borderRadius: 2,
                width: '75%',
              }}
            />
          </View>
        </View>
      </View>
      <View style={{ position: 'absolute', top: -10, right: -10 }}>
        <PaperPlane size={140} angle={-30} />
      </View>
    </View>
  );
}

function ZeroSixty() {
  return (
    <Text
      style={{
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
      }}
    >
      0:60
    </Text>
  );
}
