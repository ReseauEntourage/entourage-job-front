import React from 'react';
import { StyledH1 } from './Headings.styles';

export const H1 = ({
  title,
  effect,
  color,
  center = false,
}: {
  title: string;
  effect?: string;
  color: string;
  center?: boolean;
}) => {
  return (
    <StyledH1
      className={`${center ? 'center' : ''}`}
      color={color}
      data-uk-scrollspy={effect}
    >
      {title}
    </StyledH1>
  );
};

H1.defaultProps = { effect: '' };
