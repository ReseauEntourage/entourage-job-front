import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledH6 } from './Headings.styles';

export const H6 = ({
  title,
  effect = '',
  center = false,
  color,
}: {
  title: React.ReactNode;
  effect?: string;
  center?: boolean;
  color?: string;
}) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledH6
      color={color}
      className={`${center ? 'center' : ''} ${isDesktop ? '' : 'mobile'}`}
      data-uk-scrollspy={effect}
    >
      {title}
    </StyledH6>
  );
};
