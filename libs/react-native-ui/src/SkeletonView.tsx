import { theme } from '@enterslash/enterus/utils';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

interface Props extends Partial<ViewProps> {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  height?: number | string;
  width?: number | string;
  radius?: number;
}
export const SkeletonView = ({
  children,
  style,
  height,
  width,
  radius,
}: Props) => {
  return (
    <View
      style={[
        styles.container,
        style,
        {
          height: height || 0,
          width: width || 0,
          borderRadius: radius,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.grey100,
  },
});
