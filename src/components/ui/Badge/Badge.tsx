import React from 'react';
import { StyledBadge } from './Badge.styles';
import { BadgeSize, BadgeVariant } from './Badge.types';

export { BadgeVariant } from './Badge.types';
export type { BadgeSize } from './Badge.types';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: BadgeSize;
  borderRadius?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const Badge = ({
  variant,
  children,
  size = 'medium',
  borderRadius,
  onClick,
}: BadgeProps) => {
  return (
    <StyledBadge
      variant={variant}
      $size={size}
      $borderRadius={borderRadius}
      $clickable={!!onClick}
      onClick={onClick}
    >
      {children}
    </StyledBadge>
  );
};
