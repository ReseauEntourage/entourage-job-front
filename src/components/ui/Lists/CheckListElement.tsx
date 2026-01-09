import React from 'react';
import {
  StyledLi,
  StyledCheckIconContainer,
} from '@/src/components/ui/Lists/Lists.styles';
import { COLORS } from '@/src/constants/styles';
import { LucidIcon } from '../Icons/LucidIcon';

export const CheckListElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <StyledLi>
      <StyledCheckIconContainer>
        <LucidIcon name="Check" size={15} color={COLORS.primaryBlue} />
      </StyledCheckIconContainer>
      {children}
    </StyledLi>
  );
};
