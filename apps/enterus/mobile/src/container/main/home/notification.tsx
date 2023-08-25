import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  Layout,
  Text,
  Space,
  Divider,
  Refresh,
  AppBar,
} from '@enterslash/react-native-ui';
import { css, theme } from '@enterslash/enterus/utils';
import { useHttp } from '../../../hook/useHttp';
import { get_notification } from '@enterslash/enterus/http-client';
import { INotificationModel } from '@enterslash/enterus/types';
import Private from '../../../components/Private';
import { genLink } from '../../../utils/helper';

const Notification = () => {
  const { data, request } = useHttp<INotificationModel[]>(() => {
    return get_notification();
  });

  useEffect(() => {
    request();
  }, []);

  return (
    <Layout>
      <View>
        <AppBar title="Notification" />
        <Divider vr />
        <FlatList
          refreshControl={<Refresh onRefresh={request} />}
          data={data}
          ItemSeparatorComponent={() => <Divider vr />}
          ListFooterComponent={<Space height={100} />}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                console.log(item.link);
                Linking.openURL(genLink(item.link));
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: css.padding.md,
                paddingVertical: css.padding.md,
                backgroundColor: !item.seen ? theme.secondary : theme.white,
              }}
            >
              <View>
                <Text bold={!item.seen}>{item.title}</Text>
                <Space height={5} />
                <Text bold={!item.seen} size={12} subtitle>
                  {item.message}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  topInfo: {
    height: 60,
    paddingHorizontal: css.padding.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const PrivateChat = () => {
  return (
    <Private>
      <Notification />
    </Private>
  );
};

export default PrivateChat;
