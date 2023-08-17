import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledH3 } from './Headings.styles';

export const H3 = ({
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
    <StyledH3
      className={`${center ? 'center' : ''} ${isDesktop ? '' : 'mobile'}`}
      color={color}
    >
      {title}
    </StyledH3>
  );
};
