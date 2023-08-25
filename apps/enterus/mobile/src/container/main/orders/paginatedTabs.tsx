import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import {
  Layout,
  AppBar,
  Space,
  Refresh,
  ToggleTab,
} from '@enterslash/react-native-ui';
import { css } from '@enterslash/enterus/utils';
import { useHttp } from '../../../hook/useHttp';
import { OrderSkeleton } from '../../../components/loaders/orderCardSkeleton';
import { BookingStatus } from '@enterslash/enterus/types';

const tabs = [
  {
    title: 'Pending',
    value: [BookingStatus.PENDING],
  },
  {
    title: 'Approved',
    value: [BookingStatus.ACCEPTED, BookingStatus.PAUSED],
  },
  {
    title: 'Complete',
    value: [BookingStatus.COMPLETED],
  },
];

const limit = 10;

interface Props<T> {
  api: (skip: number, limit: number, tab: number) => Promise<T[]>;
  renderItem: (item: T) => React.ReactNode;
}

function PaginatedTabs<T>({ api, renderItem }: Props<T>) {
  const [tab, setTab] = useState(1);

  const [data, setData] = useState({
    0: [],
    1: [],
    2: [],
  });

  const [skip, setSkip] = useState({
    0: 0,
    1: 0,
    2: 0,
  });

  const [hasMore, setHasMore] = useState({
    0: true,
    1: true,
    2: true,
  });

  const { loading, request } = useHttp<T[]>(() => {
    return api(skip[tab], limit, tab);
  });

  const refresh = () => {
    setHasMore((prevHasMore) => {
      return {
        ...prevHasMore,
        [tab]: true,
      };
    });
    setData((prevData) => {
      return {
        ...prevData,
        [tab]: [],
      };
    });
    setSkip((prevSkip) => {
      return {
        ...prevSkip,
        [tab]: 0,
      };
    });
  };

  const fetchData = () => {
    if (hasMore[tab] === false) {
      return;
    }
    request().then((data) => {
      setData((prevData) => {
        return {
          ...prevData,
          [tab]: [...prevData[tab], ...data],
        };
      });
      if (data.length < limit) {
        setHasMore((prevHasMore) => {
          return {
            ...prevHasMore,
            [tab]: false,
          };
        });
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [tab, skip]);

  const handleEndReached = () => {
    setSkip((prevSkip) => {
      return {
        ...prevSkip,
        [tab]: prevSkip[tab] + limit,
      };
    });
  };

  const listFooterComponent = useCallback(() => {
    return <ActivityIndicator style={{ marginVertical: 20 }} size={'large'} />;
  }, []);

  return (
    <Layout>
      <AppBar title="Service Orders" />
      <View style={{ paddingHorizontal: css.padding.md }}>
        <ToggleTab
          tabs={tabs}
          active={tab}
          onTabChange={(tab) => setTab(tab)}
        />
        <Space height={20} />
      </View>
      <FlatList
        data={data[tab]}
        refreshControl={<Refresh onRefresh={refresh} />}
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
            {renderItem(item)}
            <Space height={20} />
          </>
        )}
        onEndReached={handleEndReached}
        ListFooterComponent={loading && listFooterComponent}
        keyExtractor={(item, index) => `${tab}-${item._id}-${index}`}
      />
    </Layout>
  );
}

export default PaginatedTabs;
