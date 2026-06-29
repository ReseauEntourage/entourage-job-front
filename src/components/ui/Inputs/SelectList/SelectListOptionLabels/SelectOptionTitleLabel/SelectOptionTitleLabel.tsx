import React from 'react';
import { Text } from '@/src/components/ui/Text';
import { StyledSelectOptionTitle } from './SelectOptionTitleLabel.styles';

interface SelectOptionTitleLabelProps {
  title: React.ReactNode;
  flexDirection?: 'row' | 'column';
}

export const SelectOptionTitleLabel = ({
  title,
  flexDirection = 'row',
}: SelectOptionTitleLabelProps) => {
  return (
    <StyledSelectOptionTitle $flexDirection={flexDirection}>
      <Text color="black">{title}</Text>
    </StyledSelectOptionTitle>
  );
};
