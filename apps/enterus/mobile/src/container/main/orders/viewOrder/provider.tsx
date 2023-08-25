import {
  BackButton,
  BottomAction,
  Button,
  Divider,
  Layout,
  Select,
  Space,
  Status,
  StatusType,
  TEXT,
  Text,
  useMessageModal,
} from '@enterslash/react-native-ui';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { css, theme } from '@enterslash/enterus/utils';
import noImage from 'assets/noImage.png';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationStack, RouteStack } from '../../../../navigation/root';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenHeight } from '@enterslash/react-native-utils';
import { BookingStatus, GetSingleBookingsDTO } from '@enterslash/enterus/types';
import { useHttp } from '../../../../hook/useHttp';
import {
  get_single_booking,
  update_booking_status,
} from '@enterslash/enterus/http-client';
import { ServiceInfoSkeleton } from '../../../../components/loaders/serviceInfoSkeleton';
import { Chat, Clock } from '@enterslash/icons';
import { formatDate, snackToNormalText } from '@enterslash/utils';
import { useAppStore } from '../../../../store/appStore';

const ViewOrder = () => {
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState(false);
  const navigation = useNavigation<NavigationStack>();
  const router = useRoute<RouteStack<'viewOrder'>>();
  const { showMessage } = useMessageModal();
  const bookingId = router.params?.bookingId;
  const { toggleLoader } = useAppStore();
  const [bookingData, setBookingData] = useState<GetSingleBookingsDTO>();

  const { loading, request } = useHttp<GetSingleBookingsDTO>(() => {
    return get_single_booking(bookingId);
  });

  useEffect(() => {
    request().then((res) => {
      setBookingData(res);
    });
  }, []);

  const openChat = () => {
    navigation.navigate('message', {
      bookingId,
    });
  };

  const triggerStatusChange = async (status: BookingStatus) => {
    return Alert.alert(
      'Are your sure?',
      `Are you sure you want update the status?`,
      [
        {
          text: 'Yes',
          onPress: async () => {
            try {
              toggleLoader(true);
              await update_booking_status(bookingId, status);
              toggleLoader(false);

              showMessage('Order status updated successfully', 'success');
              if (status === BookingStatus.REJECTED) {
                navigation.goBack();
              } else {
                setBookingData((prev) => ({
                  ...prev,
                  status,
                }));
              }
            } catch (error) {
              showMessage(error, 'error');
              toggleLoader(false);
            }
          },
        },
        {
          text: 'No',
        },
      ]
    );
  };

  return (
    <Layout dark noStatusbar>
      <ImageBackground
        style={{
          width: '100%',
          height: ScreenHeight / 3.5,
          marginTop: -insets.top,
        }}
        source={loading ? noImage : { uri: bookingData?.service.cover }}
      >
        <LinearGradient
          colors={
            loading
              ? [theme.grey100, theme.grey100]
              : [
                  '#000000e8',
                  '#000000ab',
                  'transparent',
                  'transparent',
                  'transparent',
                ]
          }
          style={{ flex: 1, paddingTop: insets.top + 10 }}
        >
          <BackButton />
        </LinearGradient>
      </ImageBackground>

      <ScrollView>
        <Space height={10} />
        {loading ? (
          <View style={{ padding: css.padding.md }}>
            <ServiceInfoSkeleton />
          </View>
        ) : (
          <View>
            <View style={{ padding: css.padding.md }}>
              <Text bold size={TEXT.SIZE.LABEL}>
                {bookingData?.service.title}
              </Text>
              <Space height={15} />
              <Text subtitle>{bookingData?.service.description}</Text>
              <Space height={15} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Clock height="25px" width="25px" />
                  <Space width={5} />
                  <Text bold>
                    {formatDate(bookingData?.date.start, 'dd-MM-yy hh:mm a')}
                  </Text>
                </View>
                <Status
                  style={{ alignSelf: 'flex-start' }}
                  size={5}
                  type={StatusType.INFO}
                  title={snackToNormalText(bookingData?.date.mode)}
                />
              </View>
            </View>
            <Divider space={10} vr />
            <View style={{ padding: css.padding.md }}>
              <Select
                options={[
                  {
                    label: 'Accept',
                    value: BookingStatus.ACCEPTED,
                  },
                  {
                    label: 'Reject',
                    value: BookingStatus.REJECTED,
                  },
                ]}
                onSelect={(value: BookingStatus) => {
                  triggerStatusChange(value);
                }}
                defaultValue={bookingData?.status}
                value={bookingData?.status}
                label={'Booking Status'}
              />
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: theme.primary,
                alignItems: 'center',
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text bold primary>
                {snackToNormalText(bookingData?.status)}
              </Text>
              <Switch
                trackColor={{ true: theme.primary }}
                disabled={bookingData?.status === BookingStatus.COMPLETED}
                // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                // ios_backgroundColor="#3e3e3e"
                onValueChange={triggerStatusChange}
                value={status}
              />
            </View> */}
          </View>
        )}
        <Space height={20} />
      </ScrollView>
      <BottomAction>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            iconLeft={
              <Chat fill={theme.white} height={`28px`} width={`28px`} />
            }
            style={{ flex: 1 }}
            onPress={openChat}
          >
            Message
          </Button>
        </View>
      </BottomAction>
    </Layout>
  );
};

const styles = StyleSheet.create({
  provider: {
    borderColor: theme.grey200,
    borderRadius: css.border.radius.md,
    padding: css.padding.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    width: 200,
    height: 200,
    borderColor: theme.grey200,
    borderWidth: 1,
  },
  hrScroll: {
    marginHorizontal: -css.padding.md,
    paddingHorizontal: css.padding.md,
  },
  topInfo: {
    flex: 1,
    paddingHorizontal: css.padding.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationIcon: {
    borderRadius: css.border.radius.full,
    padding: 10,
    backgroundColor: theme.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: theme.white,
    borderRadius: css.border.radius.full,
    borderColor: theme.grey200,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

export default ViewOrder;
