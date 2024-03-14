import React from 'react';
import { StyledText } from './Text.styles';

interface TextProps {
  id: string;
  title: string | JSX.Element;
}
export function Text({ id, title }: TextProps) {
  return (
    <StyledText id={id} data-testid={id}>
      {title}
    </StyledText>
  );
}
