import React from 'react';
import { LucidIcon } from '../Icons/LucidIcon';
import {
  StyledLi,
  StyledCheckIconContainer,
} from 'src/components/utils/Lists/Lists.styles';

export const CheckListElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <StyledLi>
      <StyledCheckIconContainer>
        <LucidIcon name="Check" size={15} />
      </StyledCheckIconContainer>
      {children}
    </StyledLi>
  );
};
