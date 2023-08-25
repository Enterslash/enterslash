import {
  Avatar,
  BackButton,
  BottomAction,
  Button,
  Layout,
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
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { css, fullName, theme } from '@enterslash/enterus/utils';
import noImage from 'assets/noImage.png';
import { useRoute } from '@react-navigation/native';
import { RouteStack } from '../../../../navigation/root';
import LinearGradient from 'react-native-linear-gradient';
import {
  ScreenHeight,
  confirmation,
} from '@enterslash/react-native-utils';
import {
  BookingStatus,
  BookingType,
  GetSingleBookingsDTO,
} from '@enterslash/enterus/types';
import { useHttp } from '../../../../hook/useHttp';
import {
  get_single_booking,
  handle_booking_status,
} from '@enterslash/enterus/http-client';
import {
  ProviderCardSkeleton,
  ServiceInfoSkeleton,
} from '../../../../components/loaders/serviceInfoSkeleton';
import { Clock, LocationMarker } from '@enterslash/icons';
import { snackToNormalText, formatDate } from '@enterslash/utils';

const ViewOrder = () => {
  const insets = useSafeAreaInsets();
  const [bookingData, setBookingData] = useState<GetSingleBookingsDTO>(null);
  const [pauseLoader, setPauseLoader] = useState(false);
  const router = useRoute<RouteStack<'viewOrder'>>();
  const {showMessage} = useMessageModal();
  const isPaused = bookingData?.status === BookingStatus.PAUSED;
  const isPauseable =
    bookingData?.date?.mode !== BookingType.ONE_TIME &&
    bookingData?.price?.acceptedByUser;

  const { loading, request } = useHttp<GetSingleBookingsDTO>(() => {
    return get_single_booking(router.params?.bookingId);
  });

  useEffect(() => {
    request().then((res) => setBookingData(res));
  }, []);

  const playPause = async () => {
    try {
      setPauseLoader(true);
      if (isPaused) {
        await handle_booking_status(
          router.params?.bookingId,
          BookingStatus.ACCEPTED
        );
        setBookingData({ ...bookingData, status: BookingStatus.ACCEPTED });
        showMessage('Booking has been resumed!', 'success');
      } else {
        await handle_booking_status(
          router.params?.bookingId,
          BookingStatus.PAUSED
        );
        setBookingData({ ...bookingData, status: BookingStatus.PAUSED });
        showMessage('Booking has been paused!', 'success');
      }
      setPauseLoader(false);
    } catch (error) {
      setPauseLoader(false);
      console.log(error);
    }
  };

  const confirmPlayPause = () => {
    confirmation({
      message: 'Are you sure you want to update the booking?',
      onConfirm: playPause,
    });
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
      <ScrollView style={{ padding: css.padding.md }}>
        <Space height={10} />
        {loading ? (
          <ServiceInfoSkeleton />
        ) : (
          <View>
            <Text bold size={TEXT.SIZE.LABEL}>
              {bookingData?.service.title}
            </Text>
            <Space height={15} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Clock height="25px" width="25px" />
              <Space width={5} />
              <Text bold>
                {formatDate(bookingData?.date.start, 'dd-MM-yy hh:mm a')}
              </Text>
            </View>
            <Space height={15} />
            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Dollar height="25px" width="25px" />
                  <Space width={5} />
                  <Text bold>${bookingData?.price}</Text>
                </View> */}
            {/* <Space height={20} /> */}
            <Text subtitle>{bookingData?.service.description}</Text>
          </View>
        )}
        <Space height={20} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Status
            style={{ alignSelf: 'flex-start' }}
            size={5}
            type={StatusType[bookingData?.status]}
            title={snackToNormalText(bookingData?.status)}
          />
          <Status
            style={{ alignSelf: 'flex-start' }}
            size={5}
            type={StatusType.INFO}
            title={snackToNormalText(bookingData?.date.mode)}
          />
        </View>
        <Space height={40} />
        <Text bold size={TEXT.SIZE.LABEL}>
          Provider
        </Text>
        <Space height={10} />
        {loading ? (
          <ProviderCardSkeleton />
        ) : (
          <View style={styles.provider}>
            <Avatar source={bookingData?.provider?.avatar} rounded size={40} />
            <Space width={15} />
            <View>
              <Text bold>{fullName(bookingData?.provider)}</Text>
              <Space height={5} />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <LocationMarker height="18px" width="18px" />
                <Space width={5} />
                <Text>{bookingData?.provider.location}</Text>
              </View>
            </View>
          </View>
        )}
        <Space height={30} />
      </ScrollView>
      {isPauseable && (
        <BottomAction>
          <Button
            color={!isPaused && theme.danger}
            disabled={loading}
            loader={pauseLoader}
            onPress={confirmPlayPause}
          >
            {!isPaused ? 'Pause' : 'Resume'}
          </Button>
        </BottomAction>
      )}
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
