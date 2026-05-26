import type { StyleProp, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Line,
  Path,
  Polyline,
  Rect,
} from 'react-native-svg';

export type IconName =
  | 'paperplane'
  | 'paperplane-fill'
  | 'doc'
  | 'doc-fill'
  | 'camera'
  | 'folder'
  | 'photo'
  | 'cloud'
  | 'check'
  | 'check-circle'
  | 'check-circle-fill'
  | 'x-circle'
  | 'x'
  | 'clock'
  | 'lock-shield'
  | 'shield'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'arrow-left'
  | 'home'
  | 'home-fill'
  | 'list'
  | 'gear'
  | 'plus'
  | 'share'
  | 'download'
  | 'refresh'
  | 'wifi-off'
  | 'alert'
  | 'circle'
  | 'circle-fill'
  | 'flag-us';

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, size = 24, color = '#000', style }: IconProps) {
  const stroke = {
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  const filled = { fill: color };

  switch (name) {
    case 'paperplane':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" {...stroke} />
        </Svg>
      );
    case 'paperplane-fill':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path d="M22 2L2 9.5l9 3.5L14.5 22 22 2z" {...filled} />
        </Svg>
      );
    case 'doc':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path
            d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
            {...stroke}
          />
          <Polyline points="14 2 14 8 20 8" {...stroke} />
        </Svg>
      );
    case 'doc-fill':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path
            d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 1.5L18.5 8H14V3.5z"
            {...filled}
          />
        </Svg>
      );
    case 'camera':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path
            d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
            {...stroke}
          />
          <Circle cx="12" cy="13" r="4" {...stroke} />
        </Svg>
      );
    case 'folder':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path
            d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"
            {...stroke}
          />
        </Svg>
      );
    case 'photo':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Rect x="3" y="3" width="18" height="18" rx="2" {...stroke} />
          <Circle cx="8.5" cy="8.5" r="1.5" {...stroke} />
          <Path d="M21 15l-5-5L5 21" {...stroke} />
        </Svg>
      );
    case 'cloud':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" {...stroke} />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Polyline points="20 6 9 17 4 12" {...stroke} />
        </Svg>
      );
    case 'check-circle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Circle cx="12" cy="12" r="10" {...stroke} />
          <Polyline points="9 12 12 15 17 9" {...stroke} />
        </Svg>
      );
    case 'check-circle-fill':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path
            d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.5L6 11.7l1.4-1.4 3.4 3.4 6-6 1.4 1.4-7.4 7.4z"
            {...filled}
          />
        </Svg>
      );
    case 'x-circle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Circle cx="12" cy="12" r="10" {...stroke} />
          <Path d="M15 9l-6 6M9 9l6 6" {...stroke} />
        </Svg>
      );
    case 'x':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path d="M18 6L6 18M6 6l12 12" {...stroke} />
        </Svg>
      );
    case 'clock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Circle cx="12" cy="12" r="10" {...stroke} />
          <Polyline points="12 6 12 12 16 14" {...stroke} />
        </Svg>
      );
    case 'lock-shield':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path
            d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5l8-3z"
            {...stroke}
          />
          <Rect x="9" y="11" width="6" height="5" rx="1" {...stroke} />
          <Path d="M10 11V9a2 2 0 014 0v2" {...stroke} />
        </Svg>
      );
    case 'shield':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path
            d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5l8-3z"
            {...stroke}
          />
        </Svg>
      );
    case 'chevron-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Polyline points="15 18 9 12 15 6" {...stroke} />
        </Svg>
      );
    case 'chevron-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Polyline points="9 18 15 12 9 6" {...stroke} />
        </Svg>
      );
    case 'chevron-down':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Polyline points="6 9 12 15 18 9" {...stroke} />
        </Svg>
      );
    case 'arrow-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Line x1="19" y1="12" x2="5" y2="12" {...stroke} />
          <Polyline points="12 19 5 12 12 5" {...stroke} />
        </Svg>
      );
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path
            d="M3 12l9-9 9 9v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2z"
            {...stroke}
          />
        </Svg>
      );
    case 'home-fill':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path
            d="M3 12l9-9 9 9v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2z"
            {...filled}
          />
        </Svg>
      );
    case 'list':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Line x1="8" y1="6" x2="21" y2="6" {...stroke} />
          <Line x1="8" y1="12" x2="21" y2="12" {...stroke} />
          <Line x1="8" y1="18" x2="21" y2="18" {...stroke} />
          <Circle cx="4" cy="6" r="1" fill={color} stroke="none" />
          <Circle cx="4" cy="12" r="1" fill={color} stroke="none" />
          <Circle cx="4" cy="18" r="1" fill={color} stroke="none" />
        </Svg>
      );
    case 'gear':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Circle cx="12" cy="12" r="3" {...stroke} />
          <Path
            d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51h0a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v0a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
            {...stroke}
          />
        </Svg>
      );
    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Line x1="12" y1="5" x2="12" y2="19" {...stroke} />
          <Line x1="5" y1="12" x2="19" y2="12" {...stroke} />
        </Svg>
      );
    case 'share':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path
            d="M12 3v12M7 8l5-5 5 5M5 15v4a2 2 0 002 2h10a2 2 0 002-2v-4"
            {...stroke}
          />
        </Svg>
      );
    case 'download':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" {...stroke} />
          <Polyline points="7 10 12 15 17 10" {...stroke} />
          <Line x1="12" y1="15" x2="12" y2="3" {...stroke} />
        </Svg>
      );
    case 'refresh':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Polyline points="23 4 23 10 17 10" {...stroke} />
          <Polyline points="1 20 1 14 7 14" {...stroke} />
          <Path
            d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
            {...stroke}
          />
        </Svg>
      );
    case 'wifi-off':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Line x1="1" y1="1" x2="23" y2="23" {...stroke} />
          <Path
            d="M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.58 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0"
            {...stroke}
          />
          <Line x1="12" y1="20" x2="12.01" y2="20" {...stroke} />
        </Svg>
      );
    case 'alert':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Path
            d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            {...stroke}
          />
          <Line x1="12" y1="9" x2="12" y2="13" {...stroke} />
          <Line x1="12" y1="17" x2="12.01" y2="17" {...stroke} />
        </Svg>
      );
    case 'circle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Circle cx="12" cy="12" r="9" {...stroke} />
        </Svg>
      );
    case 'circle-fill':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
          <Circle cx="12" cy="12" r="10" {...filled} />
        </Svg>
      );
    case 'flag-us': {
      const stripes = [1, 3, 5, 7, 9, 11];
      return (
        <Svg
          width={size}
          height={(size * 16) / 24}
          viewBox="0 0 24 16"
          style={style}
        >
          <Rect x={0} y={0} width={24} height={16} fill="#B22234" />
          {stripes.map((i) => (
            <Rect
              key={i}
              x={0}
              y={i * 1.23}
              width={24}
              height={1.23}
              fill="#FFFFFF"
            />
          ))}
          <Rect x={0} y={0} width={10} height={8.6} fill="#3C3B6E" />
        </Svg>
      );
    }
    default:
      return null;
  }
}
