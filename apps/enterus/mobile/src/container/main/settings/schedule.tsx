import {
  ActionModal,
  AppBar,
  Button,
  Card,
  Checkbox,
  Input,
  Layout,
  Space,
  Text,
} from '@enterslash/react-native-ui';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Clock } from '@enterslash/icons';
import { theme } from '@enterslash/enterus/utils';
import { Icons } from '@enterslash/react-native-icons';

const Schedule = () => {
  const [shoModal, setShowModal] = useState(false);
  return (
    <>
      <ActionModal
        isModalVisible={shoModal}
        setIsModalVisible={() => setShowModal(false)}
      >
        <Card style={{ width: '100%', padding: 20 }}>
          <Text size={18} bold>
            Set Schedule
          </Text>
          <Space height={20} />
          <View style={{ gap: 10 }}>
            <Input small placeholder=" Title" />
            <Input small placeholder="Last Done" />
            <Input small placeholder="Next Schedule" />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                value={false}
                onChange={(v) => {
                  console.log(v);
                }}
              />
              <Text size={13} subtitle>
                Repeat the Schedule
              </Text>
            </View>
            <Space height={10} />
            <Button small>Add</Button>
          </View>
        </Card>
      </ActionModal>
      <Layout>
        <AppBar title={'Schedule'} />
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          <View style={style.schedule}>
            <Card style={style.optionContainer}>
              <Icons.Calendar />
              <Text> All Schedule</Text>
            </Card>
            <Card style={style.optionContainer}>
              <Icons.Clock />
              <Text> History</Text>
            </Card>
          </View>
          <Space height={30} />
          <Text size={18} bold>
            Today's Schedule
          </Text>
          <Space height={10} />
          <View style={{ gap: 10 }}>
            {Array.from({ length: 5 }).map(() => (
              <Card style={style.scheduleContainer}>
                <View style={style.testItem}>
                  <View style={style.iconStyle}>
                    <Icons.Clock color={theme.white} />
                  </View>
                  <Text>Test Schedule</Text>
                </View>
                <Checkbox
                  value={false}
                  onChange={(v) => {
                    console.log(v);
                  }}
                />
              </Card>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={style.floatingBtn}
        >
          <Icons.Plus color={theme.white} />
        </TouchableOpacity>
      </Layout>
    </>
  );
};
const style = StyleSheet.create({
  floatingBtn: {
    backgroundColor: theme.primary,
    width: 50,
    height: 50,
    position: 'absolute',
    borderRadius: 999,
    bottom: 30,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  schedule: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
  },
  optionContainer: {
    height: 90,
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  scheduleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  testItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconStyle: {
    width: 40,
    height: 40,
    backgroundColor: '#6BC787',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
});
export default Schedule;
