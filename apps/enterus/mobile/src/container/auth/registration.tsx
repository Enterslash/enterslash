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
import { Email, Lock, Username } from '@enterslash/icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../../navigation/root';
import { AuthSuccessDTO, RegisterDTO } from '@enterslash/enterus/types';
import { registration } from '@enterslash/enterus/http-client';
import { setLocalItem, showAlert } from '@enterslash/react-native-utils';
import { useHttp } from '../../hook/useHttp';

const Registration = () => {
  const { navigate, replace } = useNavigation<NavigationStack>();
  const [user, setUser] = useState<RegisterDTO>({
    email: '',
    password: '',
    username: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const { error, request, loading } = useHttp<AuthSuccessDTO, RegisterDTO>(
    () => {
      return registration(user);
    }
  );

  const onSubmit = async () => {
    if (user.password !== confirmPassword) {
      showAlert("Password doesn't match", 'error');
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

  const goToLogin = () => {
    navigate('login');
  };

  return (
    <Layout>
      <AppBar />
      <ScrollView style={{ paddingHorizontal: css.padding.md, flex: 1 }}>
        <View>
          <Text bold size={TEXT.SIZE.TITLE}>
            Welcome to{' '}
            <Text bold color={theme.primary} size={TEXT.SIZE.TITLE}>
              Enterus
            </Text>
          </Text>
          <Space height={10} />
          <Text>Create a new enterus account</Text>
        </View>
        <Space height={20} />
        <View>
          <View>
            <Input
              error={error?.username}
              onChangeText={(v) => handleChange('username', v)}
              autoCapitalize="none"
              value={user.username}
              leftIcon={<Username />}
              placeholder="Username"
            />
            <Space height={10} />
            <Input
              error={error?.email}
              onChangeText={(v) => handleChange('email', v)}
              autoCapitalize="none"
              keyboardType="email-address"
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
            <Space height={10} />
            <Input
              error={
                confirmPassword && user.password !== confirmPassword
                  ? "password doesn't match!"
                  : ''
              }
              onChangeText={(v) => setConfirmPassword(v)}
              value={confirmPassword}
              password
              leftIcon={<Lock />}
              placeholder="Confirm Password"
            />
          </View>
          <Space height={30} />
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox size={15} value={isChecked} onChange={(v) => setIsChecked(v)} />
          </View> */}
          <Button loader={loading} onPress={onSubmit}>
            Register
          </Button>
          <Space height={10} />
          <Text primary center bold onPress={goToLogin}>
            Login to existing account
          </Text>
        </View>
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
        </Button>
        <Space height={20} /> */}
      </ScrollView>
      {/* <BottomAction>
        <Text center size={13}>
          By registering, you agree with enterus
        </Text>
        <Text center size={13}>
          <LinkTag link="https://enterus.co/terms_of_use" text="Terms of use" />
          {' '}and{' '}
          <LinkTag
            link="https://enterus.co/privacy_policy"
            text="Privacy policy"
          />
        </Text>
      </BottomAction> */}
    </Layout>
  );
};

// const LinkTag = ({ text, link }: { text: string; link: string }) => (
//   <Text
//     onPress={() => {
//       Linking.openURL(link);
//     }}
//     center
//     primary
//     size={13}
//   >
//     {text}
//   </Text>
// );

export default Registration;
