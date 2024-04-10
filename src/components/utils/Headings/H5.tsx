import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledH5 } from './Headings.styles';
import { HeadingComponentProps } from './Headings.types';

export const H5 = ({
  title,
  effect,
  center = false,
  color,
  weight = 'bold',
}: HeadingComponentProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledH5
      color={color}
      data-uk-scrollspy={effect}
      mobile={!isDesktop}
      center={center}
      weight={weight}
    >
      {title}
    </StyledH5>
  );
};
