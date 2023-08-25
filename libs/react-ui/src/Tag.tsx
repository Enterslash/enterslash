import { Tag as ATag, TagType } from 'antd';

interface Props extends React.ComponentProps<typeof ATag> {
    children: React.ReactNode;
}

export const Tag = ({ children, ...props }: Props) => {
  return <ATag {...props}>{children}</ATag>;
};
