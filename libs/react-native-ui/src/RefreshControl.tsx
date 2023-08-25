import React from 'react';
import {RefreshControl} from 'react-native';

interface Props {
  onRefresh: () => void;
  refreshing?: boolean;
  colors?: string[];
  tintColor?: string;
}

export const Refresh = ({
  onRefresh,
  refreshing = false,
  // colors = [theme.colors.white],
  // tintColor = theme.colors.primary,
  ...rest
}: Props) => (
  <RefreshControl
    {...rest}
    // tintColor={tintColor}
    // colors={colors}
    refreshing={refreshing}
    onRefresh={onRefresh}
  />
);
