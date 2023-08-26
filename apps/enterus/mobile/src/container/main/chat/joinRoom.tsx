import {
  ActionModal,
  AppBar,
  BottomAction,
  Button,
  Card,
  Input,
  Layout,
  Select,
  Space,
  Text,
} from '@enterslash/react-native-ui';
import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { section, subject } from '../../../constant';

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

  const handleChange = (v, name: keyof typeof room) => {
    setRoom({ ...room, [name]: v });
  };

  return (
    <Layout>
      <AppBar title={'Class Group'} />
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
            options={subject}
            onSelect={(v) => handleChange(v, 'subject')}
            value={room.subject}
            label={'Subjects'}
            scroll
          />
          <Select
            options={section}
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
        <Button>Add</Button>
      </BottomAction>
    </Layout>
  );
}
