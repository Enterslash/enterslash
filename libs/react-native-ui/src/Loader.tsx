import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Spinner, { SpinnerType } from 'react-native-spinkit';

interface Props {
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  type?: SpinnerType;
}

export const Loader = ({ color, size, style, type }: Props) => {
  return (
    <View style={type ? {} : { marginTop: -5 }}>
      <Spinner
        style={style}
        isVisible={true}
        size={size || 30}
        type={type || 'Circle'}
        color={color || 'white'}
      />
    </View>
  );
};
