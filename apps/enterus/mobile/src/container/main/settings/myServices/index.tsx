import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import {
  Layout,
  AppBar,
  Space,
  Refresh,
  ToggleTab,
} from '@enterslash/react-native-ui';
import { css, fullName } from '@enterslash/enterus/utils';
import { useHttp } from '../../../../hook/useHttp';
import { get_my_service_requests } from '@enterslash/enterus/http-client';
import { OrderSkeleton } from '../../../../components/loaders/orderCardSkeleton';
import {
  IProviderServiceModel,
  ProviderServiceStatus,
} from '@enterslash/enterus/types';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../../../../navigation/root';
import ProviderServiceCard from '../../../../components/ProviderServiceCard';

const tabs = [
  {
    title: 'Pending',
    value: ProviderServiceStatus.PENDING,
  },
  {
    title: 'Active',
    value: ProviderServiceStatus.ACTIVE,
  },
  {
    title: 'Inactive',
    value: ProviderServiceStatus.DEACTIVATED,
  },
];

const ManageServices = () => {
  const { navigate } = useNavigation<NavigationStack>();
  const [tab, setTab] = useState(1);

  const { data, error, loading, request } = useHttp<IProviderServiceModel[]>(
    () => {
      return get_my_service_requests();
    }
  );

  useEffect(() => {
    request();
  }, []);

  const filterData = (status: ProviderServiceStatus) => {
    return data?.filter((item) => status === item.status);
  };
  return (
    <Layout>
      <AppBar title="My Service" />
      <View style={{ paddingHorizontal: css.padding.md }}>
        <ToggleTab
          tabs={tabs}
          active={tab}
          onTabChange={(tab) => setTab(tab)}
        />
        <Space height={20} />
      </View>
      <FlatList
        data={filterData(tabs[tab].value)}
        refreshControl={<Refresh onRefresh={request} />}
        style={{ paddingHorizontal: css.padding.md, flex: 1 }}
        ListEmptyComponent={() => {
          if (loading) {
            return <OrderSkeleton />;
          } else {
            return null;
          }
        }}
        renderItem={({ item }) => (
          <>
            <ProviderServiceCard
              status={item.status}
              avatar={item.provider.avatar}
              image={item.service.cover}
              name={fullName(item.provider)}
              title={item.service.title}
              id={item._id}
              onPress={() => {
                navigate('editService', {
                  id: item._id,
                });
              }}
            />
            <Space height={20} />
          </>
        )}
        keyExtractor={(item) => item._id}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({});

export default ManageServices;
