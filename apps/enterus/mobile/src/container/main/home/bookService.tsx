import {
  AppBar,
  AppTourGuide,
  BottomAction,
  Button,
  DateInput,
  FileInputBox,
  GooglePlaceInput,
  Input,
  Layout,
  Select,
  Space,
  Text,
  ToggleTab,
  WeekCheckBox,
  useAppTourGuide,
  useMessageModal,
} from '@enterslash/react-native-ui';
import { RRule } from 'rrule';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { css, theme } from '@enterslash/enterus/utils';
import ServiceCard from '../../../components/ServiceCard';
import {
  ScreenWidth,
  generateFile,
  image_picker,
  showAlert,
} from '@enterslash/react-native-utils';
import { WEEKS } from '@enterslash/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationStack, RouteStack } from '../../../navigation/root';
import { useHttp } from '../../../hook/useHttp';
import { book_service } from '@enterslash/enterus/http-client';
import { BookingType, IBooking, IBookingModel } from '@enterslash/enterus/types';
import usePayment from '../../../hook/usePayment';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import Private from '../../../components/Private';
import Chat from '../chat';
import { useTourStore } from '../../../store/tourStore';

const { Provider, Step, RegisterTourEventListener } = AppTourGuide;

const inputBoxSize = (ScreenWidth - 4 * css.padding.md) / 3;

const BookingModes = [
  {
    label: 'One Time',
    value: BookingType.ONE_TIME,
  },
  {
    label: 'Bi Weekly',
    value: BookingType.BI_WEEKLY,
  },
  {
    label: 'Weekly',
    value: BookingType.WEEKLY,
  },
  {
    label: 'Monthly',
    value: BookingType.MONTHLY,
  },
];

const BookService = () => {
  const router = useRoute<RouteStack<'bookService'>>();
  const navigation = useNavigation<NavigationStack>();
  const service = router.params?.service;
  const { showMessage } = useMessageModal();
  const [location, setLocation] = useState<IBooking['location']>({
    name: '',
    lat: 0,
    lng: 0,
  });
  const [date, setDate] = useState<IBookingModel['date']>({
    start: new Date(),
    end: new Date(),
    mode: BookingType.ONE_TIME,
  });
  const [priceInputs, setPriceInputs] = useState<IBooking['priceInputs']>([]);
  const [images, setImages] = useState([null, null, null, null, null, null]);

  const { start: startGuide, eventEmitter, canStart } = useAppTourGuide();
  const { newSignUp, state, finishTour, setTourStep } = useTourStore();

  useEffect(() => {
    if (canStart) {
      if (newSignUp && !state.booking.done) {
        setTimeout(() => {
          startGuide();
        }, 500);
      }
    }
  }, [canStart]);

  const { loading, request } = useHttp(() => {
    return book_service(service._id, {
      date: JSON.stringify({
        start: date.start.toISOString(),
        end: date.end?.toISOString(),
        mode: date.mode,
      }),
      location: JSON.stringify(location),
      images: images.filter((i) => i !== null).map((i) => generateFile(i)),
      priceInputs: JSON.stringify(priceInputs),
    });
  });

  const handleImageChange = async (index: number) => {
    if (images[index]) {
      setImages((prev) => {
        const newImages = [...prev];
        newImages[index] = null;
        return newImages;
      });
      return;
    }
    const imageArr = (await image_picker.gallery({
      multiple: true,
    })) as unknown as ImageOrVideo[];

    for (let i = 0; i < imageArr.length; i++) {
      setImages((prev) => {
        const newImages = [...prev];
        newImages[index + i] = imageArr[i].path;
        return newImages;
      });
    }
  };

  // const handleInputChange = (key: string, value: string) => {
  //   setPriceInputs((prev) => {
  //     const newInputs = [...prev];
  //     const index = newInputs.findIndex((input) => input.name === key);
  //     if (index === -1) {
  //       newInputs.push({
  //         name: key,
  //         value,
  //       });
  //     } else {
  //       newInputs[index].value = value;
  //     }
  //     return newInputs;
  //   });
  // };

  const handleSubmit = () => {
    let isOk = true;
    if (!date) {
      showAlert('Please select date', 'error');
      isOk = false;
    } else if (!location.name) {
      showAlert('Please select location', 'error');
      isOk = false;
    }
    // else if (service?.priceInputs?.length) {
    //   service?.priceInputs?.forEach((input) => {
    //     if (!priceInputs.find((i) => i.name === input.name)?.value) {
    //       isOk = false;
    //       showAlert(`Please input ${input.label}`, 'error');
    //       return;
    //     }
    //   });
    // }
    if (isOk) {
      request().then((res) => {
        showMessage('Your request has been sent to the author!', 'success');
        navigation.navigate('main');
      });
    }
  };

  // const getEstimatedCost = () => {
  //   let cost = 0;
  //   if (priceInputs?.length) {
  //     priceInputs?.forEach((input, index) => {
  //       cost += +input.value * +service.priceInputs[index].defaultValue;
  //     });
  //   }
  //   return cost;
  // };

  RegisterTourEventListener(eventEmitter, {
    onChangeStep: () => (step) => setTourStep('booking', step?.order),
    onFinish: () => finishTour('booking'),
  });

  return (
    <Layout keyboardBehavior="padding">
      <AppBar title={service?.title} />
      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderColor: theme.primary,
          backgroundColor: theme.secondary,
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
          marginHorizontal: css.padding.md,
          marginBottom: 10,
        }}
      >
        <Text primary bold>
          Estimated Cost{' '}
        </Text>
        <Text primary bold>
          {getEstimatedCost()}$
        </Text>
      </View> */}
      <ScrollView
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled={true}
        style={{ flex: 1 }}
      >
        <View style={{ paddingHorizontal: css.padding.md }}>
          <Space height={10} />
          {/* <ServiceCard
            list
            description={service?.description}
            image={service?.cover}
            title={service?.title}
            id={service?._id}
          />
          <Space height={40} /> */}
          <Text subtitle>Photos</Text>
          <Space height={7} />
          <Step zone={1} text="Select images">
            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 20,
              }}
            >
              {images.map((image, i) => (
                <FileInputBox
                  source={image}
                  key={i}
                  onPress={() => handleImageChange(i)}
                  boxSize={inputBoxSize}
                />
              ))}
            </View>
          </Step>
          <Space height={20} />
          <Step zone={2} text="Select date and time">
            <DateInput
              value={date.start}
              label="Date and Time"
              onChange={(date: Date) => {
                setDate((prev) => ({
                  ...prev,
                  start: date,
                }));
              }}
            />
          </Step>
          <Space height={15} />
          <Step zone={3} text="Select your booking type">
            <Select
              label="Booking Mode"
              options={BookingModes}
              onSelect={(value) => {
                setDate((prev) => ({
                  ...prev,
                  mode: value,
                }));
              }}
              value={date.mode}
            />
          </Step>
          <Space height={15} />
          <Step zone={4} text="Select your location">
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
          </Step>
          {/* {service?.priceInputs?.map((input) => (
            <>
              <Space height={15} />
              <Input
                inputMode="decimal"
                onChangeText={(v) => handleInputChange(input.name, v)}
                label={`${input.label} (${input.unite})`}
                placeholder={'0 ' + input.unite}
              />
            </>
          ))} */}
          <Space height={60} />
        </View>
      </ScrollView>
      <BottomAction>
        <Step zone={5} text="Select your booking type">
          <Button loader={loading} onPress={handleSubmit}>
            Submit
          </Button>
        </Step>
      </BottomAction>
    </Layout>
  );
};

const PrivateBooking = () => {
  return (
    <Private>
      <Provider>
        <BookService />
      </Provider>
    </Private>
  );
};

export default PrivateBooking;
