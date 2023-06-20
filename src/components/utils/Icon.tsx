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

const Icon = ({ name, ratio, flip, className, id, style }: IconProps) => {
  return (
    <span
      id={id}
      data-uk-icon={`icon: ${name}; ratio: ${ratio}`}
      className={className}
      style={{ transform: flip ? 'scale(-1, 1)' : undefined, ...style }}
    />
  );
};

Icon.defaultProps = {
  className: '',
  ratio: 1,
  flip: false,
  id: undefined,
  style: {},
};

export const IconNoSSR = dynamic(
  () => {
    return import('src/components/utils/Icon').then((mod) => mod.Icon);
  },
  { ssr: false }
);

export { Icon };
