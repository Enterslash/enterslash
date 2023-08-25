import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import {
  Layout,
  AppBar,
  Input,
  Text,
  Space,
  Divider,
  Card,
  Button,
  ActionModal,
  ListItem,
  useMessageModal,
} from '@enterslash/react-native-ui';
import { css, theme } from '@enterslash/enterus/utils';
import { useRoute } from '@react-navigation/native';
import { RouteStack } from '../../../../navigation/root';
import { useHttp } from '../../../../hook/useHttp';
import {
  accept_booking_price,
  get_single_booking,
  reject_booking_price,
} from '@enterslash/enterus/http-client';
import { BookingStatus, GetSingleBookingsDTO } from '@enterslash/enterus/types';
import { Dollar } from '@enterslash/icons';
import usePayment from '../../../../hook/usePayment';
import { useAppStore } from '../../../../store/appStore';

const ConsumerChatOptions = () => {
  const router = useRoute<RouteStack<'chatOptions'>>();
  const {showMessage} = useMessageModal()
  const bookingId = router.params.bookingId;
  const { toggleLoader } = useAppStore();
  const [priceModal, setPriceModal] = useState(false);
  const [bookingData, setBookingData] = useState<GetSingleBookingsDTO>();
  const { openPaySheet } = usePayment();

  const { request: getBooking } = useHttp(() => {
    return get_single_booking(bookingId);
  });

  const { loading: rejectLoader, request: reject } = useHttp(() => {
    return reject_booking_price(bookingId);
  });

  useEffect(() => {
    getBooking().then((res) => {
      setBookingData(res);
    });
  }, []);

  const showAcceptConfirmDialog = async () => {
    setPriceModal(false);
    toggleLoader(true);
    openPaySheet({
      amount: bookingData?.price?.amount,
      bookingId,
    }).then((res) => {
      if (res.error) {
        toggleLoader(false);
        showMessage(res.error.localizedMessage, 'error');
      } else if (res.id) {
        accept_booking_price(bookingId, {
          payId: res.id,
        })
          .then(() => {
            setBookingData((prev) => ({
              ...prev,
              price: {
                ...prev.price,
                acceptedByUser: true,
              },
            }));
            toggleLoader(false);
            showMessage('Booking confirmed!', 'success');
          })
          .catch(() => {
            toggleLoader(false);
            showMessage('Booking confirmation failed!', 'error');
          });
      }
    }).catch(() => {
      toggleLoader(false);
      showMessage('Booking confirmation failed!', 'error');
    });
  };

  const showRejectConfirmDialog = () => {
    return Alert.alert(
      'Are your sure?',
      'Are you sure you want cancel the booking?',
      [
        {
          text: 'Yes',
          onPress: () => {
            reject().then(() => {
              setBookingData((prev) => ({
                ...prev,
                status: BookingStatus.CANCELLED,
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

  return (
    <>
      <ActionModal
        isModalVisible={priceModal}
        setIsModalVisible={() => setPriceModal(false)}
      >
        <Card style={{ width: '100%' }}>
          <Text style={{ padding: css.padding.md }}>Offered price</Text>
          <Divider vr />
          <View style={{ padding: css.padding.md }}>
            <Input
              editable={false}
              small
              value={bookingData?.price?.amount?.toString()}
            />
            <Space height={css.padding.md} />
            {bookingData?.status === BookingStatus.CANCELLED ? (
              <Text center>You have canceled the booking!</Text>
            ) : bookingData?.price?.acceptedByUser ? (
              <Text center>You have accepted the offered price!</Text>
            ) : bookingData?.price?.acceptedByProvider ? (
              <View style={{ flexDirection: 'row' }}>
                <Button
                  onPress={showAcceptConfirmDialog}
                  style={{ flex: 1 }}
                  small
                >
                  Accept
                </Button>
                <Space width={5} />
                <Button
                  onPress={showRejectConfirmDialog}
                  loader={rejectLoader}
                  color={theme.danger}
                  small
                >
                  Reject
                </Button>
              </View>
            ) : (
              <Text center>Wait for the provider to set a price</Text>
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
          <View style={{ paddingHorizontal: css.padding.md }}>
            <ListItem
              title={'Service Price'}
              onPress={() => setPriceModal(true)}
              icon={
                <Dollar
                  strokeWidth="2"
                  height="20px"
                  width="20px"
                  stroke="white"
                />
              }
            />
          </View>
        </ScrollView>
      </Layout>
    </>
  );
};

export default ConsumerChatOptions;
