import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledH2 } from './Headings.styles';
import { HeadingComponentProps } from './Headings.types';

export const H2 = ({
  title,
  variant,
  color,
  center = false,
  weight = 'semibold',
}: HeadingComponentProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledH2
      className={`${variant}`}
      color={color}
      center={center}
      weight={weight}
      mobile={!isDesktop}
    >
      {title}
    </StyledH2>
  );
};
