import React from 'react';
import { StyledCheckListElement } from 'src/components/utils/Lists/Lists.styles';

export const CheckListElement = ({ children }: { children: any }) => {
  return <StyledCheckListElement>{children}</StyledCheckListElement>;
};
