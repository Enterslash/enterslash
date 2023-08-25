import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Text } from './Text';
import { useNavigation } from '@react-navigation/native';
import { css, theme } from '@enterslash/enterus/utils';
import { ArrowLeft } from '@enterslash/icons';
// import { useNavigation } from '@react-navigation/native';

interface Props {
  style?: StyleProp<ViewStyle>;
  title?: string;
  float?: boolean;
  options?: React.ReactNode;
}

export const BackButton = ({ style, title, float, options }: Props) => {
  const navigation = useNavigation();
  const back = () => {
    navigation.goBack();
  };
  return (
    <View
      style={[
        styles.container,
        {
          position: float ? 'absolute' : 'relative',
          top: 10,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={back} style={[styles.button, style]}>
          <ArrowLeft height="20px" width="20px" />
        </TouchableOpacity>
        <Text bold size={25} primary>
          {title}
        </Text>
      </View>
      <View>{options}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    marginLeft: css.padding.md,
    backgroundColor: theme.white,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
