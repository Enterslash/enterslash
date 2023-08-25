import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SkeletonView, Space } from '@enterslash/react-native-ui';
import { css, theme } from '@enterslash/enterus/utils';

export const ServiceInfoSkeleton = () => {
  return (
    <View>
      <SkeletonView height={15} width="50%" />
      <Space height={10} />
      <SkeletonView height={15} width={50} />
      <Space height={30} />
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i}>
          <SkeletonView height={15} width="100%" />
          <Space height={10} />
        </View>
      ))}
      <SkeletonView height={15} width="40%" />
    </View>
  );
};

export const ProviderCardSkeleton = () => {
  return (
    <View style={styles.provider}>
      <SkeletonView radius={100} height={80} width={80} />
      <View style={{ flex: 1, marginLeft: 20 }}>
        <SkeletonView height={15} width="100%" />
        <Space height={10} />
        <SkeletonView height={15} width="40%" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  provider: {
    padding: css.padding.md,
    width: '100%',
    height: 130,
    borderColor: theme.grey200,
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
