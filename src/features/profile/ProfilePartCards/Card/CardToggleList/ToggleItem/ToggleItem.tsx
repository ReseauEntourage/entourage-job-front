import React from 'react';
import { Text } from '@/src/components/ui';
import { ToggleSwitch } from '@/src/components/ui/Inputs/ToggleSwitch/ToggleSwitch';
import {
  StyledToggleItem,
  StyledToggleItemContainer,
} from './ToggleItem.styles';

export interface ToggleItemProps {
  icon?: React.ReactNode;
  name: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  isEditable?: boolean;
}

export const ToggleItem = ({
  icon,
  name,
  checked,
  onChange,
  isEditable = false,
}: ToggleItemProps) => {
  return (
    <StyledToggleItemContainer>
      {icon}
      <StyledToggleItem>
        <Text>{name}</Text>
        {isEditable && <ToggleSwitch checked={checked} onChange={onChange} />}
      </StyledToggleItem>
    </StyledToggleItemContainer>
  );
};
