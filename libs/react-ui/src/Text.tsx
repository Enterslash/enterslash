import { CSSProperties } from 'react';

type Typography =
  | 'base'
  | 'pageTitle'
  | 'label'
  | 'paragraph'
  | 'sectionTitle'
  | 'subTitle';

interface Props {
  size?: Typography;
  children: React.ReactNode;
  color?: string;
  className?: string;
}

const styles: Record<Typography, CSSProperties> = {
  base: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
  },
  pageTitle: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
  },
  subTitle: {
    fontSize: 13,
    opacity: 0.5,
  },
};

export const Text = ({ size, children, color, className }: Props) => {
  return (
    <p style={{ color, ...(size ? styles[size] : {}) }} className={className}>
      {children}
    </p>
  );
};
