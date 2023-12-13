import React from 'react';
import {
  StyledCheckIcon,
  StyledCheckListElement,
} from 'src/components/utils/Lists/Lists.styles';

export const CheckListElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <StyledCheckListElement>
      <StyledCheckIcon />
      {children}
    </StyledCheckListElement>
  );
};
