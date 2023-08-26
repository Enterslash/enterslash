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
import { Search } from '@enterslash/icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../../../navigation/root';
import { useHttp } from '../../../hook/useHttp';
import { get_conversations } from '@enterslash/enterus/http-client';
import { GetConversationsDTO } from '@enterslash/enterus/types';
import { useMessageStore } from '../../../store/message';
import Private from '../../../components/Private';
import { Icons } from '@enterslash/react-native-icons';

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

  const joinRoom = () => {
    navigation.navigate('joinRoom');
  }

  return (
    <Layout>
      <View>
        <View style={styles.topInfo}>
          <Input
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
      <TouchableOpacity
        onPress={joinRoom}
        style={styles.floatingBtn}
      >
        <Icons.Plus color={theme.white} />
      </TouchableOpacity>
    </Layout>
  );
};

const styles = StyleSheet.create({
  floatingBtn: {
    backgroundColor: theme.primary,
    width: 50,
    height: 50,
    position: 'absolute',
    borderRadius: 999,
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topInfo: {
    paddingHorizontal: css.padding.md,
    paddingVertical: css.padding.sm,
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