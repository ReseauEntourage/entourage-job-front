import { passwordStrength } from 'check-password-strength';
import React from 'react';
import {
  StyledBar,
  StyledBars,
  StyledContainer,
  StyledLabel,
} from './PasswordStrengthIndicator.styles';

const STRENGTH_LABELS = ['Très faible', 'Faible', 'Moyen', 'Fort'];

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  if (!password) return null;

  const strength = passwordStrength(password);
  const index = strength.id;

  return (
    <StyledContainer>
      <StyledBars>
        {Array.from({ length: 4 }, (_, i) => (
          <StyledBar key={i} active={i <= index} strengthIndex={index} />
        ))}
      </StyledBars>
      <StyledLabel strengthIndex={index}>{STRENGTH_LABELS[index]}</StyledLabel>
    </StyledContainer>
  );
};
