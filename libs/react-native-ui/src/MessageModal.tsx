import React, { createContext, useContext, useState } from 'react';
import { ActionModal } from './Modal';
import { Card } from './Card';
import { Text } from './Text';
import { css, theme } from '@enterslash/enterus/utils';
import { Button } from './Button';
import { View } from 'react-native';
import { Illustration } from '@enterslash/illustrations';

type ModalType = 'success' | 'error';

interface MessageModalContext {
  showMessage?: (messageText: string, messageType: ModalType) => void;
}

const MessageModalState = createContext<MessageModalContext>({});

export const MessageModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ModalType>('success');

  const showMessage = (messageText: string, modalType: ModalType) => {
    setMessage(messageText);
    setIsModalVisible(true);
    setType(modalType);
  };

  const onPressDone = () => {
    setMessage('');
    setIsModalVisible(false);
  };
  const isSuccess = type === 'success';
  const color = isSuccess ? theme.primary : theme.danger;
  return (
    <MessageModalState.Provider value={{ showMessage }}>
      <ActionModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      >
        <View style={{alignItems: 'center'}}>
          <Card style={{ padding: css.padding.md, width: 300 }}>
            <View style={{ alignItems: 'center' }}>
              {isSuccess ? (
                <Illustration.SuccessCircle />
              ) : (
                <Illustration.FailedCircle />
              )}
            </View>
            <View
              style={{ paddingVertical: css.padding.lg, paddingHorizontal: 5 }}
            >
              <Text color={color} bold size={16} center>
                {message}
              </Text>
            </View>
            <Button color={color} onPress={onPressDone}>
              Done
            </Button>
          </Card>
        </View>
      </ActionModal>
      {children}
    </MessageModalState.Provider>
  );
};

export const useMessageModal = () => useContext(MessageModalState);
