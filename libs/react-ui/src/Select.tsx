import { Select as ANTSelect, SelectProps } from 'antd';
import { theme } from '@enterslash/enterus/utils';
import { Space } from './Space';
const { Option } = ANTSelect;

interface Props extends Partial<SelectProps> {
  label?: string;
  error?: string;
  options: {
    label: string;
    value: string;
  }[];
}

export const Select = ({ label, error, options, ...props }: Props) => {
  return (
    <div>
      <p className="mb-1 text-slate-500">{label}</p>
      <Space height={5} />
      <ANTSelect className="w-full" size="large" {...props}>
        {options.map((item, i) => (
          <Option key={i} value={item.value}>
            {item.label}
          </Option>
        ))}
      </ANTSelect>
      <Space height={5} />
      {error && <p style={{ color: theme.danger, fontSize: 13 }}>{error}</p>}
    </div>
  );
};
