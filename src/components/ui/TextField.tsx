import { useState } from 'react';
import {
  TextInput,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
  View,
  Text,
} from 'react-native';
import { colors } from '@/theme/tokens';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  helper?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export function TextField({
  label,
  helper,
  error,
  containerStyle,
  leading,
  trailing,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? colors.error
    : focused
      ? colors.green500
      : 'transparent';

  return (
    <View style={containerStyle}>
      {label ? (
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: error ? colors.error : colors.gray700,
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={{
          height: 56,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: colors.gray100,
          borderWidth: 1.5,
          borderColor,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {leading}
        <TextInput
          {...inputProps}
          placeholderTextColor={colors.gray500}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            flex: 1,
            fontSize: 16,
            color: colors.black,
          }}
        />
        {trailing}
      </View>
      {error ? (
        <Text style={{ fontSize: 11, color: colors.error, marginTop: 6 }}>
          {error}
        </Text>
      ) : helper ? (
        <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 6 }}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}
