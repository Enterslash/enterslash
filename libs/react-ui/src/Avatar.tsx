import { Avatar as ANTAvatar, AvatarProps } from 'antd';

type Props = Partial<AvatarProps>

export const Avatar = ({ ...props }: Props) => {
  return <ANTAvatar {...props} />;
};
