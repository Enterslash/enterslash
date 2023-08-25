import {
  BackButton,
  BottomAction,
  Button,
  Layout,
  Space,
  TEXT,
  Text,
  AppTourGuide,
  useAppTourGuide,
} from '@enterslash/react-native-ui';
import React, { useEffect } from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { css, theme } from '@enterslash/enterus/utils';
import noImage from 'assets/noImage.png';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationStack, RouteStack } from '../../../navigation/root';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenHeight } from '@enterslash/react-native-utils';
import { GetSingleServiceDTO, UserType } from '@enterslash/enterus/types';
import { useHttp } from '../../../hook/useHttp';
import { get_service } from '@enterslash/enterus/http-client';
import { ServiceInfoSkeleton } from '../../../components/loaders/serviceInfoSkeleton';
import { checkAccess } from '../../../utils/checkAccess';
import { useTourStore } from '../../../store/tourStore';
const { Provider, Step, RegisterTourEventListener } = AppTourGuide;

const ViewServiceSceen = () => {
  const insets = useSafeAreaInsets();
  const { start: startGuide, eventEmitter, canStart } = useAppTourGuide();
  const { newSignUp, state, setTourStep, finishTour } = useTourStore();
  const navigation = useNavigation<NavigationStack>();
  const router = useRoute<RouteStack<'viewService'>>();
  const { data, loading, request } = useHttp<GetSingleServiceDTO>(() => {
    return get_service(router.params?.id);
  });

  useEffect(() => {
    if (canStart) {
      request().then(() => {
        if (newSignUp && !state.viewService.done) {
          startGuide();
        }
      });
    }
  }, [canStart]);

  const book = () => {
    navigation.navigate('bookService', {
      service: data,
    });
  };

  const startService = () => {
    navigation.navigate('startService', {
      service: data,
    });
  };

  RegisterTourEventListener(eventEmitter, {
    onChangeStep: () => (step) => setTourStep('viewService', step?.order),
    onFinish: () => finishTour('viewService'),
  });

  return (
    <Layout dark noStatusbar>
      <ImageBackground
        style={{
          width: '100%',
          height: ScreenHeight / 3.5,
          marginTop: -insets.top,
        }}
        source={loading ? noImage : { uri: data?.cover }}
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
              {data?.title}
            </Text>
            <Space height={15} />
            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Dollar height="25px" width="25px" />
                <Space width={5} />
                <Text bold>${data?.price}</Text>
              </View> */}
            {/* <Space height={20} /> */}
            <Text subtitle>{data?.description}</Text>
          </View>
        )}
        {/* <Space height={40} />
          <Text bold size={TEXT.SIZE.LABEL}>
            Provider
          </Text>
          <Space height={10} />
          {loading ? (
            <ProviderCardSkeleton />
          ) : (
            <View style={styles.provider}>
              <Avatar source={data?.provider?.avatar} rounded size={80} />
              <Space width={15} />
              <View>
                <Text bold>{fullName(data?.provider)}</Text>
                <Space height={5} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <LocationMarker height="18px" width="18px" />
                  <Space width={5} />
                  <Text>{data?.provider.location}</Text>
                </View>
              </View>
            </View>
          )}
          <Space height={30} /> */}
      </ScrollView>
      <BottomAction>
        {checkAccess(UserType.PROVIDER) ? (
          <Step zone={1} text={'Click here to start the service'}>
            <Button disabled={loading} onPress={startService}>
              Start this service
            </Button>
          </Step>
        ) : (
          <Step zone={1} text={'Click here to book the service'}>
            <Button disabled={loading} onPress={book}>
              Book this service
            </Button>
          </Step>
        )}
      </BottomAction>
    </Layout>
  );
};

const ViewService = () => {
  return (
    <Provider>
      <ViewServiceSceen />
    </Provider>
  );
};

export default ViewService;
