import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import { setLocalItem } from './localstorage';

const channelId = 'enterus';

export const configureNotification = () => {
  PushNotification.configure({
    onNotification: async function (notification: any) {
      const tempLink = `enterus://${notification.link}`
      if (notification.foreground) {
        await Linking.openURL(tempLink);
      } else {
        setLocalItem("DEEP_URL", tempLink)
      }
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("18 ===> ", notification);
    },
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
}

export const createNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: channelId,
      channelName: channelId,
      playSound: true,
    },
    (created) => console.log(`createChannel returned '${created}'`)
  );
};

export const requestUserPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS["POST_NOTIFICATIONS"]);
    } catch (error) { }
  }
  const authStatus = await messaging().requestPermission({
    sound: true,
    alert: true,
    providesAppNotificationSettings: true,
  });
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

export const notificationListener = async (callback: (arg: FirebaseMessagingTypes.RemoteMessage) => void) => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    callback(remoteMessage)
  });
  const message = await messaging().getInitialNotification();
  if (message) {
    callback(message)
  }
}

export const registerBackgroundHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    if (remoteMessage.data) {
      const body = JSON.parse(remoteMessage.data["body"])
      PushNotification.localNotification({
        channelId: channelId,
        title: remoteMessage.data["title"],
        message: body.message,
        link: body.link,
      } as any);
    }
  });
};

export const registerForegroundHandler = () => {
  messaging().onMessage(async (remoteMessage) => {
    if (remoteMessage.data) {
      const body = JSON.parse(remoteMessage.data["body"])
      PushNotification.localNotification({
        channelId: channelId,
        title: remoteMessage.data["title"],
        message: body.message,
        link: body.link,
      } as any);
    }
  });
};

export const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    return null
  }
}