import React from 'react';
import { StyledBadge } from './Badge.styles';
import { BadgeVariant } from './Badge.types';

export { BadgeVariant } from './Badge.types';

export interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  borderRadius?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const Badge = ({
  variant,
  children,
  borderRadius,
  onClick,
}: BadgeProps) => {
  return (
    <StyledBadge
      variant={variant}
      $borderRadius={borderRadius}
      $clickable={!!onClick}
      onClick={onClick}
    >
      {children}
    </StyledBadge>
  );
};
