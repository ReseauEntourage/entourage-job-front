import React from 'react';
import { IconNoSSR } from 'src/components/utils/Icon';

interface ButtonIconProps {
  name: string;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
  href?: string;
  ratio?: number;
  style?: React.CSSProperties;
  dataTestId?: string;
}

export const ButtonIcon = ({
  name,
  onClick,
  className,
  href,
  ratio,
  tooltip,
  style,
  dataTestId,
}: ButtonIconProps) => {
  return (
    <a
      className="uk-text-emphasis uk-flex uk-flex-middle"
      href={href}
      data-uk-tooltip={tooltip}
      onClick={onClick}
      data-testid={dataTestId}
    >
      <IconNoSSR
        name={name}
        className={className}
        ratio={ratio}
        style={style}
      />
    </a>
  );
};

ButtonIcon.defaultProps = {
  href: null,
  tooltip: null,
  className: null,
  style: {},
  ratio: 1.5,
  onClick: null,
  dataTestId: '',
};
