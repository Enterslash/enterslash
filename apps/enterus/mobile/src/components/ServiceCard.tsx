import { Avatar, ProductCard, Space, TEXT, Text } from '@enterslash/react-native-ui';
import React from 'react';
import { ImageSourcePropType, View } from 'react-native';
import { Dollar } from '@enterslash/icons';
import { css } from '@enterslash/enterus/utils';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../navigation/root';
import { sliceText } from '@enterslash/utils';

interface ServiceCardProps {
  image: ImageSourcePropType | string;
  title: string;
  description: string;
  list?: boolean;
  id: string;
}

const ServiceCard = ({
  image,
  description,
  title,
  list,
  id,
}: ServiceCardProps) => {
  const navigation = useNavigation<NavigationStack>();
  return (
    <ProductCard
      list={list}
      onPress={() => {
        navigation.navigate('viewService', {
          id,
        });
      }}
      style={{ marginRight: 20 }}
      image={image}
      cardFooter={
        <View
          style={[
            {
              padding: css.padding.sm,
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* <Avatar source={avatar} rounded size={20} />
            <Space width={5} />
            <Text bold size={12}>
              {sliceText(name, 18)}
            </Text> */}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* <Dollar height="20px" width="20px" />
            <Space width={5} />
            <Text bold size={12}>
              ${price}
            </Text> */}
          </View>
        </View>
      }
    >
      <View style={{ padding: css.padding.sm }}>
        <Text bold>{title}</Text>
        <Space height={10} />
        <Text size={TEXT.SIZE.SUBTITLE} subtitle style={{ flexWrap: 'wrap' }}>
          {sliceText(description, list ? 70 : 120)}
        </Text>
      </View>
    </ProductCard>
  );
};

export default ServiceCard;
