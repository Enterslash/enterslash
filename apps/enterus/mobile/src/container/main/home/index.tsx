import {
  Badge,
  Input,
  Layout,
  Space,
  TEXT,
  Text,
} from '@enterslash/react-native-ui';
import React, { useEffect, useState } from 'react';
import topbar from 'assets/topbar.png';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Search } from '@enterslash/icons';
import { css, theme } from '@enterslash/enterus/utils';
import ServiceCard from '../../../components/ServiceCard';
import { useHttp } from '../../../hook/useHttp';
import { get_categories, get_services } from '@enterslash/enterus/http-client';
import { ServiceSkeleton } from '../../../components/loaders/serviceCardSkeleton';
import { GetCategoryDTO, GetMultiServicesDTO } from '@enterslash/enterus/types';
import { shuffle } from 'lodash';
import { useNotificationStore } from '../../../store/notification';
import { NavigationStack } from '../../../navigation/root';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const insets = useSafeAreaInsets();
  const { unseenNotification } = useNotificationStore();
  const navigation = useNavigation<NavigationStack>();
  const [search, setSearch] = useState('');
  const [randomServices, setRandomServices] = useState([]);
  const {
    data: services,
    loading: serviceLoader,
    request: getServices,
  } = useHttp<GetMultiServicesDTO[]>(() => {
    return get_services();
  });

  const { request: getCategory } = useHttp<GetCategoryDTO[]>(() => {
    return get_categories();
  });

  useEffect(() => {
    getServices().then((res) => {
      setRandomServices(shuffle(res));
    });
    getCategory();
  }, []);

  const handleSearch = (v) => {
    setSearch(v);
  };

  const getSearchedServices = services?.filter((service) => {
    return service.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Layout dark noStatusbar>
      <ImageBackground
        style={{
          width: '100%',
          height: 80 + insets.top,
          marginTop: -insets.top,
          paddingTop: insets.top,
        }}
        source={topbar}
      >
        <View style={styles.topInfo}>
          {/* <Avatar size={40} rounded /> */}
          {/* <Space width={10} /> */}
          <Input
            style={{ flex: 1 }}
            value={search}
            onChangeText={handleSearch}
            small
            rounded
            leftIcon={<Search fill={theme.grey200} />}
            placeholder="Search services"
          />
          <Space width={10} />
          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={() => {
              navigation.navigate('notification');
            }}
          >
            <Badge
              type={!unseenNotification ? 'none' : 'text'}
              content={unseenNotification}
            >
              <Bell height="22px" width="22px" />
            </Badge>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <ScrollView>
        <Space height={10} />
        <View style={{ padding: css.padding.md }}>
          {/* <View>
            <Text bold size={TEXT.SIZE.LABEL}>
              Popular Categories
            </Text>
            <Space height={15} />
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              style={styles.hrScroll}
            >
              {categories?.map((item) => (
                <View key={item._id} style={[styles.badge, { marginRight: 10 }]}>
                  <Text>{item.name}</Text>
                </View>
              ))}
              <Space width={20} />
            </ScrollView>
          </View> */}
          {/* <Space height={40} /> */}
          {search !== '' ? (
            <View>
              <Text bold size={TEXT.SIZE.LABEL}>
                Searched Services
              </Text>
              <Space height={15} />
              <ScrollView
                showsHorizontalScrollIndicator={false}
                style={styles.hrScroll}
              >
                <View style={{ gap: 15 }}>
                  {getSearchedServices?.map((service) => (
                    <ServiceCard
                      list
                      key={service._id}
                      id={service._id}
                      description={service.description}
                      image={service.cover}
                      title={service.title}
                    />
                  ))}
                </View>
                <Space width={20} />
              </ScrollView>
            </View>
          ) : (
            <>
              <View>
                <Text bold size={TEXT.SIZE.LABEL}>
                  Popular Services
                </Text>
                <Space height={15} />
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  style={styles.hrScroll}
                >
                  {serviceLoader ? (
                    <ServiceSkeleton />
                  ) : (
                    randomServices.map((service) => (
                      <ServiceCard
                        key={service._id}
                        id={service._id}
                        description={service.description}
                        image={service.cover}
                        title={service.title}
                      />
                    ))
                  )}
                  <Space width={20} />
                </ScrollView>
              </View>
              <Space height={40} />
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text bold size={TEXT.SIZE.LABEL}>
                    New Services
                  </Text>
                </View>
                <Space height={15} />
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  style={styles.hrScroll}
                >
                  {serviceLoader ? (
                    <ServiceSkeleton />
                  ) : (
                    services?.map((service) => (
                      <ServiceCard
                        id={service._id}
                        key={service._id}
                        description={service.description}
                        image={service.cover}
                        title={service.title}
                      />
                    ))
                  )}
                  <Space width={20} />
                </ScrollView>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
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

export default Home;
