import React from 'react';
import { StyledH1 } from './Headings.styles';

export const H1 = ({
  title,
  effect,
  color,
}: {
  title: string;
  effect?: string;
  color: string;
}) => {
  return (
    <StyledH1 color={color} data-uk-scrollspy={effect}>
      {title}
    </StyledH1>
  );
};

H1.defaultProps = { effect: '' };
