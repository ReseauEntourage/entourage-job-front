import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledH2 } from './Headings.styles';

export const H2 = ({
  title,
  type = '',
  color,
  center = false,
}: {
  title: string;
  type?: string;
  color?: string;
  center?: boolean;
}) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledH2
      className={`${type} ${center ? 'center' : ''} ${
        isDesktop ? '' : 'mobile'
      }`}
      color={color}
    >
      {title}
    </StyledH2>
  );
};
