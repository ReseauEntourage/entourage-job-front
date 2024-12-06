import React from 'react';
import { Button } from 'src/components/utils/Button/Button';
import { H5 } from 'src/components/utils/Headings';
import { Text } from 'src/components/utils/Text/Text';
import { COLORS } from 'src/constants/styles';
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
      <H5
        title={step.title}
        center
        color={COLORS.primaryBlue}
        weight="normal"
      />
      <Text center>{step.content}</Text>
      <StyledStepBtnContainer>
        <Button
          style="custom-primary-inverted"
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
