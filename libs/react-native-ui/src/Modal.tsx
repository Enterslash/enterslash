import React from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export const ActionModal = ({
  isModalVisible,
  setIsModalVisible,
  children,
  fullScreen,
}: Props) => {
  return (
    <Modal
      style={[fullScreen && styles.fullScreen]}
      isVisible={isModalVisible}
      hasBackdrop={true}
      animationIn="zoomIn"
      animationOut="zoomOut"
      onBackdropPress={() => setIsModalVisible(false)}
    >
      {children}
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    margin: 0,
    flex: 1,
  },
});
