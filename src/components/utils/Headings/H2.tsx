import React from 'react';
import { StyledH2 } from './Headings.styles';

export const H2 = ({ title, type = '' }: { title: string; type?: string }) => {
  return <StyledH2 className={type}>{title}</StyledH2>;
};
