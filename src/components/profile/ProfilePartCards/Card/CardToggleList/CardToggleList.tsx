import React from 'react';
import { ProfilePartCard } from '../Card/Card';
import { StyledToggleList } from './CardToggleList.styles';
import { ToggleItem } from './ToggleItem/ToggleItem';

export type SwitchItem = {
  name: string;
  value: boolean;
  icon?: React.ReactNode;
};

export interface CardToggleListProps {
  title: string;
  items?: SwitchItem[];
  isEditable?: boolean;
  iaGenerated?: boolean;
}

export const CardToggleList = ({
  title,
  items = [],
  isEditable = false,
  iaGenerated,
}: CardToggleListProps) => {
  return (
    <ProfilePartCard
      title={title}
      isEditable={isEditable}
      iaGenerated={iaGenerated}
    >
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
    </ProfilePartCard>
  );
};
