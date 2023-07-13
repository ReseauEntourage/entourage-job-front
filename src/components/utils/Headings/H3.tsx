import React from 'react';
import { StyledH3 } from './Headings.styles';

export const H3 = ({
  title,
  center = false,
  color,
}: {
  title: string;
  center?: boolean;
  color?: string;
}) => {
  return (
    <StyledH3 className={`${center ? 'center' : ''}`} color={color}>
      {title}
    </StyledH3>
  );
};
