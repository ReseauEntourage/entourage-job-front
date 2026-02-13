import React from 'react';
import { Button } from '@/src/components/ui/Button/Button';
import { Text } from '@/src/components/ui/Text/Text';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { StepContent } from '../DashboardNextSteps.types';
import {
  StyledStepBtnContainer,
  StyledStepContainer,
  StyledStepImage,
} from './Step.style';

export interface StepProps {
  step: StepContent;
}

export const Step = ({ step }: StepProps) => {
  const currentUser = useAuthenticatedUser();
  return (
    <StyledStepContainer>
      <StyledStepImage>{step.icon}</StyledStepImage>
      <Text color="primaryBlue" center>
        {step.title}
      </Text>
      <Text center>{step.content}</Text>
      <StyledStepBtnContainer>
        <Button
          variant="secondary"
          rounded
          href={step.cta.href}
          onClick={() => step.cta.onClick && step.cta.onClick(currentUser)}
          isExternal
          newTab
        >
          {step.cta.label}
        </Button>
      </StyledStepBtnContainer>
    </StyledStepContainer>
  );
};
