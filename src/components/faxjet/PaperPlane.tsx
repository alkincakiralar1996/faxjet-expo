import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { G, Line, Path } from 'react-native-svg';

export type PaperPlaneProps = {
  size?: number;
  motion?: boolean;
  planeColor?: string;
  trailColor?: string;
  angle?: number;
  style?: StyleProp<ViewStyle>;
};

export function PaperPlane({
  size = 120,
  motion = true,
  planeColor = '#FFFFFF',
  trailColor = '#FFB020',
  angle = -20,
  style,
}: PaperPlaneProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 240 240" style={style}>
      <G originX={120} originY={120} rotation={angle}>
        {motion ? (
          <G stroke={trailColor} strokeWidth={11} strokeLinecap="round">
            <Line x1={40} y1={155} x2={105} y2={155} />
            <Line x1={55} y1={135} x2={100} y2={135} opacity={0.9} />
            <Line x1={68} y1={175} x2={98} y2={175} opacity={0.75} />
          </G>
        ) : null}
        <G fill={planeColor}>
          <Path d="M120 60 L205 90 L130 135 Z" />
          <Path d="M120 60 L130 135 L102 165 Z" opacity={0.88} />
          <Path d="M102 165 L130 135 L205 90 L155 175 Z" opacity={0.78} />
        </G>
      </G>
    </Svg>
  );
}
