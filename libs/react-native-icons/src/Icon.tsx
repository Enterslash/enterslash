import Icon from 'react-native-vector-icons/AntDesign';

type IIcon = {
  size?: number;
  color?: string;
};

const size = 25;

export const Icons = {
  Calendar: (arg: IIcon) => (
    <Icon name="calendar" size={arg.size || size} color={arg.color} />
  ),
  Clock: (arg: IIcon) => (
    <Icon name="clockcircleo" size={arg.size || size} color={arg.color} />
  ),
  Plus: (arg: IIcon) => (
    <Icon name="plus" size={arg.size || size} color={arg.color} />
  ),
  LogOut: (arg: IIcon) => (
    <Icon name="logout" size={arg.size || size} color={arg.color} />
  ),
};
