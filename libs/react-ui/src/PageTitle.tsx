import React from 'react';
import { Text } from './Text';
import { LeftOutlined } from '@ant-design/icons';
import { Space } from './Space';
import { useRouter } from 'next/router';

interface Props {
  children: React.ReactNode;
  onBackClick?: () => void;
}

export const PageTitle = ({ children, onBackClick }: Props) => {
  const router = useRouter();

  const backClickHandler = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };
  return (
    <div className="flex">
      <LeftOutlined
        onClick={backClickHandler}
        style={{ fontSize: '20px' }}
        rev={undefined}
      />
      <Space width={20} />
      <Text size="pageTitle">{children}</Text>
    </div>
  );
};
