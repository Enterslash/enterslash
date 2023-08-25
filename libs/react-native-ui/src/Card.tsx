import { css, theme } from '@enterslash/enterus/utils';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Card = ({ children, style }: Props) => {
  return (
    <View
      style={[
        {
          backgroundColor: theme.white,
          borderRadius: css.border.radius.sm,
          borderColor: theme.grey200,
          borderWidth: 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
