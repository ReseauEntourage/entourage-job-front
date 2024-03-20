import React from 'react';
import {
  StyledCheckIcon,
  StyledLi,
} from 'src/components/utils/Lists/Lists.styles';

export const CheckListElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <StyledLi>
      <StyledCheckIcon />
      {children}
    </StyledLi>
  );
};
