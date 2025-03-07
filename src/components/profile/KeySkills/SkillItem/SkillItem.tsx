import React from 'react';
import { ButtonIcon, Text } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { StyledSkillItem } from './SkillItem.styles';

export interface SkillItemProps {
  title: string;
  onRemove?: () => void;
}
export const SkillItem = ({ title, onRemove }: SkillItemProps) => {
  return (
    <StyledSkillItem>
      <Text>{title}</Text>
      {onRemove && (
        <ButtonIcon
          icon={<LucidIcon name="X" size={13} color="black" />}
          onClick={onRemove}
        />
      )}
    </StyledSkillItem>
  );
};
