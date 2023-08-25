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
  Badge,
  useAppTourGuide,
  AppTourGuide,
} from '@enterslash/react-native-ui';
import { css, fullName, theme } from '@enterslash/enterus/utils';
import { Gallery, OptionCircle, Send } from '@enterslash/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GetMessageDTO,
  GetSingleBookingsDTO,
  MessageType,
} from '@enterslash/enterus/types';
import { NavigationStack, RouteStack } from '../../../navigation/root';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useHttp } from '../../../hook/useHttp';
import { get_messages, get_single_booking } from '@enterslash/enterus/http-client';
import { useUserStore } from '../../../store/userStore';
import { isProvider } from '../../../utils';
import {
  ScreenWidth,
  image_picker,
  toBase64,
} from '@enterslash/react-native-utils';
import { useTourStore } from '../../../store/tourStore';
import {
  join_room,
  leave_room,
  listen_message,
  send_message,
} from '@enterslash/enterus/socket-client';

const { Provider, Step, RegisterTourEventListener } = AppTourGuide;

const inputBoxSize =
  (ScreenWidth - 3 * css.padding.md - 4 * css.padding.sm) / 4 - 1;

const ChatPage = () => {
  const { user } = useUserStore();
  const provider = isProvider(user.userType);
  const [viewImage, setViewImage] = useState([]);
  const scrollViewRef = useRef<FlatList>();
  const navigation = useNavigation<NavigationStack>();
  const [messages, setMessages] = useState<GetMessageDTO[]>([]);
  const [bookingData, setBookingData] = useState<GetSingleBookingsDTO>();
  const [text, setText] = useState('');
  const route = useRoute<RouteStack<'message'>>();
  const insets = useSafeAreaInsets();
  const bookingId = route.params.bookingId;
  const [images, setImages] = useState([]);
  const { start: startGuide, eventEmitter, canStart } = useAppTourGuide();
  const { newSignUp, state, finishTour, setTourStep } = useTourStore();
  const users = [bookingData?.provider._id, bookingData?.user._id];
  const receiver = users.filter((u) => u !== user?._id)[0];

  useEffect(() => {
    if (canStart) {
      if (newSignUp && !state.messages.done) {
        setTimeout(() => {
          startGuide();
        }, 500);
      }
    }
  }, [canStart]);

  const openOption = () => {
    navigation.navigate('chatOptions', {
      bookingId: bookingData._id,
    });
  };

  const { request: getMessages } = useHttp(() => {
    return get_messages(route.params.bookingId);
  });

  const { request: getBooking } = useHttp(() => {
    return get_single_booking(route.params.bookingId);
  });

  useEffect(() => {
    if (bookingId) {
      join_room(bookingId as string, user?._id);
      listen_message((message: any) => {
        setMessages((prev) => [...prev, message]);
      });
      getMessages().then((res) => {
        setMessages(res)
      });
      getBooking().then((res) => {
        setBookingData(res);
      });
    }
    return () => {
      leave_room(bookingId as string, user?._id);
    };
  }, [bookingId]);

  const createMessage = () => {
    if (text || images.length) {
      setText('');
      setImages([]);
      setMessages([
        ...messages,
        {
          isMe: true,
          message: text,
          attachments: images,
        },
      ]);
      send_message({
        room: bookingId,
        booking: bookingId,
        message: text,
        receiver,
        sender: user._id,
        type: images.length ? MessageType.IMAGE : MessageType.TEXT,
        attachments: images,
      });
    }
  };

  const sendImage = async () => {
    try {
      const image = await image_picker.camera();
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

  const hasAlert = () => {
    if (!isProvider(user.userType)) {
      if (
        bookingData?.price?.acceptedByProvider &&
        !bookingData?.price?.acceptedByUser
      ) {
        return true;
      }
    }
  };

  RegisterTourEventListener(eventEmitter, {
    onChangeStep: () => (step) => setTourStep('messages', step?.order),
    onFinish: () => finishTour('messages'),
  });

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
                  <Avatar
                    source={
                      provider
                        ? bookingData?.user.avatar
                        : bookingData?.provider.avatar
                    }
                    size={40}
                    rounded
                  />
                  <Space width={10} />
                  <View>
                    <Text>
                      {fullName(
                        provider ? bookingData?.user : bookingData?.provider
                      )}
                    </Text>
                    <Text size={12} subtitle>
                      {bookingData?.service.title}
                    </Text>
                  </View>
                </View>
                <Step
                  shape="circle"
                  zone={1}
                  text="Click here to check the booking price"
                >
                  <Badge type={hasAlert() ? 'dot' : 'none'}>
                    <TouchableOpacity onPress={openOption}>
                      <OptionCircle height="25px" width="25px" />
                    </TouchableOpacity>
                  </Badge>
                </Step>
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
                isMe={item.isMe}
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
              <Input
                small
                style={{ flex: 1 }}
                rounded
                placeholder="Write a message..."
                value={text}
                onChangeText={setText}
              />
              <TouchableOpacity onPress={createMessage}>
                <Send height="28px" width="28px" />
              </TouchableOpacity>
            </View>
          </View>
          <Space height={insets.bottom} />
        </View>
      </Layout>
      {/* <BottomSheet height={700} modalRef={bottomSheetRef}>
        <View style={styles.contentContainer}>
            <View style={{flex: 1, height: 200}}>
                <ProductCard
                    image={'https://picsum.photos/200/300'}
                    // imageContent={}
                    list
                >
                    <Text>Product 1</Text>
                </ProductCard>
            </View>
          <Card style={{ width: '100%' }}>
            <Text style={{ padding: css.padding.md }}>Offered price</Text>
            <Divider vr />
            <View style={{ padding: css.padding.md }}>
              <Input small value="sdsdssd" />
              <Space height={css.padding.md} />
              <View style={{ flexDirection: 'row' }}>
                <Button style={{ flex: 1 }} small>
                  Accept
                </Button>
                <Space width={5} />
                <Button color={theme.danger} small>
                  Reject
                </Button>
              </View>
            </View>
          </Card>
        </View>
      </BottomSheet> */}
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
    // flex: 1,
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

const Chat = () => {
  return (
    <Provider>
      <ChatPage />
    </Provider>
  );
};

export default Chat;
