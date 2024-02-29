import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledH3 } from './Headings.styles';
import { HeadingComponentProps } from './Headings.types';

export const H3 = ({
  title,
  center = false,
  color,
  weight = 'bold',
}: HeadingComponentProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledH3 color={color} center={center} weight={weight} mobile={!isDesktop}>
      {title}
    </StyledH3>
  );
};
