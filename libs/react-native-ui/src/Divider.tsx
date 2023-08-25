import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface Props {
  hr?: boolean;
  vr?: boolean;
  length?: number | string;
  color?: string;
  space?: number;
  style?: StyleProp<ViewStyle>;
}

export const Divider = ({ hr, vr, length = '100%', color, space, style }: Props) => {
  return (
    <View
      style={{
        borderWidth: 0.5,
        height: hr ? length : 0,
        width: vr ? length : 0,
        borderColor: color || 'grey',
        opacity: 0.6,
        marginHorizontal: hr ? space : 0,
        marginVertical: vr ? space : 0,
        ...(style as object),
      }}
    />
  );
};
