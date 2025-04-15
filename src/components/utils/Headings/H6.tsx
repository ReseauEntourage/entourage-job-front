import React from 'react';
// import { useIsDesktop } from 'src/hooks/utils';
import { StyledH6 } from './Headings.styles';
import { HeadingComponentProps } from './Headings.types';

export const H6 = ({
  title,
  center = false,
  color,
  weight = 'bold',
}: HeadingComponentProps) => {
  // const isDesktop = useIsDesktop();
  return (
    <StyledH6
      color={color}
      center={center}
      weight={weight}
      // mobile={!isDesktop}
    >
      {title}
    </StyledH6>
  );
};
