import React from 'react';
import { H6 } from '@/src/components/ui/Headings';
import { Text } from '@/src/components/ui/Text';
import { StyledSelectTitleIconDescriptionLabel } from './SelectTitleIconDescriptionLabel.styles';

export interface SelectTitleIconDescriptionLabelProps {
  title: React.ReactNode;
  icon: React.ReactNode;
  description: string;
}

export const SelectTitleIconDescriptionLabel = ({
  title,
  icon,
  description,
}: SelectTitleIconDescriptionLabelProps) => {
  return (
    <StyledSelectTitleIconDescriptionLabel>
      <div className="img-container">{icon}</div>
      <div className="text-container">
        <H6 title={title} color="primaryBlue" />
        <Text>{description}</Text>
      </div>
    </StyledSelectTitleIconDescriptionLabel>
  );
};
