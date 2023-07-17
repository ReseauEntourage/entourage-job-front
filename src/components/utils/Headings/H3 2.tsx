import React from 'react';
import { StyledH3 } from './Headings.styles';

export const H3 = ({
  title,
  center = false,
}: {
  title: string;
  center?: boolean;
}) => {
  return <StyledH3 className={`${center ? 'center' : ''}`}>{title}</StyledH3>;
};
