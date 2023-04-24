import React from 'react';
import { StyledH6 } from 'src/components/utils/Headings/Headings.styles';

export const H6 = ({ title, effect }: { title: string; effect?: string }) => {
  return <StyledH6 data-uk-scrollspy={effect}>{title}</StyledH6>;
};

H6.defaultProps = {
  effect: '',
};
