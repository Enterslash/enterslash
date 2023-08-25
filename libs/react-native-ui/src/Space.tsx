import React from 'react';
import {View} from 'react-native';

interface Props {
  width?: number;
  height?: number;
}
export const Space = ({width, height}: Props) => {
  return <View style={{width: width || 0, height: height || 0}}></View>;
}