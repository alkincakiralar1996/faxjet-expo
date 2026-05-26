import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '@/theme/tokens';

export function IllustrationTrust() {
  return (
    <View
      style={{
        width: 240,
        height: 280,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={220} height={260} viewBox="0 0 220 260">
        <Path
          d="M110 10 L200 40 V120 C200 180 165 230 110 250 C55 230 20 180 20 120 V40 Z"
          fill={colors.green900}
        />
        <Path
          d="M110 28 L184 52 V120 C184 170 154 212 110 230 C66 212 36 170 36 120 V52 Z"
          fill={colors.green700}
        />
        <Rect x={78} y={82} width={64} height={80} rx={6} fill="#FFFFFF" />
        <Rect x={88} y={100} width={44} height={4} rx={2} fill={colors.gray300} />
        <Rect x={88} y={112} width={32} height={4} rx={2} fill={colors.gray300} />
        <Rect x={88} y={124} width={40} height={4} rx={2} fill={colors.gray300} />
        <Rect x={88} y={136} width={28} height={4} rx={2} fill={colors.gray300} />
        <Circle cx={170} cy={60} r={26} fill={colors.amber500} />
        <Path
          d="M158 60 L168 70 L184 52"
          fill="none"
          stroke={colors.black}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
