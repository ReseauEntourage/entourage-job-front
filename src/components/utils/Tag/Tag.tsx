import React from 'react';
import { StyledTag } from './Tag.styles';

export const Tag = ({
  content,
  style = 'default',
  size = 'default',
}: {
  content: React.ReactNode;
  style?: 'default' | 'secondary' | 'hoverBlue';
  size?: 'default' | 'small';
}) => {
  return (
    <StyledTag size={size} customStyle={style}>
      {content}
    </StyledTag>
  );
};
