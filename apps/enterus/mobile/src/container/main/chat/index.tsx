import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Layout,
  Input,
  Text,
  Avatar,
  Space,
  Divider,
  Refresh,
} from '@enterslash/react-native-ui';
import { css, fullName, theme } from '@enterslash/enterus/utils';
import { Bell, Search } from '@enterslash/icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../../../navigation/root';
import { useHttp } from '../../../hook/useHttp';
import { get_conversations } from '@enterslash/enterus/http-client';
import { GetConversationsDTO } from '@enterslash/enterus/types';
import { useMessageStore } from '../../../store/message';
import Private from '../../../components/Private';

const Chat = () => {
  const navigation = useNavigation<NavigationStack>();
  const [search, setSearch] = useState('');
  const { conversations, setConversations } = useMessageStore();

  const { request } = useHttp<GetConversationsDTO[]>(() => {
    return get_conversations();
  });
  useEffect(() => {
    request().then((res) => {
      setConversations(res);
    });
  }, []);

  const getSearchedMessages = conversations?.filter((conversation) => {
    return (
      conversation.service.title.toLowerCase().includes(search.toLowerCase()) ||
      fullName(conversation).toLowerCase().includes(search.toLowerCase()) ||
      conversation.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSearch = (v) => {
    setSearch(v);
  };

  return (
    <Layout>
      <View>
        <View style={styles.topInfo}>
          <Input
            style={{ flex: 1 }}
            value={search}
            onChangeText={handleSearch}
            small
            rounded
            leftIcon={<Search fill={theme.grey200} />}
            placeholder="Search services"
          />
        </View>
        <Divider vr />
        <FlatList
          refreshControl={<Refresh onRefresh={request} />}
          data={getSearchedMessages}
          ItemSeparatorComponent={() => <Divider vr />}
          ListFooterComponent={<Space height={100} />}
          keyExtractor={({ bookingId }) => bookingId}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('message', {
                  bookingId: item.bookingId,
                });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: css.padding.md,
                paddingVertical: css.padding.md,
                backgroundColor:
                  item.unseenMessages > 0 ? theme.secondary : theme.white,
              }}
            >
              <Avatar source={item.avatar} size={50} rounded />
              <Space width={10} />
              <View>
                <Text bold={item.unseenMessages > 0}>{fullName(item)}</Text>
                <Text bold={item.unseenMessages > 0} size={12} subtitle>
                  {item.service.title}
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
      <Chat />
    </Private>
  );
};

export default PrivateChat;
