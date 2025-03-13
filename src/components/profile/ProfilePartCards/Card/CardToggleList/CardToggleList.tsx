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
}

export const CardToggleList = ({ items = [] }: CardToggleListProps) => {
  return (
    <StyledToggleList>
      {items.map((item, idx) => (
        <ToggleItem
          key={idx}
          icon={item.icon}
          name={item.name}
          value={item.value}
        />
      ))}
    </StyledToggleList>
  );
};
