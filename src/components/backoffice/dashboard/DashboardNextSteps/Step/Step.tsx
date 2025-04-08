import React from 'react';
import { Button } from 'src/components/utils/Button/Button';
import { Text } from 'src/components/utils/Text/Text';
import {
  StyledStepBtnContainer,
  StyledStepContainer,
  StyledStepImage,
} from './Step.style';

export interface Step {
  title: string;
  content: string;
  icon: React.ReactElement;
  cta: {
    label: string;
    href: string;
  };
}

export interface StepProps {
  step: Step;
}

export const Step = ({ step }: StepProps) => {
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
          isExternal
          newTab
        >
          {step.cta.label}
        </Button>
      </StyledStepBtnContainer>
    </StyledStepContainer>
  );
};
