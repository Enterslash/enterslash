import {
  AppBar,
  BottomAction,
  Button,
  DateInput,
  GooglePlaceInput,
  Layout,
  Space,
  useMessageModal,
} from '@enterslash/react-native-ui';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { css } from '@enterslash/enterus/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationStack, RouteStack } from '../../../navigation/root';
import { BookingType, IBooking, IBookingModel } from '@enterslash/enterus/types';
import Private from '../../../components/Private';
import { useHttp } from '../../../hook/useHttp';
import { start_service } from '@enterslash/enterus/http-client';
import { showAlert } from '@enterslash/react-native-utils';

const StartService = () => {
  const router = useRoute<RouteStack<'bookService'>>();
  const navigation = useNavigation<NavigationStack>();
  const service = router.params?.service;
  const { showMessage } = useMessageModal();
  const [location, setLocation] = useState<IBooking['location']>({
    name: '',
    lat: 0,
    lng: 0,
  });
  const [range, setRange] = useState(10);

  const [date, setDate] = useState<IBookingModel['date']>({
    start: new Date(),
    end: new Date(),
    mode: BookingType.ONE_TIME,
  });

  const { request, loading, error } = useHttp(() => {
    return start_service(service._id, {
      location: {
        lat: location.lat,
        lng: location.lng,
        name: location.name,
        range,
      },
    });
  });

  const submit = () => {
    if (location.name === '') {
      showAlert('Please select a location', 'error');
      return;
    }
    request().then(() => {
      navigation.navigate('main', {
        screen: 'home',
      });
      showMessage('Service request have been sent to the author', 'success');
    });
  };

  return (
    <Layout keyboardBehavior="padding">
      <AppBar title={service?.title} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled={true}
        style={{ flex: 1 }}
      >
        <View style={{ paddingHorizontal: css.padding.md }}>
          <Space height={10} />
          {/* <DateInput
            value={date.start}
            label="Date and Time"
            onChange={(date: Date) => {
              setDate((prev) => ({
                ...prev,
                start: date,
              }));
            }}
          />
          <Space height={15} /> */}
          <GooglePlaceInput
            value={location.name}
            onChangeLocation={(data, details) => {
              setLocation({
                name: data?.description,
                lat: details?.geometry?.location?.lat,
                lng: details?.geometry?.location?.lng,
              });
            }}
          />
          <Space height={60} />
        </View>
      </ScrollView>
      <BottomAction>
        <Button onPress={submit} loader={loading}>
          Submit
        </Button>
      </BottomAction>
    </Layout>
  );
};

export default StartService;
