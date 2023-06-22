import dynamic from 'next/dynamic';
import React from 'react';

interface IconProps {
  name: string;
  ratio?: number | string;
  flip?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const Icon = ({
  id,
  name,
  className = '',
  ratio = 1,
  flip = false,
  style = {},
}: IconProps) => {
  return (
    <span
      id={id}
      data-uk-icon={`icon: ${name}; ratio: ${ratio}`}
      className={className}
      style={{ transform: flip ? 'scale(-1, 1)' : undefined, ...style }}
    />
  );
};
