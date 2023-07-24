import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledH4 } from './Headings.styles';

export const H4 = ({
  title,
  center = false,
  color,
}: {
  title: string;
  center?: boolean;
  color?: string;
}) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledH4
      className={`${center ? 'center' : ''} ${isDesktop ? '' : 'mobile'}`}
      color={color}
    >
      {title}
    </StyledH4>
  );
};
