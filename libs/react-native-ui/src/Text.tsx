import { theme } from '@enterslash/enterus/utils';
import React from 'react';
import { Text as RNText, StyleProp, TextStyle } from 'react-native';

interface Props extends Partial<RNText> {
  children: React.ReactNode;
  color?: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  bold?: boolean;
  size?: number;
  center?: boolean;
  primary?: boolean;
  title?: boolean;
  lineHeight?: number;
  subtitle?: boolean;
}

export const TEXT = {
  SIZE: {
    TITLE: 30,
    LABEL: 20,
    SUBTITLE: 13,
    INPUT: 17,
  },
};

export const Text = ({
  children,
  color,
  style,
  onPress,
  bold,
  size,
  center,
  primary,
  title,
  lineHeight,
  subtitle,
  ...rest
}: Props) => {
  const myStyles: StyleProp<TextStyle> = {
    color: color ? color : primary ? theme.primary : theme.black,
    opacity: subtitle ? 0.6 : 1,
    fontWeight: bold ? 'bold' : 'normal',
    textAlign: center ? 'center' : 'left',
    fontSize: size || 15,
    lineHeight: lineHeight,
    // fontFamily: 'sans-serif-light',
  };

  const getStyles = () => {
    if (Array.isArray(style)) return [myStyles, ...style];
    return [myStyles, style];
  };

  return (
    <RNText {...rest} onPress={onPress} style={getStyles()}>
      {children}
    </RNText>
  );
};
