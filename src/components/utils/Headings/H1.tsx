import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledH1 } from './Headings.styles';

export const H1 = ({
  title,
  effect,
  color,
  center = false,
}: {
  title: string;
  effect?: string;
  color: string;
  center?: boolean;
}) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledH1
      className={`${center ? 'center' : ''} ${isDesktop ? '' : 'mobile'}`}
      color={color}
      data-uk-scrollspy={effect}
    >
      {title}
    </StyledH1>
  );
};

H1.defaultProps = { effect: '' };
