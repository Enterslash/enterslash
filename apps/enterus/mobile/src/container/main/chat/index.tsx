import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  TouchableOpacity,
  Image,
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
import {
  css,
  randomBackground,
  roomIdToTitle,
  theme,
} from '@enterslash/enterus/utils';
import { Search } from '@enterslash/icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationStack } from '../../../navigation/root';
import { useHttp } from '../../../hook/useHttp';
import { GetRoomsDTO } from '@enterslash/enterus/types';
import { useMessageStore } from '../../../store/message';
import { Icons } from '@enterslash/react-native-icons';
import { get_conversations } from '@enterslash/enterus/http-client';
import { SvgUri } from 'react-native-svg';

const Chat = () => {
  const navigation = useNavigation<NavigationStack>();
  const [search, setSearch] = useState('');
  const { conversations, setConversations } = useMessageStore();

  const { request } = useHttp<GetRoomsDTO[]>(() => {
    return get_conversations();
  });

  const refresh = () => {
    request().then((res) => {
      setConversations(res);
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const getSearchedMessages = conversations?.filter((conversation) => {
    return conversation.roomId.toLowerCase().includes(search.toLowerCase());
  });

  const handleSearch = (v) => {
    setSearch(v);
  };

  const joinRoom = () => {
    navigation.navigate('joinRoom');
  };

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
          refreshControl={<Refresh onRefresh={refresh} />}
          data={getSearchedMessages}
          ItemSeparatorComponent={() => <Divider vr />}
          ListFooterComponent={<Space height={100} />}
          keyExtractor={({ _id }) => _id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('message', {
                  roomId: item._id,
                });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: css.padding.md,
                paddingVertical: css.padding.md,
                // backgroundColor:
                //   item.unseenMessages > 0 ? theme.secondary : theme.white,
              }}
            >
              <SvgUri
                width={40}
                height={40}
                uri={randomBackground(item.roomId)}
              />
              <Space width={10} />
              <View>
                <Text>{roomIdToTitle(item.roomId)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity onPress={joinRoom} style={styles.floatingBtn}>
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

// const PrivateChat = () => {
//   return (
//     <Private>
//       <Chat />
//     </Private>
//   );
// };

export default Chat;
