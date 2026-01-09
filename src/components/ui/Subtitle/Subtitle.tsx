import React from 'react';
import { Text, TextProps } from '@/src/components/ui/Text';
import { StyledSubtitle } from './Subtitle.styles';

interface SubtitleProps extends TextProps {
  center?: boolean;
}

export const Subtitle = ({ children, center, ...restProps }: SubtitleProps) => {
  return (
    <StyledSubtitle center={center}>
      <Text {...restProps} center={center}>
        {children}
      </Text>
    </StyledSubtitle>
  );
};
