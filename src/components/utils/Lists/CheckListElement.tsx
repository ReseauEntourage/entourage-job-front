import React from 'react';
import { COLORS } from '@/src/constants/styles';
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
        <LucidIcon name="Check" size={15} color={COLORS.primaryBlue} />
      </StyledCheckIconContainer>
      {children}
    </StyledLi>
  );
};
