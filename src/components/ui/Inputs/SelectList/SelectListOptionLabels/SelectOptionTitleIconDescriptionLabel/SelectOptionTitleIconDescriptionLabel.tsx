import React from 'react';
import { H6 } from '@/src/components/ui/Headings';
import { Text } from '@/src/components/ui/Text';
import {
  StyledIconContainer,
  StyledSelectOptionTitleIconDescriptionLabel,
  StyledTitleDescriptionContainer,
} from './SelectOptionTitleIconDescriptionLabel.styles';

export interface SelectOptionTitleIconDescriptionLabelProps {
  title: React.ReactNode;
  icon: React.ReactNode;
  description: string;
}

export const SelectOptionTitleIconDescriptionLabel = ({
  title,
  icon,
  description,
}: SelectOptionTitleIconDescriptionLabelProps) => {
  const formattedIcon = React.cloneElement(
    icon as React.ReactElement<{ width: number; height: number }>,
    {
      width: 55,
      height: 55,
    }
  );

  return (
    <StyledSelectOptionTitleIconDescriptionLabel>
      <StyledIconContainer>{formattedIcon}</StyledIconContainer>
      <StyledTitleDescriptionContainer>
        <H6 title={title} color="primaryBlue" />
        <Text>{description}</Text>
      </StyledTitleDescriptionContainer>
    </StyledSelectOptionTitleIconDescriptionLabel>
  );
};
