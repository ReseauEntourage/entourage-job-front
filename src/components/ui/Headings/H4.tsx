import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledH4 } from './Headings.styles';
import { HeadingComponentProps } from './Headings.types';

export const H4 = ({
  title,
  center = false,
  color,
  weight = 'semibold',
  noMarginBottom = false,
}: HeadingComponentProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledH4
      center={center}
      color={color}
      weight={weight}
      mobile={!isDesktop}
      noMarginBottom={noMarginBottom}
    >
      {title}
    </StyledH4>
  );
};
