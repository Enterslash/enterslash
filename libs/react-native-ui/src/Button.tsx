import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { Loader } from './Loader';
import { css, theme } from '@enterslash/enterus/utils';

interface Props {
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  loader?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  block?: boolean;
  ghost?: boolean;
  lg?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  rounded?: boolean;
  disabled?: boolean;
  small?: boolean;
  color?: string;
}

export const Button = ({
  textStyle,
  children,
  loader,
  iconLeft,
  iconRight,
  disabled,
  ghost,
  lg,
  style,
  onPress,
  rounded,
  small,
  color,
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled || loader}
      onPress={onPress}
      style={[
        {
          borderRadius: rounded ? 20 : 10,
          paddingVertical: lg ? 15 : 10,
          paddingHorizontal: 20,
          justifyContent: 'center',
          alignItems: 'center',
        },
        styles.button,
        ghost && {
          backgroundColor: theme.white,
          borderWidth: 1,
          borderColor: theme.grey200,
        },
        disabled && {
          backgroundColor: theme.grey200,
        },
        small && {
          paddingVertical: 10,
          paddingHorizontal: 10,
        },
        !!color && {
          backgroundColor: color,
        },
        style,
      ]}
    >
      {loader ? (
        <Loader size={22} style={{marginBottom: -5}}/>
      ) : (
        !!iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>
      )}
      <Text
        bold
        style={[
          styles.text,
          ghost && { color: theme.black },
          textStyle,
          { fontSize: small ? 15 : 18 },
        ]}
      >
        {children}
      </Text>
      {!!iconRight && <View style={styles.iconRight}>{iconRight}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconLeft: {
    // position: 'absolute',
    // width: '100%',
  },
  iconRight: {
    // position: 'absolute',
    // width: '100%',
    // alignItems: 'flex-end',
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: css.padding.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  text: {
    color: theme.white,
  },
});
