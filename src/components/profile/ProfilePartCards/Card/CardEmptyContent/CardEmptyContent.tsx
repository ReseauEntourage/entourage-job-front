import React, { useMemo } from 'react';
import {
  StyledCardEmptyContent,
  StyledContentContainer,
  StyledIconContainer,
} from './CardEmptyContent.styles';

export interface CardEmptyContentProps {
  content: React.ReactNode;
  icon: React.ReactNode;
  smallCard?: boolean;
}

export const CardEmptyContent = ({
  content,
  icon,
  smallCard,
}: CardEmptyContentProps) => {
  const iconProps = useMemo(() => {
    if (smallCard) {
      return {
        width: 50,
        height: 50,
      };
    }
    return {
      width: 65,
      height: 65,
    };
  }, [smallCard]);
  return (
    <StyledCardEmptyContent>
      {/* Display icon with correct props */}
      <StyledIconContainer>
        {React.cloneElement(
          icon as React.ReactElement<{ width: number; height: number }>,
          iconProps
        )}
      </StyledIconContainer>
      <StyledContentContainer>{content}</StyledContentContainer>
    </StyledCardEmptyContent>
  );
};
