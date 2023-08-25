import {
  AccountBookOutlined,
  ArrowRightOutlined,
  BookOutlined,
  ContainerOutlined,
  DeleteTwoTone,
  DesktopOutlined,
  EditTwoTone,
  ExclamationCircleFilled,
  GlobalOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  SendOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
type Icon = {
  onClick?: () => void;
  style?: React.CSSProperties;
};

const size = 18;
const color = 'black';

export const ICON = {
  ARROW_RIGHT: () => (
    <ArrowRightOutlined
      style={{ fontSize: size, color: color }}
      rev={undefined}
    />
  ),
  PIE_CHART: () => (
    <PieChartOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  DESKTOP: () => (
    <DesktopOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  ORDER_LIST: () => (
    <OrderedListOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  BOOK: () => (
    <BookOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  USER_GROUP: () => (
    <UsergroupAddOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  ACCOUNT_BOOK: () => (
    <AccountBookOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  CONTAINER: () => (
    <ContainerOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  MESSAGE: () => (
    <MessageOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  MENU_FOLD: () => (
    <MenuFoldOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  MENU_UNFOLD: () => (
    <MenuUnfoldOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  LOGOUT: () => (
    <LogoutOutlined
      style={{
        fontSize: '20px',
      }}
      rev={undefined}
    />
  ),
  EXCLAMATION_CIRCLE: () => (
    <ExclamationCircleFilled
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  SEND: ({ onClick }: Icon) => (
    <SendOutlined
      className="text-2xl text-primary"
      onClick={onClick}
      rev={undefined}
    />
  ),
  EDIT_TWO: ({ onClick }: Icon) => (
    <EditTwoTone
      className="text-primary"
      onClick={onClick}
      rev={undefined}
      style={{ fontSize: '20px' }}
    />
  ),
  DELETE_TWO: ({ onClick }: Icon) => (
    <DeleteTwoTone
      onClick={onClick}
      rev={undefined}
      style={{ fontSize: '20px', color: 'red' }}
    />
  ),
  LOG: () => (
    <GlobalOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
};
