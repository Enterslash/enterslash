import { View } from 'react-native';
import React from 'react';
import { theme } from '@enterslash/enterus/utils';
import { Text } from './Text';

type Props = {
  children: React.ReactNode;
  type?: 'dot' | 'none' | 'text';
  content?: string | number;
};

export const Badge = ({ children, type, content }: Props) => {
  return (
    <>
      {type === 'dot' ? (
        <View
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            backgroundColor: theme.danger,
            borderRadius: 10,
            width: 12,
            height: 12,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        />
      ) : type === 'text' ? (
        <View
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
            backgroundColor: theme.danger,
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <Text color="white" size={13}>
            {content}
          </Text>
        </View>
      ) : null}
      <View>{children}</View>
    </>
  );
};
