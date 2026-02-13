import React from 'react';
import {
  StyledIntroductionContainer,
  StyledIntroductionParagraphe,
} from './ProfileIntroduction.styles';

interface ProfileIntroductionProps {
  introduction: string;
}

export const ProfileIntroduction = ({
  introduction,
}: ProfileIntroductionProps) => {
  return (
    <StyledIntroductionContainer>
      {introduction && (
        <StyledIntroductionParagraphe data-testid="profile-introduction">
          &ldquo;{introduction}&rdquo;
        </StyledIntroductionParagraphe>
      )}
    </StyledIntroductionContainer>
  );
};
