import React from 'react';
import { StyledBulletListElement } from 'src/components/utils/Lists/Lists.styles';

export const BulletListElement = ({ children }: { children: React.ReactNode }) => {
  return <StyledBulletListElement>{children}</StyledBulletListElement>;
};
