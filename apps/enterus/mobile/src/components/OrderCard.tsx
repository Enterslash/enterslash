import {
  Avatar,
  ProductCard,
  Space,
  Status,
  StatusType,
  TEXT,
  Text,
} from '@enterslash/react-native-ui';
import React from 'react';
import { ImageSourcePropType, View } from 'react-native';
import { Clock, Dollar } from '@enterslash/icons';
import { css } from '@enterslash/enterus/utils';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../navigation/root';
import { formatDate, sliceText, snackToNormalText } from '@enterslash/utils';
import { BookingStatus, BookingType, IBooking } from '@enterslash/enterus/types';

interface ServiceCardProps {
  image: ImageSourcePropType | string;
  avatar?: ImageSourcePropType | string;
  date: IBooking['date'];
  name: string;
  title: string;
  mode: BookingType;
  list?: boolean;
  id: string;
  status: BookingStatus;
  onPress: () => void;
}

const statusType = {
  [BookingStatus.PENDING]: StatusType.PENDING,
  [BookingStatus.ACCEPTED]: StatusType.APPROVED,
  [BookingStatus.REJECTED]: StatusType.CANCELED,
};

const OrderCard = ({
  avatar,
  image,
  date,
  name,
  title,
  mode,
  id,
  status,
  onPress,
}: ServiceCardProps) => {
  const navigation = useNavigation<NavigationStack>();
  return (
    <ProductCard
      list
      onPress={
        onPress ||
        (() => {
          navigation.navigate('viewService', {
            id,
          });
        })
      }
      style={{ marginRight: 20 }}
      image={image}
      cardFooter={
        <View
          style={[
            {
              paddingHorizontal: css.padding.sm,
              paddingBottom: css.padding.sm,
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar source={avatar} rounded size={15} />
            <Space width={5} />
            <Text bold size={10}>
              {name}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Status type={statusType[status]} title={status} />
          </View>
        </View>
      }
    >
      <View style={{ padding: css.padding.sm }}>
        <Text bold>{title}</Text>
        {mode && (
          <>
            <Space height={10} />
            <Status
              style={{ alignSelf: 'flex-start' }}
              type={StatusType.INFO}
              title={snackToNormalText(mode)}
            />
          </>
        )}
        <Space height={10} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Clock height="15px" width="15px" />
          <Space width={5} />
          <Text bold size={10}>
            {formatDate(date.start, 'dd-MM-yy hh:mm a')}
          </Text>
        </View>
      </View>
    </ProductCard>
  );
};

export default OrderCard;
