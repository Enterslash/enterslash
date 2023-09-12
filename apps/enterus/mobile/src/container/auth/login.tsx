import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  AppBar,
  Button,
  Input,
  Layout,
  Space,
  TEXT,
  Text,
} from '@enterslash/react-native-ui';
import { css, theme } from '@enterslash/enterus/utils';
import { Email, Lock } from '@enterslash/icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../../navigation/root';
import { AuthSuccessDTO, LoginDTO } from '@enterslash/enterus/types';
import { login } from '@enterslash/enterus/http-client';
import { useHttp } from '../../hook/useHttp';
import { setLocalItem, showAlert } from '@enterslash/react-native-utils';

const Login = () => {
  const { navigate, replace } = useNavigation<NavigationStack>();
  const [user, setUser] = useState<LoginDTO>({
    email: '',
    password: '',
  });

  const { error, request, loading } = useHttp<AuthSuccessDTO, LoginDTO>(() => {
    return login(user);
  });

  const onSubmit = async () => {
    if (!user.email || !user.password) {
      showAlert('Please fill all fields', 'error');
      return;
    }
    request().then((res) => {
      setLocalItem('TOKEN', res?.jwtToken);
      replace('splash');
    });
  };

  const handleChange = (name: keyof typeof user, value: string) => {
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const goToRegistration = () => {
    navigate('registration');
  };

  return (
    <Layout>
      {/* <AppBar /> */}
      <ScrollView style={{ paddingHorizontal: css.padding.md, flex: 1 }}>
        <Space height={40} />
        <View>
          <Text bold size={TEXT.SIZE.TITLE}>
            Welcome to{' '}
            <Text bold color={theme.primary} size={TEXT.SIZE.TITLE}>
              Enterus
            </Text>
          </Text>
          <Space height={10} />
          <Text>Login with your enterus account</Text>
        </View>
        <Space height={20} />
        <Input
          error={error?.email}
          onChangeText={(v) => handleChange('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
          value={user.email}
          leftIcon={<Email />}
          placeholder="Email"
        />
        <Space height={10} />
        <Input
          error={error?.password}
          onChangeText={(v) => handleChange('password', v)}
          value={user.password}
          password
          leftIcon={<Lock />}
          placeholder="Password"
        />
        <Space height={30} />
        <Button loader={loading} onPress={onSubmit}>
          Login
        </Button>
        <Space height={10} />
        <Text primary center bold onPress={goToRegistration}>
          Create a new account
        </Text>
        {/* <Space height={100} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Divider vr length={150} />
          <Space width={10} />
          <Text>or</Text>
          <Space width={10} />
          <Divider vr length={150} />
        </View>
        <Space height={30} />
        <Button iconLeft={<Image source={google} />} ghost>
          Google
        </Button> */}
      </ScrollView>
    </Layout>
  );
};
export default Login;
