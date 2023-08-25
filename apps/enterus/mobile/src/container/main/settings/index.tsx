import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import {
  Button,
  Divider,
  Layout,
  Space,
  Text,
  AppBar,
  Avatar,
  ListItem,
  Status,
  StatusType,
} from '@enterslash/react-native-ui';
import { css, fullName } from '@enterslash/enterus/utils';
import { LocationMarker, User, Calendar } from '@enterslash/icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../../../navigation/root';
import { useAction } from '../../../hook/useAction';
import { useUserStore } from '../../../store/userStore';
import usePayment from '../../../hook/usePayment';
import Private from '../../../components/Private';
import { checkAccess } from '../../../utils/checkAccess';
import { UserType } from '@enterslash/enterus/types';
import { useTourStore } from '../../../store/tourStore';
import { showAlert } from '@enterslash/react-native-utils';

const Settings = () => {
  const { openCardSheet } = usePayment();
  const { user } = useUserStore();
  const { startTour } = useTourStore();
  const navigation = useNavigation<NavigationStack>();
  const { logout, loader } = useAction();
  const isProvider = checkAccess(UserType.PROVIDER);

  const startTutorial = () => {
    startTour();
    showAlert('Tutorial has been restarted!', 'success');
  };

  return (
    <Layout>
      <AppBar
        title="Settings"
        renderRight={
          !isProvider ? null : (
            <Status type={StatusType.PENDING} size={2} title="Provider" />
          )
        }
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginHorizontal: css.padding.md }}>
          <Space height={20} />
          <View style={styles.avatarInfo}>
            <Avatar source={user?.avatar} size={130} />
            <Space height={15} />
            {!!fullName(user) && <Text bold>{fullName(user)}</Text>}
            <Space height={5} />
            {!!user?.location && (
              <View style={{ flexDirection: 'row' }}>
                <LocationMarker height="18px" width="18px" />
                <Space width={5} />
                <Text style={{ maxWidth: 300, marginTop: -1 }} center>
                  {user?.location}
                </Text>
              </View>
            )}
            <Space height={30} />
            <View style={{ alignItems: 'center', gap: 15 }}>
              <ListItem
                icon={<User height="20px" width="20px" />}
                title="User Information"
                onPress={() => navigation.navigate('editProfile')}
              />
              <ListItem
                onPress={openCardSheet}
                icon={<User height="20px" width="20px" />}
                title="Payment Details"
              />
              <ListItem
                onPress={() => navigation.navigate('schedule')}
                icon={<User height="20px" width="20px" />}
                title="Schedule"
              />
              <ListItem
                onPress={() => navigation.navigate('beProvider')}
                icon={<User height="20px" width="20px" />}
                title={isProvider ? 'Identity' : 'Become a Provider'}
              />
              {isProvider && (
                <ListItem
                  onPress={() => navigation.navigate('myServices')}
                  icon={<User height="20px" width="20px" />}
                  title="Manage Services"
                />
              )}
              <ListItem
                onPress={startTutorial}
                icon={<User height="20px" width="20px" />}
                title="Restart Tutorial"
              />
              <ListItem
                onPress={() => navigation.navigate('deleteAccount')}
                icon={<User height="20px" width="20px" />}
                title="Delete Account"
              />
              <Divider vr length={300} space={10} />
              <ListItem
                onPress={() => {
                  Linking.openURL('https://enterslash.com/contact');
                }}
                icon={<User height="20px" width="20px" />}
                title="Help and Support"
              />
              <ListItem
                onPress={() => {
                  Linking.openURL('https://enterus.co/privacy_policy');
                }}
                icon={<User height="20px" width="20px" />}
                title="Privacy Policy"
              />
            </View>
          </View>
          <Space height={50} />
          <Button loader={loader} onPress={logout}>Logout</Button>
          <Space height={20} />
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  avatarInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const PrivateSettings = () => {
  return (
    <Private>
      <Settings />
    </Private>
  );
};

export default PrivateSettings;
