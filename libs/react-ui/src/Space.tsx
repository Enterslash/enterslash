import React from 'react';

interface Props {
  width?: number;
  height?: number;
}

export const Space = ({width, height}: Props) => {
  return <div style={{width: width || 0, height: height || 0}}></div>;
}