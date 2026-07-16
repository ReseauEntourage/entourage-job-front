import React from 'react';
import {
  StyledLi,
  StyledWarningIconContainer,
} from '@/src/components/ui/Lists/Lists.styles';
import { COLORS } from '@/src/constants/styles';
import { LucidIcon } from '../Icons/LucidIcon';

export const WarningListElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <StyledLi>
      <StyledWarningIconContainer>
        <LucidIcon name="TriangleAlert" size={15} color={COLORS.warning} />
      </StyledWarningIconContainer>
      {children}
    </StyledLi>
  );
};
