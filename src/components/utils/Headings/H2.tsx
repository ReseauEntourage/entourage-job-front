import React from 'react';
import { StyledH2 } from './Headings.styles';

export const H2 = ({
  title,
  type = '',
  color,
  center = false,
}: {
  title: string;
  type?: string;
  color?: string;
  center?: boolean;
}) => {
  return (
    <StyledH2 className={`${type} ${center ? 'center' : ''}`} color={color}>
      {title}
    </StyledH2>
  );
};
