import React from 'react';
import { StyledBulletListElement } from 'src/components/utils/Lists/Lists.styles';

export const BulletListElement = ({ children }: { children: any }) => {
  return <StyledBulletListElement>{children}</StyledBulletListElement>;
};
