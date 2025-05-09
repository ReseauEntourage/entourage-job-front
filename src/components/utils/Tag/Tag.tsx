import React from 'react';
import { ButtonIcon } from '../Button';
import { LucidIcon } from '../Icons/LucidIcon';
import { StyledTag } from './Tag.styles';

export interface TagProps {
  content: React.ReactNode;
  style?: 'default' | 'secondary' | 'hoverBlue';
  size?: 'default' | 'small';
  removeCallback?: () => void;
}

export const Tag = ({
  content,
  style = 'default',
  size = 'default',
  removeCallback,
}: TagProps) => {
  return (
    <StyledTag size={size} customStyle={style}>
      {content}
      {removeCallback && (
        <ButtonIcon
          icon={<LucidIcon name="X" size={13} color="black" />}
          onClick={removeCallback}
        />
      )}
    </StyledTag>
  );
};
