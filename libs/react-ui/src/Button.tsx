import { Button as AButton, ButtonProps } from 'antd';

interface Props extends Partial<ButtonProps> {
  label?: string;
  error?: string;
  children?: React.ReactNode;
}

export const Button = ({ error, label, children, block, type, size, ...props }: Props) => {
  return (
    <AButton {...props} type={type || "primary"} block={block} size={size || "large"}>
      {children}
    </AButton>
  );
};
