import { Layout } from '@enterslash/react-native-ui';
import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import Logo from 'assets/logo.svg';
import { theme, validateUserProfile } from '@enterslash/enterus/utils';
import {
  ScreenWidth,
  getFCMToken,
  getLocalItem,
  removeLocalItem,
} from '@enterslash/react-native-utils';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../../navigation/root';
import {
  get_app_state,
  get_my_profile,
  update_fcm,
} from '@enterslash/enterus/http-client';
import { useUserStore } from '../../store/userStore';
import { useMessageStore } from '../../store/message';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notification';
import { subscribe_socket } from '@enterslash/enterus/socket-client';

const Splash = () => {
  const offset = useSharedValue(0);
  const { replace } = useNavigation<NavigationStack>();
  const { setUnseenMessage } = useMessageStore();
  const { setUnseenNotification } = useNotificationStore();
  const { setAuthenticated } = useAuthStore();
  const { setUser } = useUserStore();

  const notAuthenticated = () => {
    setAuthenticated(false);
    replace('main');
  };

  const authenticated = async () => {
    setAuthenticated(true);
    const url = getLocalItem('DEEP_URL');
    if (url) {
      removeLocalItem('DEEP_URL');
      await Linking.openURL(url);
    } else {
      replace('main');
    }
  };

  const updateFCM = async () => {
    const fcm_token = await getFCMToken();
    if (fcm_token) {
      await update_fcm({ fcmToken: fcm_token });
    }
  };

  const goToEditProfile = () => {
    replace('editProfile', { signUp: true });
  };

  const loadProgress = (fn, progress) => {
    offset.value = withTiming(progress, { duration: 500 }, () => {
      runOnJS(fn)();
    });
  };

  const updateAppState = async () => {
    const data = await get_app_state();
    setUnseenMessage(data.unseenMessages);
    setUnseenNotification(data.unseenNotifications);
  };

  const updateProfile = async () => {
    const profile = await get_my_profile();
    if (profile) {
      setUser(profile);
      subscribe_socket(profile._id);
      if (!validateUserProfile(profile)) {
        loadProgress(goToEditProfile, 100);
      }
    }
  };

  const checkToken = async () => {
    try {
      const token = getLocalItem('TOKEN');
      if (token) {
        loadProgress(updateFCM, 25);
        loadProgress(updateProfile, 50);
        loadProgress(updateAppState, 75);
        loadProgress(authenticated, 100);
      } else {
        loadProgress(notAuthenticated, 100);
      }
    } catch (error) {
      loadProgress(notAuthenticated, 100);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      offset.value = 0;
      offset.value = withTiming(25, { duration: 500 }, () => {
        runOnJS(checkToken)();
      });
    }, [])
  );

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: offset.value + '%',
    };
  });

  return (
    <Layout>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Logo />
        <View style={styles.container}>
          <Animated.View style={[styles.progressBar, animatedStyles]} />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    height: 10,
    borderRadius: 20,
    width: ScreenWidth * (2 / 3),
    backgroundColor: theme.grey100,
  },
  progressBar: {
    height: 10,
    borderRadius: 20,
    width: '50%',
    backgroundColor: theme.primary,
  },
});

export default Splash;
