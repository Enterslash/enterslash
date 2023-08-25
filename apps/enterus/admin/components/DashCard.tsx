import { Text } from '@enterslash/react-ui';
import React from 'react';

type Props = {
  title: string;
  meddleTitle: string;
  lastTitle?: string;
  className?: string;
  icon?: any;
};

export const DashCard = ({
  title,
  meddleTitle,
  lastTitle,
  icon,
  className,
}: Props) => {
  return (
    <div className={`${className} rounded-lg p-4 border`}>
      <Text className="text-gray-700">{title}</Text>
      <div className=' flex justify-between'>
        <Text className="font-bold text-4xl my-3">{meddleTitle}</Text>
        {icon && <span>{icon}</span>}
      </div>
      {lastTitle && <Text className="text-gray-700">{lastTitle}</Text>}
    </div>
  );
};
