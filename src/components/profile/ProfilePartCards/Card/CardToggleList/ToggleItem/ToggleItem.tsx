import React from 'react';
import {
  StyledToggleItem,
  StyledToggleItemContainer,
} from './ToggleItem.styles';

export interface ToggleItemProps {
  icon?: React.ReactNode;
  name: string;
  value: boolean;
}

export const ToggleItem = ({ icon, name, value }: ToggleItemProps) => {
  return (
    <StyledToggleItemContainer>
      {icon}
      <StyledToggleItem>
        {name}
        <input type="checkbox" checked={value} />
      </StyledToggleItem>
    </StyledToggleItemContainer>
  );
};
