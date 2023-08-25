import { css } from '@enterslash/enterus/utils';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children?: React.ReactNode;
}

export const BottomAction = ({ children }: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: css.padding.md,
        marginBottom: insets.bottom,
      }}
    >
      {children}
    </View>
  );
};
