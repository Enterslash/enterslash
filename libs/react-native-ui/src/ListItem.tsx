import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowRight, LocationMarker, User } from '@enterslash/icons';
import { theme } from '@enterslash/enterus/utils';
import { Space } from './Space';
import { Text } from './Text';

type Props = {
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
};

export const ListItem = ({ icon, title, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.list}>
      <View style={styles.listInfo}>
        {/* <View style={styles.icon}>{icon}</View> */}
        {/* <Space width={15} /> */}
        <Text bold size={18}>
          {title}
        </Text>
      </View>
      <ArrowRight />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.grey200,
    borderRadius: 10,
  },
  icon: {
    borderRadius: 10,
    padding: 7,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});
