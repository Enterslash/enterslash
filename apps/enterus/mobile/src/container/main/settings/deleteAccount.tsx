import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import {
  Layout,
  AppBar,
  Space,
  BottomAction,
  Button,
  useMessageModal,
  Input,
} from '@enterslash/react-native-ui';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../../../navigation/root';
import { css } from '@enterslash/enterus/utils';
import { useHttp } from '../../../hook/useHttp';
import { delete_account } from '@enterslash/enterus/http-client';
import { CommonActions } from '@react-navigation/native';
import { useAuthStore } from '../../../store/authStore';
import { useAction } from '../../../hook/useAction';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const { logout } = useAction();
  const { showMessage } = useMessageModal();

  const { loading, request } = useHttp(() => {
    return delete_account({
      password,
    });
  });

  const handleSubmit = () => {
    return Alert.alert('Are your sure?', 'You can not revert the process?', [
      {
        text: 'Yes',
        onPress: () => {
          request().then((res) => {
            if (res) {
              showMessage('Your account has been deleted!', 'success');
              logout();
            }
          });
        },
      },
      {
        text: 'No',
      },
    ]);
  };

  return (
    <Layout>
      <AppBar title={'Delete Account'} />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginHorizontal: css.padding.md }}>
          <Input
            value={password}
            onChangeText={(v) => setPassword(v)}
            label="Password"
          />
        </View>
        <Space height={20} />
      </ScrollView>
      <BottomAction>
        <Button disabled={!password} onPress={handleSubmit} loader={loading}>
          Delete
        </Button>
      </BottomAction>
    </Layout>
  );
};

export default DeleteAccount;
