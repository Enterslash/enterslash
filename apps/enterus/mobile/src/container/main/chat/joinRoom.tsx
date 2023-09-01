import {
  AppBar,
  BottomAction,
  Button,
  Input,
  Layout,
  Select,
} from '@enterslash/react-native-ui';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useHttp } from '../../../hook/useHttp';
import { get_room_identifiers } from '@enterslash/enterus/http-client';

type Props = {
  onCreate: () => void;
  modalVisible: boolean;
  setModalVisible: (state: boolean) => void;
};

export default function JoinRoom({
  onCreate,
  modalVisible,
  setModalVisible,
}: Props) {
  const [room, setRoom] = useState({
    batch: '',
    subject: '',
    section: '',
    course: '',
    code: '',
  });

  const { data, request } = useHttp(() => {
    return get_room_identifiers();
  });

  const handleChange = (v, name: keyof typeof room) => {
    setRoom({ ...room, [name]: v });
  };

  useEffect(() => {
    request({
      globalLoading: true,
    });
  }, []);

  return (
    <Layout>
      <AppBar title={'Join Group'} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={{ gap: 10 }}>
          <Input
            label="Batch"
            keyboardType="number-pad"
            maxLength={3}
            placeholder="221"
            onChangeText={(v) => handleChange(v, 'batch')}
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
        <Button>Join</Button>
      </BottomAction>
    </Layout>
  );
}
