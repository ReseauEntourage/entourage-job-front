import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledH1 } from './Headings.styles';
import { HeadingComponentProps } from './Headings.types';

export const H1 = ({
  title,
  color,
  center = false,
  effect,
  weight = 'bold',
}: HeadingComponentProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledH1
      color={color}
      center={center}
      weight={weight}
      mobile={!isDesktop}
      data-uk-scrollspy={effect}
    >
      {title}
    </StyledH1>
  );
};

H1.defaultProps = { effect: '' };
