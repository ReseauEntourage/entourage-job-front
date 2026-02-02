import React from 'react';
import { StyledBulletListElement } from '@/src/components/ui/Lists/Lists.styles';

export const BulletListElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <StyledBulletListElement>{children}</StyledBulletListElement>;
};
