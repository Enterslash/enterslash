import React, { useState } from 'react';
import {
  StyleSheet,
  TextInputProps,
  View,
  TouchableOpacity,
} from 'react-native';
import { TEXT, Text } from './Text';
import { css, theme } from '@enterslash/enterus/utils';
import { Location } from '@enterslash/icons';
import { ActionModal } from './Modal';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppBar } from './AppBar';
import { Space } from './Space';
import { IsIos } from '@enterslash/react-native-utils';
import { sliceText } from '@enterslash/utils';

interface Props extends Partial<TextInputProps> {
  error?: string;
  onChangeLocation: (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => void;
  value?: string;
}

export const GooglePlaceInput = ({ error, value, onChangeLocation }: Props) => {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  return (
    <>
      <ActionModal
        isModalVisible={open}
        setIsModalVisible={() => {
          setOpen(false);
        }}
        fullScreen
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: theme.white,
            paddingTop: IsIos ? insets.top : 0,
          }}
        >
          <AppBar
            onClose={() => {
              setOpen(false);
            }}
            title="Search Location"
          />
          <View style={{ flex: 1, paddingHorizontal: css.padding.md }}>
            <Space height={10} />
            <GooglePlacesAutocomplete
              textInputProps={{
                placeholderTextColor: 'grey',
                style: styles.input,
              }}
              enablePoweredByContainer={false}
              placeholder="Search"
              onPress={(data, details) => {
                onChangeLocation(data, details);
                setOpen(false);
              }}
              onFail={(error) => console.error(error)}
              fetchDetails={true}
              GooglePlacesDetailsQuery={{ fields: "geometry" }}
              query={{
                key: 'AIzaSyDLhpVxRDQJ9kL4C850UmCXx85x6Dgvenw',
                language: 'en',
              }}
              styles={{
                description: {
                  color: theme.black
                }
              }}
            />
          </View>
        </View>
      </ActionModal>
      <Text size={15} subtitle style={styles.label}>
        Location
      </Text>
      <TouchableOpacity style={styles.container} onPress={() => setOpen(true)}>
        <View style={[styles.input]}>
          <Text size={TEXT.SIZE.INPUT} subtitle>
            {sliceText(value, 30) || 'Select Location'}
          </Text>
        </View>
        <View style={styles.rightIcon}>
          <Location height="30px" width="30px" />
        </View>
        {error ? (
          <Text style={{ marginTop: 5, color: 'red' }}>
            {error}
          </Text>
        ) : null}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  leftIcon: {
    position: 'absolute',
    marginLeft: 15,
  },
  rightIcon: {
    position: 'absolute',
    right: 15,
  },
  label: {
    marginBottom: 7,
  },
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    borderColor: theme.grey200,
    backgroundColor: theme.white,
    // elevation: 7,
    paddingLeft: css.padding.md,
    paddingVertical: css.padding.md,
    borderWidth: 1,
    fontSize: 18,
    borderRadius: css.border.radius.sm,
    color: theme.black,
  },
});
