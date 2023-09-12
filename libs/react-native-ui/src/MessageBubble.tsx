import {
  Image,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '@enterslash/enterus/utils';
import { Text } from './Text';
import { GetMessageDTO } from '@enterslash/enterus/types';
import { Avatar } from './Avatar';

interface IProps {
  isMe: boolean;
  sender: GetMessageDTO['sender'];
  message: string;
  isNotification?: boolean;
  attachments?: string[];
  onImagePress?: (images: string[]) => void;
}

export const MessageBubble = ({
  isMe,
  message,
  isNotification,
  attachments,
  sender,
  onImagePress = () => {},
}: IProps) => {
  const genStyle = (): StyleProp<ViewStyle> => {
    const style: StyleProp<ViewStyle> = {};

    if (isNotification) {
      style.backgroundColor = theme.tertiary;
      style.borderRadius = 10;
      style.borderWidth = 0.5;
      style.borderColor = theme.primary;
      style.paddingHorizontal = 10;
      style.paddingVertical = 5;
      style.alignSelf = 'center';
      style.display = 'flex';
    } else {
      style.padding = 10;
      style.borderRadius = 10;
      style.maxWidth = 250;
      if (isMe) {
        style.alignSelf = 'flex-end';
        style.borderBottomEndRadius = 0;
        style.backgroundColor = theme.white;
        style.borderWidth = 0.5;
        style.borderColor = theme.black;
      } else {
        style.alignSelf = 'flex-start';
        style.borderBottomLeftRadius = 0;
        style.backgroundColor = theme.primary;
      }
    }
    return style;
  };

  const genTextStyle = (): StyleProp<TextStyle> => {
    const style: StyleProp<TextStyle> = {};
    if (isNotification) {
      style.color = theme.primary;
      style.fontSize = 12;
      style.textAlign = 'center';
      style.maxWidth = '80%';
      style.fontWeight = 'bold';
    } else {
      if (isMe) {
        style.color = theme.black;
      } else {
        style.color = theme.white;
      }
      style.fontSize = 15;
    }
    return style;
  };

  const genContainerStyle = (): StyleProp<TextStyle> => {
    const style: StyleProp<TextStyle> = {};
    if (!isNotification) {
      if (!isMe) {
        style.flexDirection = 'row';
        style.alignItems = 'flex-end';
        style.gap = 5;
      }
    }
    return style;
  };

  return (
    <View style={genContainerStyle()}>
      {!isMe && !isNotification && <Avatar source={sender?.avatar} size={20} rounded />}
      <View style={genStyle()}>
        {attachments?.map((attachment, i) => (
          <TouchableOpacity onPress={() => onImagePress(attachments)}>
            <Image
              key={i}
              source={{ uri: attachment }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
                marginBottom: 10,
              }}
            />
          </TouchableOpacity>
        ))}
        <Text style={genTextStyle()}>{message}</Text>
      </View>
    </View>
  );
};
