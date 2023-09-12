import React, { useState } from 'react';
import {
  TextInput as RNInput,
  StyleProp,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { css, theme } from '@enterslash/enterus/utils';
import { EyeClose, EyeOpen, Lock } from '@enterslash/icons';

interface Props extends Partial<TextInputProps> {
  label?: string;
  lg?: boolean;
  onChangeText?: (text: string) => void;
  value?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  password?: boolean;
  rounded?: boolean;
  small?: boolean;
}

export const Input = ({
  label,
  lg,
  onChangeText,
  value,
  error,
  style,
  leftIcon,
  rightIcon,
  password,
  rounded,
  small,
  ...rest
}: Props) => {
  const [secureText, setSecureText] = useState(!!password);
  rightIcon = rightIcon || password;

  const RightIcon = () => {
    if (password) {
      if (secureText) {
        return (
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <EyeOpen />
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <EyeClose />
          </TouchableOpacity>
        );
      }
    } else {
      return <>{rightIcon}</>;
    }
  };

  return (
    <View>
      {label && (
        <Text size={15} subtitle style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.container,
          rounded && {
            borderRadius: css.border.radius.full,
          },
          small && {
            height: 45,
          },
          style,
        ]}
      >
        <RNInput
          placeholderTextColor={theme.grey200}
          {...rest}
          secureTextEntry={secureText}
          style={[
            styles.input,
            !!leftIcon && {
              marginLeft: 30,
            },
            !!rightIcon && {
              marginRight: 30,
            },
            small && {
              fontSize: 15,
              paddingHorizontal: css.padding.sm,
            },
          ]}
          onChangeText={onChangeText}
          value={value}
        />
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        {rightIcon && (
          <View style={styles.rightIcon}>
            <RightIcon />
          </View>
        )}
      </View>
      {error ? (
        <Text style={{ marginTop: 5, color: 'red' }}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  leftIcon: {
    position: 'absolute',
    marginLeft: 15,
  },
  rightIcon: {
    position: 'absolute',
    right: 15,
  },
  label: {
    marginBottom: 7,
  },
  container: {
    // flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: theme.white,
    borderColor: theme.grey200,
    borderRadius: css.border.radius.sm,
    borderWidth: 1,
    height: 60,
  },
  input: {
    fontSize: 18,
    color: theme.black,
    paddingHorizontal: css.padding.md,
  },
});
