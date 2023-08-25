import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { Loader } from './Loader';
import { Space } from './Space';

export const AppLoader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.loader}>
        <Loader type="WanderingCubes" />
        {/* <Space width={20} />
        <Text bold size={20} color="white">
          Loading
        </Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#00000099',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    padding: 20,
    backgroundColor: '#0000009c',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
