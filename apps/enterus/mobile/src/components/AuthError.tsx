import { useNavigation } from '@react-navigation/native';
import { Illustration } from '@enterslash/illustrations';
import { AppBar, Button, Layout, Text } from '@enterslash/react-native-ui';
import React from 'react';
import { View } from 'react-native';
import { NavigationStack } from '../navigation/root';

export default function AuthError() {
  const navigation = useNavigation<NavigationStack>();
  const goToLogin = () => {
    navigation.navigate('login');
  };
  return (
    <Layout>
      <AppBar
        style={{
          position: 'absolute',
          zIndex: 1,
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Illustration.Security height="300px" width="300px" />
        <Button onPress={goToLogin} style={{ width: 250 }}>
          Login to Continue
        </Button>
      </View>
    </Layout>
  );
}
