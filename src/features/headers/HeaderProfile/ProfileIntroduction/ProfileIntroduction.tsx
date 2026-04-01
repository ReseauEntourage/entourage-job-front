import React from 'react';
import { Text } from '@/src/components/ui';
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
          <Text variant="italic">&ldquo;{introduction}&rdquo;</Text>
        </StyledIntroductionParagraphe>
      )}
    </StyledIntroductionContainer>
  );
};
