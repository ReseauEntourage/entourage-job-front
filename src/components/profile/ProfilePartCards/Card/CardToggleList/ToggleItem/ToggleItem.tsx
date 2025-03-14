import React from 'react';
import {
  StyledToggleItem,
  StyledToggleItemContainer,
} from './ToggleItem.styles';

export interface ToggleItemProps {
  icon?: React.ReactNode;
  name: string;
  value: boolean;
  isEditable?: boolean;
}

export const ToggleItem = ({
  icon,
  name,
  value,
  isEditable = false,
}: ToggleItemProps) => {
  return (
    <StyledToggleItemContainer>
      {icon}
      <StyledToggleItem>
        {name}
        {isEditable && <input type="checkbox" checked={value} />}
      </StyledToggleItem>
    </StyledToggleItemContainer>
  );
};
