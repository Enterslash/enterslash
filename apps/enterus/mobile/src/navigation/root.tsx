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
// import ViewService from '../container/main/home/viewService';
// import BookService from '../container/main/home/bookService';
// import StartService from '../container/main/home/startService';
// import Notification from '../container/main/home/notification';
import { RouteProp } from '@react-navigation/native';
import { GetSingleServiceDTO } from '@enterslash/enterus/types';
import Message from '../container/main/chat/message';
import ChatOptions from '../container/main/chat/options';
import DeleteAccount from '../container/main/settings/deleteAccount';
import JoinRoom from '../container/main/chat/joinRoom';
// import ViewOrder from '../container/main/orders/viewOrder';
// import BeProvider from '../container/main/settings/beProvider';
// import ManageServices from '../container/main/settings/myServices';
// import EditService from '../container/main/settings/myServices/editService';
// import Schedule from '../container/main/settings/schedule';

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
  chatOptions: {
    bookingId: string;
  };
  // auth
  login: undefined;
  // order
  viewOrder: {
    bookingId: string;
  };
  registration: undefined;
  // settings
  editProfile: {
    signUp?: boolean;
  };
  myServices: undefined;
  editService: {
    id: string;
  };
  deleteAccount: undefined;
  beProvider: undefined;
  schedule: undefined;
  // home
  viewService: {
    id: string;
  };
  startService: {
    service: GetSingleServiceDTO;
  };
  bookService: {
    service: GetSingleServiceDTO;
  };
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
      {/* <Stack.Screen
        name="viewService"
        component={ViewService}
        options={{ headerShown: false }}
      /> */}
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
        name="chatOptions"
        component={ChatOptions}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="bookService"
        component={BookService}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="viewOrder"
        component={ViewOrder}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="startService"
        component={StartService}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="beProvider"
        component={BeProvider}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="schedule"
        component={Schedule}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="myServices"
        component={ManageServices}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="editService"
        component={EditService}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="notification"
        component={Notification}
        options={{ headerShown: false }}
      /> */}
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
