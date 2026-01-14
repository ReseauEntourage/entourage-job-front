import React from 'react';
import { ButtonIcon } from '../Button';
import { LucidIcon } from '../Icons/LucidIcon';
import { StyledTag } from './Tag.styles';

export enum TagVariant {
  Default = 'default',
  Secondary = 'secondary',
  HoverBlue = 'hoverBlue',
  DarkBlue = 'darkBlue',
  PrimaryBlue = 'primaryBlue',
  ExtraDarkBlue = 'extraDarkBlue',
}

export enum TagSize {
  Default = 'default',
  Small = 'small',
  Large = 'large',
}

export interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  removeCallback?: () => void;
}

export const Tag = ({
  children,
  variant = TagVariant.Default,
  size = TagSize.Default,
  removeCallback,
}: TagProps) => {
  return (
    <StyledTag size={size} variant={variant}>
      {children}
      {removeCallback && (
        <ButtonIcon
          icon={<LucidIcon name="X" size={13} color="black" />}
          onClick={removeCallback}
        />
      )}
    </StyledTag>
  );
};
