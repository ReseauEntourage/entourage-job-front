import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledH5 } from './Headings.styles';
import { HeadingComponentProps } from './Headings.types';

export const H5 = ({
  title,
  center = false,
  color,
  weight = 'semibold',
}: HeadingComponentProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledH5 color={color} mobile={!isDesktop} center={center} weight={weight}>
      {title}
    </StyledH5>
  );
};
