import React, { useEffect, useState } from 'react';
import { message } from '../utils/message';
import DashboardLayout from '../layout/dashbaord';
import { Avatar, Button, Input, Space, Text, Layout } from '@enterslash/react-ui';
import { fullName, theme } from '@enterslash/enterus/utils';
import { useHttp } from '../hook/useHttp';
import {
  get_conversations,
  get_messages,
  get_single_booking,
  set_booking_price,
} from '@enterslash/enterus/http-client';
import {
  BookingStatus,
  GetConversationsDTO,
  GetMessageDTO,
  GetSingleBookingsDTO,
  MessageType,
} from '@enterslash/enterus/types';
import { useRouter } from 'next/router';
import { Card, MessageBubble } from '@enterslash/react-ui';
import PreviewableImage from 'libs/react-ui/src/PreviewableImage';
import {
  join_room,
  leave_room,
  listen_message,
  send_message,
} from '@enterslash/enterus/socket-client';
import { useAppState } from '../store/appState';
import { ICON } from '@enterslash/react-icons';

const { Header, Sider, Content } = Layout;

const Index = () => {
  const { user } = useAppState();
  const lastMessage = React.useRef<string>();
  const messageArea = React.useRef<HTMLDivElement>(null);
  const [bookingData, setBookingData] = useState<GetSingleBookingsDTO>();
  const router = useRouter();
  const [text, setText] = useState('');
  const [price, setPrice] = useState('');
  const [messages, setMessages] = useState<GetMessageDTO[]>([]);
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const bookingId = router.query.id;
  const users = [bookingData?.provider._id, bookingData?.user._id];
  const receiver = users.filter((u) => u !== user?._id)[0];

  const { data: conversations, request: getConversations } = useHttp<
    GetConversationsDTO[]
  >(() => {
    return get_conversations();
  });

  const { request: getMessages } = useHttp<GetMessageDTO[]>(() => {
    return get_messages(bookingId as string);
  });

  const { request: getBooking, loading: getBookingLoader } =
    useHttp<GetSingleBookingsDTO>(() => {
      return get_single_booking(bookingId as string);
    });

  const { request: setBookingPrice, loading: setBookingPriceLoader } =
    useHttp<string>(() => {
      return set_booking_price(bookingId as string, {
        price: parseInt(price),
      });
    });

  const setBookingPriceHandler = () => {
    setBookingPrice().then((res) => {
      message.success('Price has been set');
      setBookingData(
        (prev) =>
          prev && {
            ...prev,
            price: {
              ...prev?.price,
              price: parseInt(price),
              acceptedByProvider: true,
            },
          }
      );
    });
  };

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    if (bookingId) {
      join_room(bookingId as string, user?._id);
      listen_message((message: any) => {
        setMessages((prev) => [...prev, message]);
      });
      getMessages().then((res) => {
        if (res.length > 0) {
          lastMessage.current = res[res.length - 1]._id;
        }
        setMessages(res);
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
    if (text === '') {
      return;
    }
    setText('');
    setMessages([
      ...messages,
      {
        isMe: true,
        message: text,
      },
    ]);

    send_message({
      room: bookingId as string,
      booking: bookingId as string,
      message: text,
      receiver,
      sender: user?._id as string,
      type: MessageType.TEXT,
    });
  };

  useEffect(() => {
    if (messageArea.current) {
      messageArea.current.scrollTop = messageArea.current.scrollHeight;
    }
  }, [messages.length]);

  const isSelected = (id: string) => {
    return id === bookingId;
  };

  return (
    <DashboardLayout
      className="!px-0 !py-0 overflow-hidden"
      parentClassName="!p-0 !overflow-hidden"
    >
      <Layout style={{ height: 'calc(100vh - 60px)' }}>
        <Sider
          theme="light"
          width={250}
          trigger={null}
          collapsible
          collapsed={left}
          className="border-r"
        >
          <div className="flex flex-col h-full">
            {!left && (
              <div className="p-3 border-b">
                <Input placeholder="Search" />
              </div>
            )}
            <div className="overflow-auto h-full py-3">
              <div className="flex flex-col">
                {conversations?.map((conversation, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      router.push(`/message?id=${conversation.bookingId}`);
                    }}
                    className="flex items-center gap-3 px-3 py-3 hover:bg-tertiary cursor-pointer"
                    style={{
                      margin: !left ? '' : 'auto',
                      backgroundColor: isSelected(conversation.bookingId)
                        ? theme.primary
                        : '',
                      color: isSelected(conversation.bookingId)
                        ? theme.white
                        : '',
                    }}
                  >
                    <Avatar src={conversation.avatar} size="large" />
                    {!left && (
                      <div className="flex flex-col">
                        <Text size="label">
                          {fullName(conversation) || conversation.email}
                        </Text>
                        <Space height={3} />
                        <Text size="subTitle">
                          {conversation.service.title}
                        </Text>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Sider>
        <Layout>
          <Header className="flex flex-row justify-between bg-white border-b items-center px-3 h-[75px]">
            <Button
              type="text"
              icon={left ? <ICON.MENU_UNFOLD /> : <ICON.MENU_FOLD />}
              onClick={() => setLeft(!left)}
            />
            <Button
              type="text"
              icon={left ? <ICON.MENU_UNFOLD /> : <ICON.MENU_FOLD />}
              onClick={() => setRight(!right)}
            />
          </Header>
          <Content className="bg-white flex flex-col">
            <div
              ref={messageArea}
              className="h-full border-b p-3 flex flex-col overflow-auto gap-3"
            >
              {messages?.map((message, i) => (
                <MessageBubble
                  key={i}
                  isMe={message.isMe}
                  message={message.message}
                  isNotification={message.type === MessageType.NOTIFICATION}
                  attachments={message.attachments}
                />
              ))}
            </div>
            <div className="p-3 flex justify-between items-center gap-4">
              {/* <FileImageOutlined
                onClick={() => {}}
                className="text-2xl text-primary"
                rev={undefined}
              /> */}
              <div className=" w-full">
                <Input
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      createMessage();
                    }
                  }}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a message"
                />
              </div>
              <ICON.SEND onClick={createMessage} />
            </div>
          </Content>
        </Layout>
        <Sider
          theme="light"
          width={400}
          collapsedWidth={0}
          trigger={null}
          collapsible
          collapsed={right}
          className="border-l"
        >
          <div className="flex flex-col h-full p-3 overflow-auto">
            {!getBookingLoader && !!bookingData && (
              <Card
                header={<Text>Set your offered price</Text>}
                bodyClass="p-3"
              >
                <Input
                  value={bookingData?.price?.amount || price}
                  disabled={bookingData?.price?.acceptedByProvider}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  placeholder="Search"
                />
                {bookingData?.status === BookingStatus.CANCELLED ? (
                  <Text className="mt-2" size="subTitle">
                    User has cancelled the booking!
                  </Text>
                ) : bookingData?.price?.acceptedByProvider ? (
                  bookingData?.price?.acceptedByUser ? (
                    <Text className="mt-2" size="subTitle">
                      The price has been accepted by the user
                    </Text>
                  ) : (
                    <Text className="mt-2" size="subTitle">
                      You have set the price. Wait for the user to accept your
                      price
                    </Text>
                  )
                ) : (
                  <Button
                    loading={setBookingPriceLoader}
                    onClick={setBookingPriceHandler}
                    block
                    type="primary"
                    className="mt-3"
                  >
                    Submit
                  </Button>
                )}
              </Card>
            )}
            <Space height={20} />
            {!!bookingData?.images?.length && (
              <Card header={<Text>Booking images</Text>} bodyClass="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {bookingData?.images?.map((image, i) => (
                    <div className="h-full" key={i}>
                      <PreviewableImage height={'100%'} src={image} />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </Sider>
      </Layout>
    </DashboardLayout>
  );
};

export default Index;
