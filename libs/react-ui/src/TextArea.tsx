import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { Space } from './Space';
import { theme } from '@enterslash/enterus/utils';
const { TextArea: ANTTextArea } = Input;

interface Props extends Partial<TextAreaProps> {
  label?: string;
  error?: string;
}

export const TextArea = ({ label, error, ...props }: Props) => {
  return (
    <div>
      <p className="mb-1 text-slate-500">{label}</p>
      <Space height={5} />
      <ANTTextArea {...props} />
      <Space height={5} />
      {error && <p style={{ color: theme.danger, fontSize: 13 }}>{error}</p>}
    </div>
  );
};
