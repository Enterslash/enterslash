import { css, theme } from '@enterslash/enterus/utils';
import React from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  image?: ImageSourcePropType | string;
  imageContent?: React.ReactNode;
  children?: React.ReactNode;
  cardFooter?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  list?: boolean;
}

export const ProductCard = ({
  image,
  imageContent,
  children,
  cardFooter,
  style,
  onPress,
  list,
}: Props) => {
  let link;
  if (typeof image === 'string') {
    link = { uri: image };
  } else {
    link = image;
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[list ? styles.cardList : styles.cardDefault, style]}
    >
      {link && <ImageBackground
        style={[list ? styles.imageList : styles.imageDefault]}
        source={link}
      >
        <View>{imageContent}</View>
      </ImageBackground>}
      <View style={list && styles.contents}>
        <View>{children}</View>
        <View>{cardFooter}</View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardDefault: {
    borderRadius: css.border.radius.sm,
    borderColor: theme.grey200,
    borderWidth: 1,
    width: 250,
    overflow: 'hidden',
  },
  cardList: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: css.border.radius.sm,
    width: '100%',
    overflow: 'hidden',
    borderColor: theme.grey200,
    borderWidth: 1,
    // height: 140,
  },
  contents: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageDefault: {
    overflow: 'hidden',
    height: 150,
  },
  imageList: {
    overflow: 'hidden',
    width: 140,
  },
});
