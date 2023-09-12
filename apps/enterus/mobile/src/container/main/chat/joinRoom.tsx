import {
  AppBar,
  BottomAction,
  Button,
  Input,
  Layout,
  Select,
  useMessageModal,
} from '@enterslash/react-native-ui';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useHttp } from '../../../hook/useHttp';
import {
  get_room_identifiers,
  join_room,
} from '@enterslash/enterus/http-client';
import { IRoomModel, JoinRoomDTO } from '@enterslash/enterus/types';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../../../navigation/root';

export default function JoinRoom() {
  const [room, setRoom] = useState({
    batch: '',
    subject: '',
    section: '',
    course: '',
    code: '',
  });

  const navigation = useNavigation<NavigationStack>();

  const { showMessage } = useMessageModal();

  const { data, request } = useHttp(() => {
    return get_room_identifiers();
  });

  const {
    loading,
    request: joinRoom,
    error,
  } = useHttp<IRoomModel, JoinRoomDTO>(() => {
    return join_room(room);
  });

  const handleChange = (v, name: keyof typeof room) => {
    setRoom({ ...room, [name]: v });
  };

  useEffect(() => {
    request({
      globalLoading: true,
    });
  }, []);

  const submit = () => {
    joinRoom().then((res) => {
      showMessage('Joined Successfully', 'success');
      navigation.replace('message', {
        roomId: res._id,
      });
    });
  };

  return (
    <Layout>
      <AppBar title={'Join Group'} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={{ gap: 20 }}>
          <Input
            label="Batch"
            keyboardType="number-pad"
            maxLength={3}
            placeholder="221"
            onChangeText={(v) => handleChange(v, 'batch')}
            error={error?.batch}
            value={room.batch}
          />
          <Select
            options={data?.subject || []}
            onSelect={(v) => handleChange(v, 'subject')}
            value={room.subject}
            label={'Subjects'}
            scroll
          />
          <Select
            options={data?.section || []}
            onSelect={(v) => handleChange(v, 'section')}
            value={room.section}
            label={'Section'}
            scroll
          />
          <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Input
                label="Course"
                maxLength={3}
                placeholder="CSE"
                onChangeText={(v) => handleChange(v, 'course')}
                value={room.course}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Code"
                keyboardType="number-pad"
                maxLength={3}
                placeholder="201"
                onChangeText={(v) => handleChange(v, 'code')}
                value={room.code}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomAction>
        <Button onPress={submit} loader={loading}>
          Join
        </Button>
      </BottomAction>
    </Layout>
  );
}
