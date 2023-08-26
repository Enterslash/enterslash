import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Layout,
  Space,
  Text,
  AppBar,
  Avatar,
  ListItem,
} from '@enterslash/react-native-ui';
import { css, fullName } from '@enterslash/enterus/utils';
import { LocationMarker, User } from '@enterslash/icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../../../navigation/root';
import { useAction } from '../../../hook/useAction';
import { useUserStore } from '../../../store/userStore';
import { Icons } from '@enterslash/react-native-icons';

const Settings = () => {
  const { user } = useUserStore();
  const navigation = useNavigation<NavigationStack>();
  const { logout } = useAction();

  return (
    <Layout>
      <AppBar
        title="Settings"
        renderRight={
          <TouchableOpacity onPress={logout}>
            <Icons.LogOut />
          </TouchableOpacity>
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
                onPress={() => navigation.navigate('deleteAccount')}
                icon={<User height="20px" width="20px" />}
                title="Delete Account"
              />
            </View>
          </View>
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

// const PrivateSettings = () => {
//   return (
//     <Private>
//       <Settings />
//     </Private>
//   );
// };

export default Settings;
