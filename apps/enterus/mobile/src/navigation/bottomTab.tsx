import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Chat as ChatIcon,
  Home as HomeIcon,
  List,
  Settings as SettingsIcon,
} from '@enterslash/icons';
import { theme } from '@enterslash/enterus/utils';
import { StyleSheet, View } from 'react-native';
// import Home from '../container/main/home';
import Chat from '../container/main/chat';
import Settings from '../container/main/settings';
// import Orders from '../container/main/orders';
import { useMessageStore } from '../store/message';
import {
  NavigatorScreenParams,
  useFocusEffect,
} from '@react-navigation/native';
import {
  listen_unseen_message,
  listen_unseen_notification,
} from '@enterslash/enterus/socket-client';
import { useNotificationStore } from '../store/notification';

export type MainStackParamList = {
  home: undefined;
  //   search: undefined;
  chat: undefined;
  orders: undefined;
  settings: undefined;
};

const Tab = createBottomTabNavigator<MainStackParamList>();

const PAGE_ICON_MAP: Record<
  keyof MainStackParamList,
  ({ color }) => JSX.Element
> = {
  home: ({ color }) => <HomeIcon fill={color} height={`25px`} width={`25px`} />,
  //   search: ({ color }) => <Search fill={color} height={`25px`} width={`25px`} />,
  orders: ({ color }) => <List fill={color} height={`26px`} width={`26px`} />,
  chat: ({ color }) => <ChatIcon fill={color} height={`25px`} width={`25px`} />,
  settings: ({ color }) => (
    <SettingsIcon fill={color} height={`25px`} width={`25px`} />
  ),
};

function MainStack() {
  const insets = useSafeAreaInsets();
  const {
    unseenMessage,
    updateUnseenMessage,
    updateConversationUnseenMessage,
  } = useMessageStore();
  const { updateUnseenNotification } = useNotificationStore();

  useFocusEffect(
    React.useCallback(() => {
      listen_unseen_message((data) => {
        updateConversationUnseenMessage(data.bookingId, data.count);
        updateUnseenMessage(data.count);
      });

      listen_unseen_notification((data) => {
        updateUnseenNotification(data.count);
      });
    }, [])
  );

  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          return (
            <View style={focused && styles.iconContainer}>
              {focused && <View style={[styles.iconBar, {}]} />}
              {PAGE_ICON_MAP[route.name]({ color })}
            </View>
          );
        },
        labelStyle: { fontSize: 15 },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.grey200,
        tabBarStyle: {
          height: 80 + insets.bottom,
          paddingTop: 10,
          paddingBottom: 10 + insets.bottom,
        },
      })}
    >
      {/* <Tab.Screen name="home" component={Home} /> */}
      <Tab.Screen
        name="chat"
        options={
          !!unseenMessage && {
            tabBarBadge: unseenMessage,
          }
        }
        component={Chat}
      />
      {/* <Tab.Screen name="orders" component={Orders} /> */}
      <Tab.Screen name="settings" component={Settings} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    backgroundColor: theme.secondary,
    padding: 10,
    borderRadius: 5,
  },
  iconBar: {
    position: 'absolute',
    top: -17,
    height: 3,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    width: 45,
    backgroundColor: theme.primary,
  },
});

export type BottomNavigationParams = NavigatorScreenParams<MainStackParamList>;
export default MainStack;
