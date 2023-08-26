import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import {
  Button,
  Input,
  Layout,
  Space,
  AppBar,
  Avatar,
  BottomAction,
  GooglePlaceInput,
  Text,
  useMessageModal,
} from '@enterslash/react-native-ui';
import { css, theme } from '@enterslash/enterus/utils';
import { Pencil } from '@enterslash/icons';
import { EditProfileDTO, IUserModel } from '@enterslash/enterus/types';
import {
  generateFile,
  image_picker,
  isUrl,
} from '@enterslash/react-native-utils';
import { useHttp } from '../../../hook/useHttp';
import { edit_profile, get_my_profile } from '@enterslash/enterus/http-client';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationStack, RouteStack } from '../../../navigation/root';
import { useAction } from '../../../hook/useAction';
import { useUserStore } from '../../../store/userStore';

const EditProfile = () => {
  const navigation = useNavigation<NavigationStack>();
  const router = useRoute<RouteStack<'editProfile'>>();
  const { showMessage } = useMessageModal();
  const signUp = router?.params?.signUp;
  const { setUser } = useUserStore();

  const skip = () => {
    navigation.replace('main');
  };

  const [tempUser, setTempUser] = useState<EditProfileDTO>({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
  });

  const [tempAvatar, setTempAvatar] = useState('');

  const { request: get_profile_request } = useHttp<IUserModel>(() => {
    return get_my_profile();
  });

  const {
    error: edit_profile_error,
    loading: edit_profile_loader,
    request: edit_profile_request,
  } = useHttp<IUserModel, IUserModel>(() => {
    return edit_profile({
      firstName: tempUser.firstName,
      lastName: tempUser.lastName,
      location: tempUser.location,
      phone: tempUser.phone,
      avatar: !isUrl(tempAvatar) && generateFile(tempAvatar),
    });
  });

  useEffect(() => {
    get_profile_request({ globalLoading: true }).then((res) => {
      if (res) {
        setTempUser({
          firstName: res?.firstName,
          lastName: res?.lastName,
          phone: res?.phone,
          location: res?.location,
        });
        setTempAvatar(res?.avatar);
      }
    });
  }, []);

  const handleChange = (name: keyof typeof tempUser, value: string) => {
    setTempUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async () => {
    try {
      const image = await image_picker.gallery();
      setTempAvatar(image.path);
    } catch (error) {
      console.log(error);
    }
  };

  const getProfileUrl = (): ImageSourcePropType => {
    if (tempAvatar) {
      return { uri: tempAvatar };
    } else {
      return undefined;
    }
  };

  const editProfile = () => {
    edit_profile_request().then((res) => {
      showMessage('Profile updated successfully', 'success');
      setUser(res);
      navigation.replace('main');
    });
  };

  return (
    <Layout>
      <AppBar
        noBack={signUp}
        title={signUp ? 'Compete Your Profile' : 'Edit Profile'}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ paddingHorizontal: css.padding.md, flex: 1 }}
      >
        <Space height={20} />
        <View style={styles.avatarBody}>
          <TouchableOpacity
            onPress={handleFileChange}
            style={styles.avatarInfo}
          >
            <Avatar source={getProfileUrl()} size={130} />
            <View style={styles.editIcon}>
              <Pencil height="20px" width="20px" />
            </View>
          </TouchableOpacity>
        </View>
        <Space height={15} />
        <Input
          value={tempUser.firstName}
          error={edit_profile_error?.firstName}
          label="First Name"
          placeholder="John"
          onChangeText={(v) => handleChange('firstName', v)}
        />
        <Space height={15} />
        <Input
          value={tempUser.lastName}
          error={edit_profile_error?.lastName}
          label="Last Name"
          placeholder="Doo"
          onChangeText={(v) => handleChange('lastName', v)}
        />
        <Space height={15} />
        <Input
          value={tempUser.phone}
          error={edit_profile_error?.phone}
          label="Phone"
          placeholder="1234567891"
          onChangeText={(v) => handleChange('phone', v)}
        />
        <Space height={15} />
        <GooglePlaceInput
          value={tempUser.location}
          error={edit_profile_error?.location}
          onChangeLocation={({ description }) =>
            handleChange('location', description)
          }
        />
        <Space height={20} />
      </ScrollView>
      <BottomAction>
        <Button onPress={editProfile} loader={edit_profile_loader}>
          {signUp ? 'Complete' : 'Save'}
        </Button>
        {signUp && (
          <>
            <Space height={20} />
            <TouchableOpacity onPress={skip}>
              <Text center bold primary>
                Skip
              </Text>
            </TouchableOpacity>
          </>
        )}
      </BottomAction>
    </Layout>
  );
};

const styles = StyleSheet.create({
  avatarBody: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: theme.secondary,
    borderColor: theme.primary,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  avatarInfo: {
    position: 'relative',
  },
});

export default EditProfile;
