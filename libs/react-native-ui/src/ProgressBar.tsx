import React from 'react';
import {View, StyleSheet} from 'react-native';
// import {theme} from 'styles/theme';

export const ProgressBar = ({value = 0}) => {
  return (
    <View style={styles.barBody}>
      <View style={[styles.bar, {width: `${value}0%`}]}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  barBody: {
    width: '100%',
    height: 5,
    backgroundColor: '#efefef',
  },
  bar: {
    height: 5,
    // backgroundColor: theme.colors.tertiary,
  },
});
