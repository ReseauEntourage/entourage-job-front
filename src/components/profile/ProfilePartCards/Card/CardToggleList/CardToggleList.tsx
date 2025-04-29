import React from 'react';
import { StyledToggleList } from './CardToggleList.styles';
import { ToggleItem } from './ToggleItem/ToggleItem';

export type SwitchItem = {
  name: string;
  value: boolean;
  icon?: React.ReactNode;
};

export interface CardToggleListProps {
  items?: SwitchItem[];
  isEditable?: boolean;
}

export const CardToggleList = ({
  items = [],
  isEditable,
}: CardToggleListProps) => {
  return (
    <StyledToggleList>
      {items.map((item, idx) => (
        <ToggleItem
          key={idx}
          icon={item.icon}
          name={item.name}
          value={item.value}
          isEditable={isEditable}
        />
      ))}
    </StyledToggleList>
  );
};
