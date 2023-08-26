import React from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import MainStack, { BottomNavigationParams } from './bottomTab';
import Login from '../container/auth/login';
import Registration from '../container/auth/registration';
import EditProfile from '../container/main/settings/editProfile';
import Splash from '../container/splash';
import { RouteProp } from '@react-navigation/native';
import Message from '../container/main/chat/message';
import DeleteAccount from '../container/main/settings/deleteAccount';
import JoinRoom from '../container/main/chat/joinRoom';

export type RootStackParamList = {
  // splash
  splash: undefined;
  // main
  main: BottomNavigationParams;
  //home
  notification: undefined;
  //chat
  message: {
    bookingId: string;
  };
  joinRoom: undefined;
  // auth
  login: undefined;
  // order
  registration: undefined;
  // settings
  editProfile: {
    signUp?: boolean;
  };
  deleteAccount: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="splash">
      <Stack.Screen
        name="splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="main"
        component={MainStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="registration"
        component={Registration}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="editProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="message"
        component={Message}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="joinRoom"
        component={JoinRoom}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="deleteAccount"
        component={DeleteAccount}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export type NavigationStack = NativeStackNavigationProp<RootStackParamList>;
export type RouteStack<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

export default RootNavigation;
