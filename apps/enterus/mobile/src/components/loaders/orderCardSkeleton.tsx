import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SkeletonView, Space } from '@enterslash/react-native-ui';
import { css, theme } from '@enterslash/enterus/utils';

interface Props {
  noOfItems?: number;
}

export const OrderSkeleton = ({ noOfItems = 10 }: Props) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: noOfItems }).map((_, i) => (
        <View style={styles.view} key={i}>
          <SkeletonView
            style={{
              borderBottomStartRadius: 10,
              borderTopStartRadius: 10,
            }}
            width={160}
            height="100%"
          ></SkeletonView>
          <View
            style={{ padding: css.padding.sm, justifyContent: 'space-between', flex: 1 }}
          >
            <View>
              <SkeletonView height={10} width="100%" />
              <Space height={10} />
              <SkeletonView height={10} width={150} />
              <Space height={10} />
              <SkeletonView height={10} width={100} />
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <SkeletonView height={10} width={60} />
              <SkeletonView height={10} width={60} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    width: '100%',
    height: 130,
    borderColor: theme.grey200,
    borderWidth: 1,
    borderRadius: 10,
  },
  container: {
    gap: 20,
  },
});
