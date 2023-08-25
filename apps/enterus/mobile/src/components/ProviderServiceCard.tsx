import { ProductCard, Status, StatusType, Text } from '@enterslash/react-native-ui';
import React from 'react';
import { ImageSourcePropType, View } from 'react-native';
import { css } from '@enterslash/enterus/utils';
import { ProviderServiceStatus } from '@enterslash/enterus/types';

interface ServiceCardProps {
  image: ImageSourcePropType | string;
  avatar?: ImageSourcePropType | string;
  name: string;
  title: string;
  id: string;
  status: ProviderServiceStatus;
  onPress: () => void;
}

const statusType = {
  [ProviderServiceStatus.PENDING]: StatusType.PENDING,
  [ProviderServiceStatus.ACTIVE]: StatusType.APPROVED,
  [ProviderServiceStatus.REJECTED]: StatusType.CANCELED,
};

const ProviderServiceCard = ({
  image,
  title,
  status,
  onPress,
}: ServiceCardProps) => {
  return (
    <ProductCard
      list
      onPress={onPress}
      style={{ marginRight: 20, height: 120 }}
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
            <Status type={statusType[status]} title={status} />
          </View>
        </View>
      }
    >
      <View style={{ padding: css.padding.sm }}>
        <Text bold>{title}</Text>
      </View>
    </ProductCard>
  );
};

export default ProviderServiceCard;
