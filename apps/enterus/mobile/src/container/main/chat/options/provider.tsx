import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Layout,
  AppBar,
  Input,
  Text,
  Space,
  Divider,
  Card,
  Button,
  ListItem,
  ActionModal,
  BottomAction,
  useMessageModal,
} from '@enterslash/react-native-ui';
import { css } from '@enterslash/enterus/utils';
import { useRoute } from '@react-navigation/native';
import { RouteStack } from '../../../../navigation/root';
import { useHttp } from '../../../../hook/useHttp';
import {
  complete_booking,
  get_single_booking,
  set_booking_price,
} from '@enterslash/enterus/http-client';
import { BookingStatus, GetSingleBookingsDTO } from '@enterslash/enterus/types';
import { Dollar } from '@enterslash/icons';
import { ScreenWidth } from '@enterslash/react-native-utils';
import ImageView from 'react-native-image-viewing';

const borders = 2;
const imageSize = (ScreenWidth - css.padding.md * 5 - borders) / 2;

const ProviderChatOptions = () => {
  const router = useRoute<RouteStack<'chatOptions'>>();
  const [text, setText] = useState('');
  const bookingId = router.params.bookingId;
  const [bookingData, setBookingData] = useState<GetSingleBookingsDTO>();
  const {showMessage} = useMessageModal();
  const [priceModal, setPriceModal] = useState(false);
  const [viewImage, setViewImage] = useState<string[]>([]);

  const { request: getBooking } = useHttp(() => {
    return get_single_booking(bookingId);
  });

  const { loading: setPriceLoader, request: setPrice } = useHttp(() => {
    return set_booking_price(bookingId, {
      price: +text,
    });
  });

  const { loading: completeLoader, request: completeService } = useHttp(() => {
    return complete_booking(bookingId);
  });

  useEffect(() => {
    getBooking().then((res) => {
      setBookingData(res);
    });
  }, []);

  const showAcceptCompleteDialog = () => {
    return Alert.alert(
      'Are your sure?',
      'Are you sure you want set the price?',
      [
        {
          text: 'Yes',
          onPress: () => {
            setPrice().then(() => {
              setBookingData((prev) => ({
                ...prev,
                price: {
                  ...prev.price,
                  acceptedByProvider: true,
                },
              }));
              setPriceModal(false);
            });
          },
        },
        {
          text: 'No',
        },
      ]
    );
  };

  const completeTheService = () => {
    return Alert.alert(
      'Are your sure?',
      'Are you sure the service is complete?',
      [
        {
          text: 'Yes',
          onPress: () => {
            completeService().then(() => {
              showMessage('Service completed successfully', 'success');
            });
          },
        },
        {
          text: 'No',
        },
      ]
    );
  };

  const openViewImageHandler = (images: string[]) => {
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
      <ActionModal
        isModalVisible={priceModal}
        setIsModalVisible={() => setPriceModal(false)}
      >
        <Card style={{ width: '100%' }}>
          <Text style={{ padding: css.padding.md }}>Offered price</Text>
          <Divider vr />
          <View style={{ padding: css.padding.md }}>
            <Input
              editable={bookingData?.price?.acceptedByProvider}
              keyboardType="numeric"
              small
              value={bookingData?.price?.amount?.toString() || text}
              onChangeText={(v) => setText(v)}
            />
            <Space height={css.padding.md} />
            {bookingData?.status === BookingStatus.CANCELLED ? (
              <Text center>User has canceled the booking!</Text>
            ) : bookingData?.price?.acceptedByUser ? (
              <Text center>User has accepted the offered price!</Text>
            ) : bookingData?.price?.acceptedByProvider ? (
              <Text center>
                You have set the price. Wait for the user to accept your offered
                price
              </Text>
            ) : (
              <Button
                loader={setPriceLoader}
                onPress={showAcceptCompleteDialog}
                // style={{ flex: 1 }}
                small
              >
                Submit
              </Button>
            )}
          </View>
        </Card>
      </ActionModal>
      <Layout>
        <AppBar title="Chat Options" />
        <ScrollView
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled={true}
          style={{ flex: 1 }}
        >
          <Space height={20} />
          <View style={{ paddingHorizontal: css.padding.md, gap: 10 }}>
            <ListItem
              onPress={() => setPriceModal(true)}
              title={'Set Service Price'}
              icon={
                <Dollar
                  strokeWidth="2"
                  height="20px"
                  width="20px"
                  stroke="white"
                />
              }
            />
            {!!bookingData?.images?.length && (
              <Card style={{ width: '100%' }}>
                <Text style={{ padding: css.padding.md }}>Booking images</Text>
                <Divider vr />
                <TouchableOpacity
                  onPress={() => openViewImageHandler(bookingData?.images)}
                  style={{
                    padding: css.padding.md,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: css.padding.md,
                  }}
                >
                  {bookingData?.images?.map((img, i) => (
                    <Image
                      key={i}
                      source={{ uri: img }}
                      style={{
                        width: imageSize,
                        height: imageSize,
                        borderRadius: 10,
                      }}
                    />
                  ))}
                </TouchableOpacity>
              </Card>
            )}
          </View>
        </ScrollView>
      </Layout>
      <BottomAction>
        <Button loader={completeLoader} onPress={completeTheService}>
          Complete
        </Button>
      </BottomAction>
    </>
  );
};

export default ProviderChatOptions;
