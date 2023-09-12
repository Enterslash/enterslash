import React, { useEffect, useRef, useState } from 'react';
import ImageView from 'react-native-image-viewing';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Layout,
  AppBar,
  Input,
  Text,
  Avatar,
  Space,
  Divider,
  MessageBubble,
  AppTourGuide,
} from '@enterslash/react-native-ui';
import {
  css,
  randomBackground,
  roomIdToTitle,
  theme,
} from '@enterslash/enterus/utils';
import { Gallery, OptionCircle, Send } from '@enterslash/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GetMessageDTO, MessageType } from '@enterslash/enterus/types';
import { NavigationStack, RouteStack } from '../../../navigation/root';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useHttp } from '../../../hook/useHttp';
import { get_messages, get_room_info } from '@enterslash/enterus/http-client';
import { useUserStore } from '../../../store/userStore';
import {
  ScreenWidth,
  image_picker,
  toBase64,
} from '@enterslash/react-native-utils';
import {
  join_room,
  leave_room,
  listen_message,
  send_message,
} from '@enterslash/enterus/socket-client';
import { SvgUri } from 'react-native-svg';

const inputBoxSize =
  (ScreenWidth - 3 * css.padding.md - 4 * css.padding.sm) / 4 - 1;

const Chat = () => {
  const { user } = useUserStore();
  const [viewImage, setViewImage] = useState([]);
  const scrollViewRef = useRef<FlatList>();
  const navigation = useNavigation<NavigationStack>();
  const [messages, setMessages] = useState<GetMessageDTO[]>([]);
  const [text, setText] = useState('');
  const route = useRoute<RouteStack<'message'>>();
  const insets = useSafeAreaInsets();
  const roomId = route.params.roomId;
  const [images, setImages] = useState([]);

  const { request: getMessages } = useHttp(() => {
    return get_messages(route.params.roomId);
  });

  const { data: roomInfo, request: getRoomInfo } = useHttp(() => {
    return get_room_info(route.params.roomId);
  });

  useEffect(() => {
    if (roomId) {
      join_room(roomId, user?._id);
      listen_message((message: any) => {
        setMessages((prev) => [...prev, message]);
      });
      getRoomInfo();
      getMessages().then((res) => {
        setMessages(res);
      });
    }
    return () => {
      leave_room(roomId, user?._id);
    };
  }, [roomId]);

  const createMessage = () => {
    if (text || images.length) {
      setText('');
      setImages([]);
      setMessages([
        ...messages,
        {
          sender: {
            _id: user._id,
          },
          message: text,
          attachments: images,
        },
      ]);
      send_message({
        room: roomId,
        message: text,
        sender: user._id,
        type: MessageType.TEXT,
        attachments: images,
      });
    }
  };

  const sendImage = async () => {
    try {
      const image = await image_picker.gallery({
        cropping: false,
      });
      const baseImg = await toBase64(image.path);
      setImages((prev) => [...prev, baseImg]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const viewImageHandler = (images) => {
    setViewImage(images);
  };

  const closeViewImageHandler = () => {
    setViewImage([]);
  };

  return (
    <>
      <ImageView
        images={viewImage.map((img) => ({
          uri: img,
        }))}
        imageIndex={0}
        visible={viewImage.length > 0}
        onRequestClose={closeViewImageHandler}
      />
      <Layout keyboardBehavior="padding">
        <View style={{ flex: 1 }}>
          <AppBar
            renderTitle={
              <View style={styles.appBarTitle}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <SvgUri
                    width={40}
                    height={40}
                    uri={randomBackground(roomInfo?.roomId)}
                  />
                  {/* <Avatar
                    source={randomBackground(roomInfo?.roomId)}
                    size={40}
                    rounded
                  /> */}
                  <Space width={10} />
                  <View>
                    <Text>{roomIdToTitle(roomInfo?.roomId)}</Text>
                    {/* <Text size={12} subtitle>
                      {bookingData?.service.title}
                    </Text> */}
                  </View>
                </View>
                {/* <TouchableOpacity>
                  <OptionCircle height="25px" width="25px" />
                </TouchableOpacity> */}
              </View>
            }
          />
          <Divider vr />
          <FlatList
            ref={scrollViewRef}
            onContentSizeChange={() => {
              if (scrollViewRef.current && messages.length > 0) {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }
            }}
            data={messages}
            style={{
              flex: 1,
              paddingHorizontal: css.padding.sm,
            }}
            ItemSeparatorComponent={() => <Space height={css.padding.md} />}
            ListFooterComponent={<Space height={css.padding.sm} />}
            ListHeaderComponent={<Space height={css.padding.sm} />}
            renderItem={({ item, index }) => (
              <MessageBubble
                onImagePress={viewImageHandler}
                isNotification={item.type === MessageType.NOTIFICATION}
                isMe={item.sender._id === user._id}
                sender={item.sender}
                message={item.message}
                attachments={item.attachments}
              />
            )}
          />
          <Divider vr />
          <View>
            {!!images.length && (
              <View style={styles.images}>
                {images.map((image, i) => (
                  <TouchableOpacity key={i} onPress={() => removeImage(i)}>
                    <Image
                      source={{ uri: image }}
                      style={{
                        width: inputBoxSize,
                        height: inputBoxSize,
                        borderRadius: css.border.radius.sm,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.inputBoxArea}>
              <TouchableOpacity onPress={sendImage}>
                <Gallery height="30px" width="30px" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Input
                  small
                  rounded
                  placeholder="Write a message..."
                  value={text}
                  onChangeText={setText}
                />
              </View>
              <TouchableOpacity onPress={createMessage}>
                <Send height="28px" width="28px" />
              </TouchableOpacity>
            </View>
          </View>
          <Space height={insets.bottom} />
        </View>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  images: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: css.padding.md,
    padding: css.padding.sm,
    margin: css.padding.sm,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: theme.grey200,
    borderRadius: css.border.radius.sm,
  },
  contentContainer: {
    paddingHorizontal: css.padding.md,
    width: '100%',
  },
  inputBoxArea: {
    paddingHorizontal: css.padding.md,
    paddingVertical: css.padding.lg,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appBarTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: css.padding.md,
    paddingLeft: 55,
  },
});

export default Chat;
