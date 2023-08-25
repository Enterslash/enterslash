import { theme } from '@enterslash/enterus/utils';
import { Input as AInput, InputProps } from 'antd';
import { Space } from './Space';

interface Props extends Partial<InputProps> {
  label?: string;
  error?: string;
}

export const Input = ({ error, label, ...props }: Props) => {
  return (
    <div>
      <p className="mb-1 text-slate-500">{label}</p>
      <Space height={5}/>
      <AInput size="large" {...props} />
      <Space height={5}/>
      {error && <p style={{color: theme.danger, fontSize: 13}}>{error}</p>}
    </div>
  );
};
