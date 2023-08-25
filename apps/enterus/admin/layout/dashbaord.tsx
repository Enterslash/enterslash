import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, MenuProps, Modal } from '@enterslash/react-ui';
import { Space } from '@enterslash/react-ui';
import { useRouter } from 'next/router';
import { useAppState } from '../store/appState';
import AuthBanner from '../assets/logo.svg';
import { useAction } from '../hook/useAction';
import { UserType } from '@enterslash/enterus/types';
import { checkAccess } from '../utils/checkAccess';
import { ICON } from '@enterslash/react-icons';

const { confirm } = Modal;

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick?: () => void
): MenuItem {
  return {
    key,
    icon,
    label,
    onClick,
  } as MenuItem;
}

const navigation = [
  {
    key: '1',
    label: 'Dashboard',
    icon: <ICON.PIE_CHART />,
    path: '/',
    access: [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.PROVIDER],
  },
  {
    key: '2',
    label: 'Services',
    icon: <ICON.DESKTOP />,
    path: '/services',
    access: [UserType.SUPER_ADMIN, UserType.ADMIN],
  },
  {
    key: '3',
    label: 'Categories',
    icon: <ICON.ORDER_LIST />,
    path: '/categories',
    access: [UserType.SUPER_ADMIN, UserType.ADMIN],
  },
  {
    key: '4',
    label: 'Bookings',
    icon: <ICON.BOOK />,
    path: '/bookings',
    access: [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.PROVIDER],
  },
  {
    key: '5',
    label: 'Provider Requests',
    icon: <ICON.USER_GROUP />,
    path: '/provider_requests',
    access: [UserType.SUPER_ADMIN, UserType.ADMIN],
  },
  {
    key: '6',
    label: 'Service Requests',
    icon: <ICON.ACCOUNT_BOOK />,
    path: '/service_requests',
    access: [UserType.SUPER_ADMIN, UserType.ADMIN],
  },
  {
    key: '7',
    label: 'Blog',
    icon: <ICON.CONTAINER />,
    path: '/blog',
    access: [UserType.SUPER_ADMIN, UserType.ADMIN],
  },
  {
    key: '8',
    label: 'Log',
    icon: <ICON.LOG />,
    path: '/log',
    access: [UserType.SUPER_ADMIN, UserType.ADMIN],
  },
  {
    key: '9',
    label: 'Message',
    icon: <ICON.MESSAGE />,
    path: '/message',
    access: [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.PROVIDER],
  },
];

const DashboardLayout = ({
  children,
  className,
  parentClassName,
}: {
  children: React.ReactNode;
  className?: string;
  parentClassName?: string;
}) => {
  const router = useRouter();
  const { setSidebar, sidebar } = useAppState();
  const { logout } = useAction();

  const getActiveKey = () => {
    const path = router.pathname;
    const nav = navigation.find((item) => item.path === path);
    return nav?.key || '1';
  };

  const askLogout = () => {
    confirm({
      title: 'Do you want to logout?',
      icon: <ICON.EXCLAMATION_CIRCLE />,
      content: 'You will be logged out of the system.',
      onOk() {
        logout();
      },
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <div className="h-[60px] bg-white flex items-center justify-between border-b px-6">
        <div className="flex items-center">
          <Button
            type="text"
            icon={sidebar ? <ICON.MENU_UNFOLD /> : <ICON.MENU_FOLD />}
            onClick={() => setSidebar(!sidebar)}
            style={{
              fontSize: '16px',
              margin: '0 25px 0 0',
            }}
          />
          <Space width={10} />
          <img src={AuthBanner} className="h-8" />
          <p className="font-bold text-xl ml-2">
            <span>Enterus</span> <span className="text-primary">Admin</span>
          </p>
        </div>
        <div className="cursor-pointer" onClick={askLogout}>
          <ICON.LOGOUT />
        </div>
      </div>
      <Layout style={{ minHeight: '100%' }}>
        <Sider className="border-r" theme="light" collapsed={sidebar}>
          <div className="demo-logo-vertical" />
          <Menu
            selectedKeys={[getActiveKey()]}
            mode="inline"
            items={navigation
              .filter((nav) => checkAccess(nav.access))
              .map((nav) => ({
                ...nav,
                onClick: () => router.push(nav.path),
              }))}
          />
        </Sider>
        <div
          className={
            'h-[calc(100vh-40px)] overflow-auto w-full p-6 ' + parentClassName
          }
        >
          <div className={'bg-white mb-6 px-6 py-8 ' + className}>
            {children}
          </div>
        </div>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
