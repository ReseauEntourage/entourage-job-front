import React from 'react';
import { StyledH6 } from './Headings.styles';

export const H6 = ({
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
    <StyledH6
      color={color}
      className={`${center ? 'center' : ''}`}
      data-uk-scrollspy={effect}
    >
      {title}
    </StyledH6>
  );
};
