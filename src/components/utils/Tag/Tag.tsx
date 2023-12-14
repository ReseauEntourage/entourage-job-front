import React from 'react';
import { StyledTag } from './Tag.styles';

export const Tag = ({ content }: { content: React.ReactNode }) => {
  return <StyledTag>{content}</StyledTag>;
};
