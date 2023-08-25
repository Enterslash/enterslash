import { Table as ATable } from 'antd';

interface Props extends React.ComponentProps<typeof ATable> {
  className: string;
}

export const Table = ({ ...props }: Props) => {
  return <ATable {...props} />;
};
