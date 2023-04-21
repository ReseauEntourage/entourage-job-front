import React from 'react';
import { StyledCheckListElement } from 'src/components/utils/Lists/Lists.styles';

export const CheckList = ({ children }: { children: any }) => {
  return <StyledCheckListElement>{children}</StyledCheckListElement>;
};
