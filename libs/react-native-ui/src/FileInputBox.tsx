import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text } from './Text';
import { theme } from '@enterslash/enterus/utils';

interface Props {
  boxSize?: number;
  onPress?: () => void;
  source?: any;
  height?: number | string;
  width?: number | string;
}

export const FileInputBox = ({
  boxSize,
  onPress,
  source,
  height,
  width,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.input,
        {
          width,
          height,
        },
        !!boxSize && {
          width: boxSize,
          height: boxSize,
        },
      ]}
    >
      {source ? (
        <Image style={styles.file} source={{ uri: source }} />
      ) : (
        <Text subtitle style={{ fontWeight: '100' }} size={50}>
          +
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  file: {
    width: '100%',
    height: '100%',
    borderRadius: 9,
  },
  input: {
    borderColor: theme.grey200,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
});
