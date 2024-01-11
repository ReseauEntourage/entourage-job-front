import React from 'react';
import { StyledTag } from './Tag.styles';

export const Tag = ({
  content,
  style = 'default',
}: {
  content: React.ReactNode;
  style?: 'default' | 'secondary';
}) => {
  return <StyledTag customStyle={style}>{content}</StyledTag>;
};
