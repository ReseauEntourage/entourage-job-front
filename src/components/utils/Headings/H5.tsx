import React from 'react';
import { StyledH5 } from 'src/components/utils/Headings/Headings.styles';

export const H5 = ({
  title,
  effect = '',
  center = false,
  color,
}: {
  title: string;
  effect?: string;
  center?: boolean;
  color?: string;
}) => {
  return (
    <StyledH5
      color={color}
      className={`${center ? 'center' : ''}`}
      data-uk-scrollspy={effect}
    >
      {title}
    </StyledH5>
  );
};
