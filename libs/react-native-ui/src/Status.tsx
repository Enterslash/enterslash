import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Text } from './Text';
import { theme } from '@enterslash/enterus/utils';

export enum StatusType {
  INFO = 'info',
  PENDING = 'pending',
  CANCELED = 'canceled',
  APPROVED = 'approved',
}

interface Props {
  type: StatusType;
  title: string;
  style?: StyleProp<ViewStyle>;
  size?: number;
}

const colors = {
  [StatusType.INFO]: {
    primary: theme.grey500,
    secondary: 'white',
  },
  [StatusType.PENDING]: {
    primary: '#FFAE50',
    secondary: '#FFE6C8',
  },
  [StatusType.CANCELED]: {
    primary: '#FF5050',
    secondary: '#FFC8C8',
  },
  [StatusType.APPROVED]: {
    primary: '#00CD52',
    secondary: '#C4EFD5',
  },
};

export const Status = ({ type, title, style, size = 0 }: Props) => {
  return (
    <View
      style={[
        {
          backgroundColor: colors[type]?.secondary,
          borderColor: colors[type]?.primary,
          borderWidth: 1,
          paddingHorizontal: 10 + size,
          paddingVertical: 3 + size / 2,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text bold color={colors[type]?.primary} size={9 + size / 2}>
        {title}
      </Text>
    </View>
  );
};
