import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import avatar from 'assets/avatar.png';

interface Props {
  size?: number;
  rounded?: boolean;
  source?: ImageSourcePropType | string;
}

export const Avatar = ({ size = 50, rounded, source }: Props) => {
  let link;
  if (typeof source === 'string') {
    link = { uri: source };
  } else {
    link = source;
  }
  return (
    <Image
      style={{
        width: size,
        height: size,
        borderRadius: rounded ? size : size / 4,
      }}
      source={link || avatar}
    />
  );
};
