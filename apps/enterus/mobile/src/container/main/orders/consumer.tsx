import React from 'react';
import { fullName } from '@enterslash/enterus/utils';
import { get_my_bookings } from '@enterslash/enterus/http-client';
import OrderCard from '../../../components/OrderCard';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../../../navigation/root';
import PaginatedTabs from './paginatedTabs';

const ConsumerChatOptions = () => {
  const { navigate } = useNavigation<NavigationStack>();
  return (
    <PaginatedTabs
      api={get_my_bookings}
      renderItem={(item) => (
        <OrderCard
          list
          status={item.status}
          avatar={item.provider.avatar}
          image={item.service.cover}
          name={fullName(item.provider)}
          date={item?.date}
          mode={item?.date?.mode}
          title={item.service.title}
          id={item._id}
          onPress={() => {
            navigate('viewOrder', {
              bookingId: item._id,
            });
          }}
        />
      )}
    />
  );
};

export default ConsumerChatOptions;
