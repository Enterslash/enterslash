import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { ArrowLeft, Close } from '@enterslash/icons';
import { useNavigation } from '@react-navigation/native';
import { css } from '@enterslash/enterus/utils';
import { ScreenWidth } from '@enterslash/react-native-utils';

interface Props {
  title?: string;
  noBack?: boolean;
  onClose?: () => void;
  renderTitle?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  renderRight?: React.ReactNode;
}

export const AppBar = ({
  title,
  onClose,
  noBack,
  renderTitle,
  style,
  renderRight,
}: Props) => {
  const navigation = useNavigation();
  const back = () => navigation.goBack();
  return (
    <View
      style={[styles.bar, !!renderTitle && { alignItems: 'flex-start' }, style]}
    >
      {renderTitle ? (
        <View style={{ width: '100%' }}>{renderTitle}</View>
      ) : (
        <Text size={20} bold>
          {title}
        </Text>
      )}
      {!noBack &&
        (!onClose ? (
          <TouchableOpacity style={styles.back} onPress={back}>
            <ArrowLeft height="20px" width="20px" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.back} onPress={onClose}>
            <Close height="40px" width="40px" />
          </TouchableOpacity>
        ))}
      {renderRight && (
        <View
          style={{
            position: 'absolute',
            right: css.padding.md,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          }}
        >
          {renderRight}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: css.padding.md,
  },
  bar: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
