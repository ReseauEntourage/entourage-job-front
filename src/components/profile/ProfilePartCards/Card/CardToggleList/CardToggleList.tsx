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
  onChange?: (updatedItems: SwitchItem[]) => void;
}

export const CardToggleList = ({
  items = [],
  isEditable,
  onChange,
}: CardToggleListProps) => {
  const handleChange = (idx: number) => {
    const updatedItems = items.map((item, index) => {
      if (index === idx) {
        return { ...item, value: !item.value };
      }
      return item;
    });
    if (onChange) onChange(updatedItems);
  };
  return (
    <StyledToggleList>
      {items.map((item, idx) => (
        <ToggleItem
          key={idx}
          icon={item.icon}
          name={item.name}
          checked={item.value}
          isEditable={isEditable}
          onChange={() => handleChange(idx)}
        />
      ))}
    </StyledToggleList>
  );
};
