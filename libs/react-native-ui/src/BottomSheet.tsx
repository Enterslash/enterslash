import React, { useMemo, useRef, useEffect, MutableRefObject } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import RNBottomSheet from '@gorhom/bottom-sheet';
import { ScreenHeight } from '@enterslash/react-native-utils';
// import { theme } from 'styles/theme';

export type BottomSheetRef = RNBottomSheet;

interface Props {
  children: React.ReactNode;
  modalRef: MutableRefObject<BottomSheetRef | null>;
  fullScreen?: number[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  height?: number;
}

export const BottomSheet = ({
  children,
  modalRef,
  contentContainerStyle,
  height,
}: Props) => {
  const modal = useRef<BottomSheetRef | null>(null);

  useEffect(() => {
    if (modal.current) {
      modalRef.current = modal.current;
    }
  }, []);

  const snapPoints = useMemo(() => [1, height || (2 * ScreenHeight) / 3], []);
  return (
    <RNBottomSheet
      ref={modal}
      index={-1}
      snapPoints={snapPoints}
      // onChange={handleSheetChanges}
      // backgroundComponent={() => null}
      // handleComponent={() => null}
      // enablePanDownToClose={true}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <View
        style={{
          ...styles.contentContainer,
          ...(contentContainerStyle as object),
        }}
      >
        <View style={styles.drop} />
        {children}
      </View>
    </RNBottomSheet>
  );
};

const styles = StyleSheet.create({
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'background: rgba(70, 55, 202, 0.59)',
  },
  drop: {
    width: 60,
    height: 5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    alignItems: 'center',
    // backgroundColor: theme.colors.white,
  },
});
