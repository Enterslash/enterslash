import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  bodyClass?: string;
  headerClass?: string;
  style?: React.CSSProperties;
}

export const Card = ({
  children,
  className,
  header,
  bodyClass,
  headerClass,
  style
}: Props) => {
  return (
    <div style={style} className={`border rounded-md ${className}`}>
      {header && (
          <div className={`p-3 border-b ${headerClass}`}>{header}</div>
      )}
      <div className={`${bodyClass}`}>{children}</div>
    </div>
  );
};
