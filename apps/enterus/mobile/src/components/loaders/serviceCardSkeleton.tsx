import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SkeletonView, Space } from '@enterslash/react-native-ui';
import { css, theme } from '@enterslash/enterus/utils';

interface Props {
  noOfItems?: number;
}

export const ServiceSkeleton = ({ noOfItems = 10 }: Props) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: noOfItems }).map((_, i) => (
        <View style={styles.view} key={i}>
          <SkeletonView
            style={{
              borderTopEndRadius: 10,
              borderTopStartRadius: 10,
            }}
            height={140}
            width="100%"
          ></SkeletonView>
          <View style={{ padding: css.padding.sm }}>
            <SkeletonView height={10} width={100} />
            <Space height={20} />
            <SkeletonView height={10} width="100%" />
            <Space height={10} />
            <SkeletonView height={10} width="100%" />
            <Space height={10} />
            <SkeletonView height={10} width="100%" />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    width: 250,
    height: 300,
    borderColor: theme.grey200,
    borderWidth: 1,
    borderRadius: 10,
  },
  container: {
    flexDirection: 'row',
    gap: 20,
  },
});
